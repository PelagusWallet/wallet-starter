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
  const [tokenData, setTokenData] = useState<TokenNetworkData[]>([])

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  const [tokens] = useStorage<TokenNetworkData[]>({
    key: "tokens",
    instance: storage
  })

  const [activeNetwork] = useStorage({
    key: "active_network",
    instance: storage
  })

  useEffect(() => {
    if (!activeNetwork) return

    let allTokenData = tokens || []
    let quaiData = {
      name: "QUAI",
      symbol: "QUAI",
      decimals: 18,
      type: "native",
      network: activeNetwork.name,
      chainID: activeNetwork.chainID
    } as TokenNetworkData
    allTokenData.unshift(quaiData)

    // get tokens for active network
    allTokenData = allTokenData.filter(
      (token) => token.network === activeNetwork.name
    )

    setTokenData(allTokenData)
  }, [tokens, activeNetwork])

  useEffect(() => {}, [addressData])

  return (
    <div className="flex flex-col justify-between h-full">
      {tokenData.map((token) => (
        <AssetItem key={token.symbol} token={token} />
      ))}
      <div className="w-full flex items-center justify-center">
        <div
          onClick={() => setLocation("/token/add")}
          className="cursor-pointer text-blue-400 bg-zinc-950 py-1 px-2 rounded">
          Add token
        </div>
      </div>
    </div>
  )
}
