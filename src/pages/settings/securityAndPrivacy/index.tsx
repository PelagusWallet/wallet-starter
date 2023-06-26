import { Disclosure } from "@headlessui/react"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"
import MnemonicReveal from "~components/settings/securityAndPrivacy/mnemonicReveal"
import { checkPassword } from "~storage/wallet/password"

import "../../../style.css"

export default function SecurityAndPrivacy() {
  const [, setLocation] = useLocation()
  const [password, setPassword] = useState("")
  const [revealMnemonic, setRevealMnemonic] = useState(false)

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const validatePassword = async () => {
    const passwordCorrect = await checkPassword(password)
    if (passwordCorrect) {
      setRevealMnemonic(true)
    } else {
      alert("Incorrect password")
    }
  }

  const closeMnemonicReveal = () => {
    setRevealMnemonic(false)
    setPassword("")
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-transparent">
          <div className="mt-3 space-y-1 px-2">
            <button
              onClick={() => setLocation("/settings")}
              className="text-gray-400">
              <ChevronLeftIcon
                className="h-6 w-6 quai-dark-grey"
                aria-hidden="true"
              />
            </button>
          </div>
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

          {revealMnemonic && (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none">
              <div className="relative w-full mx-6">
                <MnemonicReveal
                  password={password}
                  onClose={closeMnemonicReveal}
                />
              </div>
            </div>
          )}
        </Disclosure>
      </div>
      <Footer />
    </>
  )
}
