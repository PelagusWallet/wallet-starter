import "../../style.css"

import { XCircleIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import type { CSSProperties } from "react"

function MnemonicVerify({ mnemonic, onCompleteMnemonic }) {
  const [word1, set1] = useState("")
  const [word3, set3] = useState("")
  const [word8, set8] = useState("")
  const [word12, set12] = useState("")
  const [errPhrase, setErrPhrase] = useState(false)

  const handleWord1 = (event) => {
    set1(event.target.value)
  }

  const handleWord3 = (event) => {
    set3(event.target.value)
  }

  const handleWord8 = (event) => {
    set8(event.target.value)
  }

  const handleWord12 = (event) => {
    set12(event.target.value)
  }

  function completeMnemonic() {
    // let mnemonicSplit = mnemonic.split("")
    // if (
    //   word1 != mnemonicSplit[0] ||
    //   word3 != mnemonicSplit[2] ||
    //   word8 != mnemonicSplit[7] ||
    //   word12 != mnemonicSplit[11]
    // ) {
    //   setErrPhrase(true)
    //   // return false
    // }

    onCompleteMnemonic()
  }

  const inputStyle: CSSProperties = {
    display: "inline-flex",
    justifyContent: "center",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    backgroundColor: "white",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#6B7280",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    width: "100%"
  }

  const wordNumberStyle: CSSProperties = {
    color: "white",
    textAlign: "center" as any,
    fontWeight: "bold"
  }

  return (
    <main className="bg-transparent w-full pt-10 pb-10">
      <label className="flex justify-center text-sm font-medium mb-4">
        Just to be sure you copied your secure phrase correctly, please enter
        the following words.
      </label>
      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-4 w-max mx-10">
          <div>
            <div style={wordNumberStyle}>Word 1:</div>
            <input
              onChange={handleWord1}
              value={word1}
              style={inputStyle}></input>
          </div>
          <div>
            <div style={wordNumberStyle}>Word 3:</div>
            <input
              onChange={handleWord3}
              value={word3}
              style={inputStyle}></input>
          </div>
          <div>
            <div style={wordNumberStyle}>Word 8:</div>
            <input
              onChange={handleWord8}
              value={word8}
              style={inputStyle}></input>
          </div>
          <div>
            <div style={wordNumberStyle}>Word 12:</div>
            <input
              onChange={handleWord12}
              value={word12}
              style={inputStyle}></input>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-10 pb-10">
        <button
          onClick={() => completeMnemonic()}
          className="flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2">
          Verify Secure Phrase
        </button>
      </div>
    </main>
  )
}

export default MnemonicVerify
