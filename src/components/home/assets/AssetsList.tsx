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
  const [filteredTokenData, setTokenData] = useState<TokenNetworkData[]>([])

  const tokenBalanceData = useAppSelector(
    (state) => state.tokenData.tokenBalances as TokenNetworkAddressData[]
  )

  const [activeNetwork] = useStorage({
    key: "active_network",
    instance: storage
  })

  useEffect(() => {
    if (!activeNetwork) return

    let allTokenData = tokenBalanceData || []

    // get tokens for active network
    allTokenData = allTokenData.filter(
      (token) => token.network === activeNetwork.name || token.type === "native"
    )

    setTokenData(allTokenData)
  }, [tokenBalanceData, activeNetwork])

  return (
    <div className="flex flex-col justify-between h-full">
      {filteredTokenData.map((token) => (
        <AssetItem key={token.symbol} token={token} />
      ))}
      <div className="w-full flex items-center justify-center">
        <div
          onClick={() => setLocation("/token/add")}
          className="cursor-pointer text-blue-600 dark:text-blue-400 secondary-bg-container py-1 px-2 rounded">
          Add token
        </div>
      </div>
    </div>
  )
}
