import "../../style.css"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { DEFAULT_NETWORKS } from "~background/services/network/chains"
import { generateRandomMnemonic } from "~crypto"
import { createWallet } from "~storage/wallet"

import MnemonicSetup from "./mnemonic"
import PasswordSetup from "./password"
import ProgressBar from "./progress"
import MnemonicVerify from "./verify"

import "../../style.css"

import SetupHeaderBar from "~components/setup/setupHeaderBar"
import { setActiveNetwork } from "~storage/network"

import PinExtension from "./pin"

const steps = [
  {
    id: "01",
    name: "Create Password",
    href: "welcome.html/generate",
    status: "current",
    page: 0
  },
  {
    id: "02",
    name: "Copy Secure Phrase",
    href: "#",
    status: "upcoming",
    page: 1
  },
  {
    id: "03",
    name: "Locate Extension",
    href: "#",
    status: "upcoming",
    page: 2
  }
]

function Generate() {
  const [password, setPassword] = useState("")
  const [secretRecoveryPhrase, setSecretRecoveryPhrase] = useState("")
  const [page, setPage] = useState(0)
  const [, setLocation] = useLocation()

  async function handlePasswordComplete(e) {
    setPassword(e)
    let mnemonic = await generateRandomMnemonic()
    setSecretRecoveryPhrase(mnemonic)
    setPage((v) => v + 1)
  }

  async function handleMnemonicCopied() {
    setPage((v) => v + 1)
    await createWallet(password, secretRecoveryPhrase)
    await setActiveNetwork(DEFAULT_NETWORKS[0].name)
  }

  async function handleMnemonicComplete() {
    createWallet(password, secretRecoveryPhrase)
    await setActiveNetwork(DEFAULT_NETWORKS[0].name)
    setLocation("/complete")
  }

  function handlePinnedExtension() {
    setLocation("/complete")
  }

  function attemptSetPage(attemptedPage) {
    if (attemptedPage < page) {
      setPage((v) => (v = attemptedPage))
    }
  }

  useEffect(() => {}, [page])

  return (
    <div className="w-full max-h-screen h-screen  flex flex-col items-center justify-center max-w-3xl rounded-lg mx-auto">
      <SetupHeaderBar />

      <div className="w-full">
        <ProgressBar page={page} setPage={attemptSetPage} steps={steps} />
      </div>
      <div className="secondary-bg-container w-full rounded-b-md py-20 shadow-lg dark:border dark:border-white">
        <AnimatePresence exitBeforeEnter>
          {page == 0 && (
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
          {page == 1 && secretRecoveryPhrase && (
            <motion.div
              key="mnemonicSetup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <MnemonicSetup
                mnemonic={secretRecoveryPhrase}
                onCopiedMnemonic={(e) => {
                  handleMnemonicCopied()
                }}
              />
            </motion.div>
          )}
          {page == 2 && (
            <motion.div
              key="mnemonicVerify"
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

export default Generate
