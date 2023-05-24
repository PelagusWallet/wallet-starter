import * as bip39 from "bip39"
import React, { useState } from "react"

interface InputMnemonicProps {
  onMnemonicSubmitted: (mnemonic: string) => void
}

const InputMnemonic: React.FC<InputMnemonicProps> = ({
  onMnemonicSubmitted
}) => {
  const [mnemonic, setMnemonic] = useState(Array(12).fill(""))
  const [error, setError] = useState("")

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...mnemonic]
    values[index] = event.target.value
    setMnemonic(values)
  }

  const handleSubmit = () => {
    // validate mnemonic
    let isValid = bip39.validateMnemonic(mnemonic.join(" "))
    if (!isValid) {
      setError("Invalid mnemonic phrase.")
      return
    }

    onMnemonicSubmitted(mnemonic.join(" "))
  }

  return (
    <main className="bg-transparent w-full pt-4 pb-4">
      <label className="flex justify-center text-sm font-medium mb-4">
        Enter your mnemonic phrase:
      </label>
      <div className="flex justify-center mx-4">
        <div className="grid grid-cols-4 gap-4 w-max">
          {mnemonic.map((word, index) => (
            <div key={index}>
              <div className="">Word {index + 1}</div>
              <input
                type="text"
                value={word}
                onChange={(event) => handleInputChange(index, event)}
                className="inline-flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium shadow-sm hover:bg-zinc-950 w-full focus:border-none focus:ring-white"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center pt-10">
        <button
          onClick={handleSubmit}
          className="flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
          Continue
        </button>
      </div>
      <div className="flex justify-center pt-10">
        <div className="text-red-500">{error}</div>
      </div>
    </main>
  )
}

export default InputMnemonic
