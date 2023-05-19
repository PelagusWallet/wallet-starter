import { useState } from "react"
import pelagusLogo from "url:/assets/pelagus-logo.png"
import quaiLogo from "url:/assets/quai-full.png"
import { useLocation } from "wouter"

import "../../style.css"

import LanguageSelect from "~components/setup/languageSelect"

function Home() {
  const [, setLocation] = useLocation()
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className="font-quai flex h-screen">
      <LanguageSelect />
      <div className="flex flex-1 flex-col w-full justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 h-1000">
        <div className="mx-auto rounded-md border border-white p-20  max-w-3xl">
          <div className="flex justify-center w-full">
            <img className="h-12 w-auto" src={pelagusLogo} alt="Pelagus" />
          </div>
          <div className="mt-8">
            <div className="mt-6">
              <div className="text-center text-lg text-white">
                Welcome to Pelagus, your alpha gateway to the Quai Network.
                Brace yourself for an audacious voyage into the untamed realm of
                blockchain. Raw and bold, Pelagus invites you to chart your own
                course and seize the future. Embrace the mystery, unlock
                potentials, and let Quai Network guide your journey.
              </div>
              <form className="space-y-3 mt-6 text-white">
                <div className="flex flex-row justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <div className="ml-4">
                    I understand this is alpha software and is subject to change
                  </div>
                </div>
                <div>
                  <button
                    disabled={!isChecked}
                    onClick={() => setLocation("/generate")}
                    className="flex w-full justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-quai-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {chrome.i18n.getMessage("createNewWallet")}
                  </button>
                </div>
                <div>
                  <button
                    disabled={!isChecked}
                    onClick={() => setLocation("/import")}
                    className="flex w-full justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-quai-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Import Exisiting Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-10 text-white"
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)"
        }}>
        <div style={{ textAlign: "center" }}>Powered by</div>
        <img className="h-8 w-auto" src={quaiLogo} alt="Quai Network" />
      </div>
    </div>
  )
}

export default Home
