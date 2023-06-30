import React, { useEffect, useState } from "react"

import "../../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import toast from "react-hot-toast"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Address } from "~storage/wallet"
import { checkPassword } from "~storage/wallet/password"

const storage = new Storage({ area: "local" })

export default function RevealPrivateKey({ setPage }) {
  const [password, setPassword] = useState("")
  const [privKey, setPrivKey] = useState("")

  const [activeAddress] = useStorage<Address>({
    key: "active_address",
    instance: storage
  })

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const validatePassword = async () => {
    const passwordCorrect = await checkPassword(password)
    if (passwordCorrect) {
      const privKey = await sendToBackground({
        name: "wallet/reveal-private-key",
        body: {
          password: password,
          address: activeAddress.address
        }
      })
      setPrivKey(privKey.privateKey)
    } else {
      toast("Incorrect password"),
        { id: "incorrect-password", position: "top-center" }
    }
  }

  return (
    <div className="z-10 h-full">
      <button onClick={() => setPage("details")} className="text-gray-400">
        <ChevronLeftIcon
          className="h-6 w-6 quai-dark-grey"
          aria-hidden="true"
        />
      </button>
      {privKey ? (
        <div className="break-words"> {privKey} </div>
      ) : (
        <div className="flex flex-row justify-between">
          <div className="w-full items-center flex justify-center flex-col">
            <input
              type="password"
              className="w-1/2 secondary-bg-container rounded-md px-2 py-1  text-lg mb-3 focus:border-0 focus:ring-white"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />

            <div className="w-full flex justify-center">
              <button
                onClick={() => {
                  validatePassword()
                }} // Add your onClick function here
                className="border-2 border-red-500 text-red-500 rounded-full py-2 px-4 hover:bg-red-500 hover:transition duration-200 hover:text-white">
                Reveal secret phrase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
