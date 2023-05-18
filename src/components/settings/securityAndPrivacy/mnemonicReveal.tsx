import "../../../style.css"

import { useEffect, useState } from "react"

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
    const keyfile = await attemptGetKeyfileForWallet(
      activeWallet.pubkey,
      password
    )
    setMnemonic(keyfile.mnemonic)
  }

  useEffect(() => {
    if (!activeWallet) return
    revealMnemonic().catch((err) => console.error(err))
  }, [activeWallet])

  function onCopy() {
    navigator.clipboard.writeText(mnemonic)
  }

  return (
    <div className="bg-zinc-500 p-10 rounded shadow-lg text-white font-quai">
      <div className="pb-2">{activeWallet?.nickname}</div>
      <div className="pb-2">
        Mnemonics are the keys to your digital wallet and should be stored
        securely to prevent unauthorized access. Never share your mnemonics with
        anyone, as they can be used to gain control over your assets.
      </div>
      <div className="pb-5 font-bold text-lg">{mnemonic}</div>
      <div className="w-full flex justify-center space-x-4">
        <button
          className="rounded bg-zinc-950 text-blue-400 p-3"
          onClick={() => onClose(false)}>
          Close
        </button>
        <button
          className="rounded bg-zinc-950 text-blue-400 p-3"
          onClick={() => onCopy()}>
          Copy
        </button>
      </div>
    </div>
  )
}
