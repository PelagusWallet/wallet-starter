import { quais } from "quais"
import React, { useEffect, useState } from "react"

import { getActiveWallet, personalSignFromAddress } from "~storage/wallet"

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
    try {
      let signed = await personalSignFromAddress(address, message)
      setSignedMessage(signed)
      let signedAddress = quais.utils.verifyMessage(message, signed)
      setSignedAddress(signedAddress)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeny = () => {
    window.close()
  }

  if (signedMessage) {
    return (
      <div className=" text-white font-quai p-4 rounded-md text-center">
        <div className="text-2xl mb-4">Signature request processed.</div>

        <div className="bg-gray-700 rounded-md p-2 mb-4">
          <p className="font-bold">Signed Message:</p>
          <p>{signedMessage}</p>
        </div>

        <div className="bg-gray-700 rounded-md p-2 mb-4">
          <p className="font-bold">Signed Address:</p>
          <p>{signedAddress}</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" text-white font-quai p-4 rounded-md">
      <p className="text-lg font-bold mb-4">
        Do you want to sign the following message?
      </p>

      <div className="bg-gray-700 rounded-md p-2 mb-4">
        <p className="font-bold">Address:</p>
        <p>{address}</p>
      </div>

      <div className="bg-gray-700 rounded-md p-2 mb-4">
        <p className="font-bold">Message:</p>
        <p>{message}</p>
      </div>
      <div className="flex justify-end space-x-2 w-full">
        <button
          className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDeny}>
          Deny
        </button>
        <button
          className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSign}>
          Sign
        </button>
      </div>
    </div>
  )
}

export default PersonalSign
