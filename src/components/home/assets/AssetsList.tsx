import "../../../style.css"

import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import {
  AddressWithData,
  TokenNetworkAddressData
} from "~background/services/network/controller"
import type { TokenNetworkData } from "~storage/token"
import { useAppSelector } from "~store"

import AssetItem from "./AssetItem"

const storage = new Storage({ area: "local" })

export default function AssetsList() {
  const [location, setLocation] = useLocation()
  const [filteredBalanceData, setFilteredBalance] = useState<
    TokenNetworkData[]
  >([])

  const balanceData = useAppSelector(
    (state) => state.balanceData.balanceData as TokenNetworkAddressData[]
  )

  const [activeNetwork] = useStorage({
    key: "active_network",
    instance: storage
  })

  useEffect(() => {
    if (!activeNetwork) return

    let allBalanceData = balanceData || []

    // get tokens for active network
    allBalanceData = allBalanceData.filter(
      (token) => token.network === activeNetwork.name || token.type === "native"
    )

    setFilteredBalance(allBalanceData)
  }, [balanceData, activeNetwork])

  return (
    <div className="flex flex-col justify-between h-full mx-2">
      {filteredBalanceData.map((token) => (
        <AssetItem key={token.symbol} token={token} />
      ))}
      <div className="w-full flex items-center justify-center">
        <div
          onClick={() => setLocation("/token/add")}
          className="btn-class-action">
          + Add token
        </div>
      </div>
    </div>
  )
}
