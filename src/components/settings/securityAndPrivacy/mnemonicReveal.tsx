import "../../../style.css"

import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { StoredWallet } from "~storage/wallet"
import { attemptGetKeyfileForWallet } from "~storage/wallet"

const storage = new Storage({ area: "local" })

export default function MnemonicReveal({ password, onClose }) {
  const [mnemonic, setMnemonic] = useState<string>()

  const [activeWallet] = useStorage<StoredWallet>({
    key: "active_wallet",
    instance: storage
  })

  async function revealMnemonic() {
    const mnemonic = await sendToBackground({
      name: "wallet/reveal-mnemonic",
      body: {
        password: password,
        pubkey: activeWallet.pubkey
      }
    })
    setMnemonic(mnemonic.decryptedMnemonic)
  }

  useEffect(() => {
    if (!activeWallet) return
    revealMnemonic().catch((err) => console.error(err))
  }, [activeWallet])

  function onCopy() {
    navigator.clipboard.writeText(mnemonic)
  }

  return (
    <div className="modal-backdrop secondary-bg-container">
      <div className="my-[50px] p-10 rounded shadow-lg secondary-bg-container mx-4">
        <div className="pb-4">
          Mnemonics are the keys to your digital wallet and should be stored
          securely to prevent unauthorized access. Never share your mnemonics
          with anyone, as they can be used to gain control over your assets.
        </div>
        <div className="p-4 my-6 bg-zinc-950 rounded-md">
          <div className="font-bold text-lg text-white text-center">
            {mnemonic}
          </div>
        </div>
        <div className="w-full flex justify-center space-x-4">
          <button className="btn-class-action" onClick={() => onClose(false)}>
            Close
          </button>
          <button className="btn-class-action" onClick={() => onCopy()}>
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
