import { useState } from "react"
import pelagusLogo from "url:/assets/pelagus-logo.png"
import { useLocation } from "wouter"

import "../../style.css"

function Home() {
  const [, setLocation] = useLocation()
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className="font-quai flex h-screen">
      <div className="flex flex-1 flex-col w-full justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 h-1000">
        <div className="mx-auto w-1/2 rounded-md border border-white p-20">
          <div className="flex justify-center w-full">
            <img className="h-12 w-auto" src={pelagusLogo} alt="Your Company" />
          </div>
          <div className="mt-8">
            <div className="mt-6">
              <div className="text-center text-md text-white">
                Greetings, bold pioneers of the digital frontier. Welcome to
                Pelagus, your alpha stage gateway to the Quai Network. This is
                not a journey for the faint-hearted. This is a voyage into the
                uncharted territories of blockchain. Pelagus, raw and untested,
                is an audacious leap into the future of cryptocurrency. Navigate
                its tumultuous currents, and unlock the unseen potentials.
                Embrace the unknown. Dare to chart your own course. Welcome to
                Pelagus, where the bold seize the future. Venture forth, and let
                the Quai Network guide your odyssey.
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
                    className="flex w-full justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-quai-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Import Exisiting Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
