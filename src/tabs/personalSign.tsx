import { quais } from "quais"
import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { personalSignFromAddress } from "~storage/wallet"

import "../style.css"

interface QueryParams {
  msg?: string
  address?: string
  password?: string
}

function PersonalSign() {
  const [message, setMessage] = useState("")
  const [address, setAddress] = useState("")
  const [signedAddress, setSignedAddress] = useState("")
  const [password, setPassword] = useState("")
  const [signedMessage, setSignedMessage] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryParams: QueryParams = {}

    params.forEach((value, key) => {
      queryParams[key] = value
    })

    setMessage(queryParams.msg)
    setAddress(queryParams.address)
    setPassword(queryParams.password)
  }, [])

  const handleSign = async () => {
    let signed
    try {
      signed = await personalSignFromAddress(address, message)
      setSignedMessage(signed)
      let signedAddress = quais.utils.verifyMessage(message, signed)
      setSignedAddress(signedAddress)
    } catch (err) {
      console.error(err)
    }

    // Get the current window
    chrome.windows.getCurrent(async (currentWindow) => {
      // Now currentWindow.id contains the window ID
      const windowId = currentWindow.id

      // Send the message
      await sendToBackground({
        name: "api/response",
        body: {
          action: "requestPermission",
          windowId: windowId,
          data: { code: 200, message: signed }
        }
      })

      window.close()
    })
  }

  const handleDeny = () => {
    // Get the current window
    chrome.windows.getCurrent(async (currentWindow) => {
      // Now currentWindow.id contains the window ID
      const windowId = currentWindow.id

      // Send the message
      await sendToBackground({
        name: "api/response",
        body: {
          action: "requestPermission",
          windowId: windowId,
          data: { code: 4001, message: "User denied the request." }
        }
      })

      window.close()
    })
  }

  if (signedMessage) {
    return (
      <div className="p-4 rounded-md text-center">
        <div className="text-2xl mb-4">Signature request processed.</div>

        <div className="secondary-bg-container rounded-md p-2 mb-4">
          <p className="font-bold">Signed Message:</p>
          <p>{signedMessage}</p>
        </div>

        <div className="secondary-bg-container rounded-md p-2 mb-4">
          <p className="font-bold">Signed Address:</p>
          <p>{signedAddress}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-md">
      <p className="text-lg font-bold mb-4">
        Do you want to sign the following message?
      </p>

      <div className="secondary-bg-container rounded-md p-2 mb-4">
        <p className="font-bold">Address:</p>
        <p>{address}</p>
      </div>

      <div className="secondary-bg-container rounded-md p-2 mb-4">
        <p className="font-bold">Message:</p>
        <p>{message}</p>
      </div>
      <div className="flex justify-end space-x-2 w-full">
        <button
          className="w-1/2 bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
          onClick={handleDeny}>
          Deny
        </button>
        <button
          className="w-1/2 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          onClick={handleSign}>
          Sign
        </button>
      </div>
    </div>
  )
}

export default PersonalSign
