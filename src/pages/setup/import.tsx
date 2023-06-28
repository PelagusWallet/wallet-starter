import "../../style.css"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { DEFAULT_NETWORKS } from "~background/services/network/chains"

import LocateShard from "./locate"
import PasswordSetup from "./password"
import ProgressBar from "./progress"

import "../../style.css"

import { useStorage } from "@plasmohq/storage/hook"

import SetupHeaderBar from "~components/setup/setupHeaderBar"
import { setActiveNetwork } from "~storage/network"

import InputMnemonic from "./inputMnemonic"
import PinExtension from "./pin"

const steps = [
  {
    id: "01",
    name: "Import Secure Phrase",
    href: "#",
    status: "upcoming",
    page: 0
  },
  {
    id: "02",
    name: "Create Password",
    href: "welcome.html/generate",
    status: "current",
    page: 1
  },
  {
    id: "03",
    name: "Locate Shard",
    href: "#",
    status: "upcoming",
    page: 2
  },
  {
    id: "03",
    name: "Locate Extension",
    href: "#",
    status: "upcoming",
    page: 3
  }
]

const storage = new Storage({
  area: "local"
})

function ImportMnemonic() {
  const [password, setPassword] = useState("")
  const [secretRecoveryPhrase, setSecretRecoveryPhrase] = useState("")
  const [page, setPage] = useState(0)
  const [, setLocation] = useLocation()

  const [setUp, setSetUp] = useStorage<boolean>({
    key: "is_setup",
    instance: storage
  })

  async function handlePasswordComplete(e) {
    setPassword(e)
    setPage((v) => v + 1)
    await sendToBackground({
      name: "wallet/create-wallet",
      body: {
        password: e,
        mnemonic: secretRecoveryPhrase
      }
    })
    await setActiveNetwork(DEFAULT_NETWORKS[0].name)
  }

  function mnemonicSubmitted(mnemonic: string) {
    setSecretRecoveryPhrase(mnemonic)
    setPage((v) => v + 1)
  }

  function attemptSetPage(attemptedPage) {
    if (attemptedPage < page) {
      setPage((v) => (v = attemptedPage))
    }
  }

  function handleLocateShard() {
    setPage((v) => v + 1)
  }

  async function handlePinnedExtension() {
    setSetUp(true)
    chrome.tabs.create({
      url: chrome.runtime.getURL("/tabs/setupComplete.html")
    })
    window.close()
  }

  useEffect(() => {}, [page])

  return (
    <div className="w-full max-h-screen h-screen  flex flex-col items-center justify-center max-w-3xl rounded-lg mx-auto">
      <SetupHeaderBar />

      <div className="w-full">
        <ProgressBar page={page} setPage={attemptSetPage} steps={steps} />
      </div>
      <div className="secondary-bg-container w-full rounded-b-md py-20 shadow-lg dark:border dark:border-white">
        <AnimatePresence>
          {page == 0 && (
            <motion.div
              key="mnemonicSetup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <InputMnemonic
                onMnemonicSubmitted={(mnemonic) => {
                  mnemonicSubmitted(mnemonic)
                }}
              />
            </motion.div>
          )}
          {page == 1 && (
            <motion.div
              key="passwordSetup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <PasswordSetup
                onPasswordSubmit={(e) => {
                  handlePasswordComplete(e)
                }}
              />
            </motion.div>
          )}
          {page == 2 && (
            <motion.div
              key="locateShard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <LocateShard
                onContinue={(e) => handleLocateShard()}></LocateShard>
            </motion.div>
          )}
          {page == 3 && (
            <motion.div
              key="pinExtension"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              {/* <MnemonicVerify
  mnemonic={secretRecoveryPhrase}
  onCompleteMnemonic={(e) => {
    handleMnemonicComplete()
  }}
/> */}
              <PinExtension onContinue={(e) => handlePinnedExtension()} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ImportMnemonic
