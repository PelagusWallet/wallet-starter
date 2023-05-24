import Eth from "@ledgerhq/hw-app-eth"
import { useState } from "react"

import "../../style.css"

var TransportWebUSB = require("@ledgerhq/hw-transport-webusb").default

function LedgerSetup() {
  const [address, setAddress] = useState<string | null>(null)

  const onGetLedgerEthereumAddress = async () => {
    try {
      const transport = await TransportWebUSB.create()
      const eth = new Eth(transport)
      const { address } = await eth.getAddress("44'/60'/0'/0/0")
      setAddress(address)
    } catch (error) {
      console.log("Error", error)
    }
  }

  return (
    <main className="w-screen h-screen pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mx-auto max-w-3xl shadow-lg rounded-lg ">
          <button
            className="flex w-full justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium shadow-sm hover:bg-quai-deep-teal focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => onGetLedgerEthereumAddress()}>
            Get Ledger Ethereum Address
          </button>
          <div className="text-center">{address}</div>
        </div>
      </div>
    </main>
  )
}

export default LedgerSetup
