import { request } from "http"

import { checkPermissions, getPermissions } from "../../storage/permissions"
import { getAddresses } from "../../storage/wallet/index"

let restrictedMethods = [
  "quai_requestAccounts",
  "personal_sign",
  "quai_sendTransaction"
]

export async function handleRequest(body: any) {
  let url = new URL(body.url).hostname

  // Unrestricted methods
  switch (body.method) {
    case "wallet_getPermissions":
      return getPermissions(url)
    case "wallet_requestPermissions":
      let permissions = (await requestPermissions(
        url,
        body.requestedMethods
      )) as any
      if (permissions.code !== 200) {
        return { code: 4001, message: "Permission denied" }
      }
      return {
        code: 200,
        message: "Permission granted",
        data: body.requestedMethods
      }
  }

  let hasPermissions = await checkPermissions(url, body.method)
  if (!hasPermissions) {
    // body.method is a restricted method
    if (restrictedMethods.includes(body.method)) {
      let permissions = await requestPermissions(url, [body.method])
      if (permissions !== "Permission granted") {
        return { code: 4001, message: "Permission request denied" }
      }
    }
  }

  switch (body.method) {
    case "quai_requestAccounts":
      return getAddresses()
    case "personal_sign":
      return personalSign(body.params)
    case "quai_sendTransaction":
      return await sendTransaction(body.params)
  }

  return { code: 200, message: "Hello from the background script!" }
}

const permissionPromises = {}

export async function handleResponse(body: any) {
  if (body.action == "requestPermission" && permissionPromises[body.windowId]) {
    permissionPromises[body.windowId](body.data) // Resolve the promise with the data received
    delete permissionPromises[body.windowId] // Clear the resolved promise
  }
}

function requestPermissions(domain: string, requestedMethods: string[]) {
  return new Promise((resolve, reject) => {
    const data = {
      url: domain,
      requestedMethods: requestedMethods.join(",")
    }

    const queryParams = new URLSearchParams(data).toString()

    chrome.windows.create({}, function (window) {
      const screenWidth = window.width
      const screenHeight = window.height

      chrome.windows.remove(window.id)

      // Now create your popup window
      chrome.windows.create(
        {
          url: chrome.runtime.getURL(
            `tabs/requestPermissions.html?${queryParams}`
          ),
          type: "popup",
          width: 400,
          height: 600
        },
        (popupWindow) => {
          chrome.windows.update(popupWindow.id, {
            left: screenWidth, // adjust this as needed
            top: 0
          })
          permissionPromises[popupWindow.id] = resolve
        }
      )
    })
  })
}

function personalSign(params: any) {
  return new Promise((resolve, reject) => {
    const data = {
      msg: params[0],
      address: params[1],
      password: params[2]
    }

    const queryParams = new URLSearchParams(data).toString()

    chrome.windows.create({}, function (window) {
      const screenWidth = window.width
      const screenHeight = window.height

      chrome.windows.remove(window.id)

      // Now create your popup window
      chrome.windows.create(
        {
          url: chrome.runtime.getURL(`tabs/personalSign.html?${queryParams}`),
          type: "popup",
          width: 400,
          height: 600
        },
        (popupWindow) => {
          chrome.windows.update(popupWindow.id, {
            left: screenWidth, // adjust this as needed
            top: 0
          })
          permissionPromises[popupWindow.id] = resolve
        }
      )
    })
  })
}

function sendTransaction(params: any) {
  return new Promise((resolve, reject) => {
    const data = {
      gasLimit: params[0].gasLimit,
      gasPrice: params[0].gasPrice,
      from: params[0].from,
      to: params[0].to,
      value: params[0].value,
      data: params[0].data
    }

    const queryParams = new URLSearchParams(data).toString()

    chrome.windows.create({}, function (window) {
      const screenWidth = window.width
      const screenHeight = window.height

      chrome.windows.remove(window.id)

      // Now create your popup window
      chrome.windows.create(
        {
          url: chrome.runtime.getURL(
            `tabs/sendTransaction.html?${queryParams}`
          ),
          type: "popup",
          width: 400,
          height: 600
        },
        (popupWindow) => {
          chrome.windows.update(popupWindow.id, {
            left: screenWidth - 400, // adjust this as needed
            top: 0
          })
          permissionPromises[popupWindow.id] = resolve
        }
      )
    })
  })
}
