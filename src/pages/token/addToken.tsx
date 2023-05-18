import "../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { QUAI_CONTEXTS } from "~background/services/network/chains"
import Footer from "~components/navigation/Footer"
import { getActiveNetwork } from "~storage/network"
import { addToken } from "~storage/token"
import type { TokenNetworkData, TokenShardData } from "~storage/token"

function AddCustomToken() {
  const [, setLocation] = useLocation()
  const [tokenName, setTokenName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [decimals, setDecimals] = useState("")

  const [tokenShards, setTokenShards] = useState<TokenShardData[]>([])

  useEffect(() => {
    const newTokenShards = [...tokenShards]
    QUAI_CONTEXTS.forEach((context) => {
      let addressAndShard = {
        name: context.name,
        shard: context.shard,
        symbol: ""
      } as TokenShardData
      newTokenShards.push(addressAndShard)
    })
    setTokenShards(newTokenShards)
  }, [])

  const handleTokenNameChange = (event) => {
    setTokenName(event.target.value)
  }

  const handleTokenShardChange = (event, index) => {
    const newTokenShards = [...tokenShards]
    newTokenShards[index].address = event.target.value
    setTokenShards(newTokenShards)
  }

  const handleAddToken = async () => {
    try {
      let randomID = Math.floor(Math.random() * 1000)
      let activeNetwork = await getActiveNetwork()
      let token: TokenNetworkData = {
        network: activeNetwork.name,
        chainID: activeNetwork.chainID,
        name: tokenName,
        id: randomID,
        symbol: symbol,
        decimals: Number(decimals),
        shardData: tokenShards
      }
      addToken(token)
      setLocation("/")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="p-6">
        <button onClick={() => setLocation("/")} className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
        <div className="flex flex-col">
          <div className="mx-2 pb-6 flex flex-col">
            <label className="text-white">Name</label>
            <input
              className="text-lg text-white p-2 rounded-md bg-zinc-950 border focus:border-0 focus:ring-white"
              onChange={handleTokenNameChange}
              value={tokenName}
            />
          </div>
          <div className="mx-2 pb-6 flex flex-row">
            <div className="w-1/2 mr-1 flex flex-col">
              <label className="text-white">Symbol</label>
              <input
                className="text-lg w-full text-white p-2 rounded-md bg-zinc-950 border focus:border-0 focus:ring-white"
                onChange={(e) => setSymbol(e.target.value)}
                value={symbol}
              />
            </div>
            <div className="relative w-1/2 ml-1 flex flex-col">
              <label className="text-white">Decimals</label>
              <input
                className="text-lg w-full text-white p-2 rounded-md bg-zinc-950 border focus:border-0 focus:ring-white"
                onChange={(e) => setDecimals(e.target.value)}
                value={decimals}
              />
            </div>
          </div>
          {tokenShards.map((addressAndShard, index) => {
            return (
              <div key={index} className="pt-1 mx-2 flex flex-row pb-2">
                <div className="w-1/4 text-[14px] text-blue-400 text-center p-1 rounded-md bg-zinc-950">
                  {addressAndShard.shard}
                </div>
                <div className="w-3/4 cols-span-4 ml-2">
                  <input
                    className="w-full h-full text-md text-white p-2 rounded-md bg-zinc-950 border focus:border-0 focus:ring-white"
                    onChange={(e) => handleTokenShardChange(e, index)}
                    value={addressAndShard.address}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="w-full flex justify-center mb-20">
          <button
            className="text-blue-400 font-semibold text-sm px-6 py-3 rounded bg-zinc-950"
            type="button"
            onClick={() => handleAddToken()}>
            Save Token
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AddCustomToken
