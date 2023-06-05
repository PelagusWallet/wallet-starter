import { useEffect, useState } from "react"
import pelagusLgBlack from "url:/assets/logos/black/png/vertical-lockup.png"
import pelagusLgWhite from "url:/assets/logos/white/png/vertical-lockup.png"
import quaiLogoBlack from "url:/assets/quai-full-black.png"
import quaiLogo from "url:/assets/quai-full.png"
import { useLocation } from "wouter"

import "../../style.css"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import SetupHeaderBar from "~components/setup/setupHeaderBar"

function Home() {
  const [, setLocation] = useLocation()
  const [isChecked, setIsChecked] = useState(false)

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: new Storage({
      area: "local"
    })
  })

  return (
    <div className="flex h-screen">
      <SetupHeaderBar />
      <div className="flex flex-1 flex-col w-full justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 h-1000">
        <div className="secondary-bg-container shadow-lg mx-auto rounded-md p-20  max-w-3xl">
          <div className="flex justify-center w-full">
            {darkMode ? (
              <img className="h-36 w-auto" src={pelagusLgWhite} alt="Pelagus" />
            ) : (
              <img className="h-36 w-auto" src={pelagusLgBlack} alt="Pelagus" />
            )}
          </div>
          <div className="mt-8">
            <div className="mt-6">
              <div className="text-center text-lg">
                Welcome to Pelagus, your alpha gateway to the Quai Network.
                Brace yourself for an audacious voyage into the untamed realm of
                blockchain. Raw and bold, Pelagus invites you to chart your own
                course and seize the future. Embrace the mystery, unlock
                potentials, and let Quai Network guide your journey.
              </div>
              <form className="space-y-3 mt-6">
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
                    data-testid="createWalletButton"
                    disabled={!isChecked}
                    onClick={() => setLocation("/generate")}
                    className="btn-class w-full">
                    {chrome.i18n.getMessage("createNewWallet")}
                  </button>
                </div>
                <div>
                  <button
                    disabled={!isChecked}
                    onClick={() => setLocation("/import")}
                    className="btn-class w-full">
                    Import Exisiting Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-10"
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)"
        }}>
        <div style={{ textAlign: "center" }}>Powered by</div>
        {darkMode ? (
          <img className="h-8 w-auto" src={quaiLogo} alt="Quai" />
        ) : (
          <img className="h-8 w-auto" src={quaiLogoBlack} alt="Quai" />
        )}
      </div>
    </div>
  )
}

export default Home
