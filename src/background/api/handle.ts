import { request } from "http"

import { checkPermissions, getPermissions } from "../../storage/permissions"
import { getAddresses } from "../../storage/wallet/index"

let restrictedMethods = [
  "quai_requestAccounts",
  "personal_sign",
  "quai_sendTransaction"
]

export default async function handleRequest(body: any) {
  let url = new URL(body.url).hostname

  // Unrestricted methods
  switch (body.method) {
    case "wallet_getPermissions":
      return getPermissions(url)
    case "wallet_requestPermissions":
      requestPermissions(url, body.requestedMethods)
      return { code: 200, message: "Hello from the background script!" }
  }

  let hasPermissions = await checkPermissions(url, body.method)
  if (!hasPermissions) {
    // body.method is a restricted method
    if (restrictedMethods.includes(body.method)) {
      requestPermissions(url, [body.method])
    }
    return { code: 400, message: "Unauthorized, requesting permissions" }
  }

  switch (body.method) {
    case "quai_requestAccounts":
      return getAddresses()
    case "personal_sign":
      return personalSign(body.params)
    case "quai_sendTransaction":
      return sendTransaction(body.params)
  }

  return { code: 200, message: "Hello from the background script!" }
}

function requestPermissions(domain: string, requestedMethods: string[]) {
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
      }
    )
  })
}

function personalSign(params: any) {
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
      }
    )
  })
}

function sendTransaction(params: any) {
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
        url: chrome.runtime.getURL(`tabs/sendTransaction.html?${queryParams}`),
        type: "popup",
        width: 400,
        height: 600
      },
      (popupWindow) => {
        chrome.windows.update(popupWindow.id, {
          left: screenWidth - 400, // adjust this as needed
          top: 0
        })
      }
    )
  })
}
