import "../../style.css"

import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { AddressWithData } from "~background/services/network/controller"
import { useAppSelector } from "~store"

export default function Balance() {
  const [balance, setBalance] = useState(null)
  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  async function getTotalBalance() {
    if (addressData.length == 0) return
    let balance = addressData.reduce((acc, curr) => {
      return acc + curr.balance
    }, 0)

    balance = parseFloat(Number(balance).toFixed(4))
    setBalance(balance)
  }

  useEffect(() => {
    getTotalBalance()
  }, [addressData])

  return (
    <>
      <header
        className="font-quai cursor-default py-8 h-50 my-auto mx-4 rounded-md mb-4 px-4 backdrop-blur-md"
        style={{
          background: "linear-gradient(45deg, #3b82f6, #f59e0b, #ef4444)"
        }}>
        <p className="text-bold text-[18px] text-white">My balance</p>
        {balance == null ? (
          <h1 className="text-3xl tracking-tight text-white"> </h1>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {balance} QUAI
          </h1>
        )}
      </header>
    </>
  )
}
