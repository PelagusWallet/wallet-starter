import "../../style.css"

import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { TokenNetworkAddressData } from "~background/services/network/controller"
import { useAppSelector } from "~store"

export default function Balance() {
  const [balance, setBalance] = useState(null)

  const balanceData = useAppSelector(
    (state) => state.balanceData.balanceData as TokenNetworkAddressData[]
  )

  async function getTotalBalance() {
    let addressData = balanceData.find(
      (token) => token.type === "native"
    ).addresses
    if (addressData?.length == 0) return
    let balance = addressData.reduce((acc, curr) => {
      return acc + curr.balance
    }, 0)

    balance = parseFloat(Number(balance).toFixed(4))
    setBalance(balance)
  }

  useEffect(() => {
    getTotalBalance()
  }, [balanceData])

  return (
    <>
      <header
        className=" cursor-default py-8 h-50 my-auto mx-4 rounded-md mb-4 px-4 backdrop-blur-md"
        style={{
          background: "linear-gradient(45deg, #3b82f6, #f59e0b, #ef4444)"
        }}>
        <p className="text-bold text-[18px]">My balance</p>
        {balance == null ? (
          <h1 className="text-3xl tracking-tight"> </h1>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight">{balance} QUAI</h1>
        )}
      </header>
    </>
  )
}
