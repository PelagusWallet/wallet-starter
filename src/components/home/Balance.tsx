import "../../style.css"

import { useEffect, useState } from "react"
import gradient from "url:/assets/gradients/frame-5.png"

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
    )?.addresses
    if (!addressData) return
    let balance = addressData?.reduce((acc, curr) => {
      if (!curr) return acc
      return acc + curr?.balance
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
          backgroundImage: `url(${gradient})`,
          backgroundPosition: "center", // change according to your needs
          backgroundSize: "cover", // change according to your needs
          backgroundRepeat: "no-repeat" // change according to your needs
        }}>
        <p className="text-bold text-[18px] text-white">My balance</p>
        {balance == null ? (
          <h1 className="text-3xl tracking-tight"> </h1>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {balance} QUAI
          </h1>
        )}
      </header>
    </>
  )
}
