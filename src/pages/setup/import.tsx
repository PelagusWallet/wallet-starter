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

import LanguageSelect from "~components/setup/languageSelect"
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
    name: "Locate Extension",
    href: "#",
    status: "upcoming",
    page: 2
  }
]

function ImportMnemonic() {
  const [password, setPassword] = useState("")
  const [secretRecoveryPhrase, setSecretRecoveryPhrase] = useState("")
  const [page, setPage] = useState(0)
  const [, setLocation] = useLocation()

  async function handlePasswordComplete(e) {
    setPassword(e)
    setPage((v) => v + 1)
    await createWallet(password, secretRecoveryPhrase)
    await setActiveNetwork(DEFAULT_NETWORKS[0].name)
  }

  function mnemonicSubmitted(mnemonic: string) {
    setSecretRecoveryPhrase(mnemonic)
    setPage((v) => v + 1)
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
    <div className="w-full max-h-screen h-screen font-quai flex flex-col items-center justify-center max-w-3xl shadow-lg rounded-lg mx-auto">
      <LanguageSelect />

      <div className="w-full">
        <ProgressBar page={page} setPage={attemptSetPage} steps={steps} />
      </div>
      <div className="w-full border border-white rounded-b-md py-20">
        <AnimatePresence exitBeforeEnter>
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

export default ImportMnemonic
