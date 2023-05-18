import "../../style.css"

import { useState } from "react"

function MnemonicSetup({ mnemonic, onCopiedMnemonic }) {
  const [showPhrase, setShowPhrase] = useState(false)

  function copiedMnemonic() {
    navigator.clipboard.writeText(mnemonic)
    onCopiedMnemonic()
  }

  return (
    <main className="bg-transparent w-full pt-4 pb-4">
      <label className="flex justify-center text-sm font-medium text-white mb-4">
        Copy your secure phrase and store it someewhere safe.
      </label>
      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-4 w-max">
          {mnemonic.split(" ").map((object, i) => (
            <div key={i}>
              <a className="inline-flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 w-full">
                {object}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center pt-10">
        <button
          onClick={() => copiedMnemonic()}
          className="flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:quai-deep-teal focus:ring-offset-2">
          Copy Secure Phrase
        </button>
      </div>
    </main>
  )
}

export default MnemonicSetup