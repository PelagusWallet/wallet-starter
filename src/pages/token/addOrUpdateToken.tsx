import "../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "wouter"

import { QUAI_CONTEXTS } from "~background/services/network/chains"
import Footer from "~components/navigation/Footer"
import { updateCustomToken } from "~slices/update-token"
import { getActiveNetwork } from "~storage/network"
import { addOrUpdateToken } from "~storage/token"
import type { TokenNetworkData, TokenShardData } from "~storage/token"
import { useAppSelector } from "~store"

function AddOrUpdateCustomToken() {
  const [, setLocation] = useLocation()
  const [tokenName, setTokenName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [decimals, setDecimals] = useState("")
  const [randomID, setRandomID] = useState(Math.floor(Math.random() * 1000000))
  const [tokenShards, setTokenShards] = useState<TokenShardData[]>([])

  const updateToken = useAppSelector(
    (state) => state.updateToken.customToken as TokenNetworkData
  )

  useEffect(() => {
    const newTokenShards = [...tokenShards]
    QUAI_CONTEXTS.forEach((context) => {
      let addressAndShard = {
        name: context.name,
        shard: context.shard,
        symbol: "",
        address: "" // Add this line
      } as TokenShardData
      newTokenShards.push(addressAndShard)
    })
    setTokenShards(newTokenShards)
  }, [])

  useEffect(() => {
    if (!updateToken) return
    setTokenName(updateToken.name)
    setSymbol(updateToken.symbol)
    setDecimals(updateToken.decimals.toString())
    setTokenShards(JSON.parse(JSON.stringify(updateToken.shardData))) // Deep copy
    setRandomID(updateToken.id)
  }, [updateToken])

  const dispatch = useDispatch() // get the dispatch function

  useEffect(() => {
    // This will be executed when the component is unmounted
    return () => {
      dispatch(updateCustomToken(null)) // Dispatch your action here
    }
  }, [dispatch]) // Add dispatch to dependency array to avoid warning

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
      let activeNetwork = await getActiveNetwork()
      let token: TokenNetworkData = {
        network: activeNetwork.name,
        chainID: activeNetwork.chainID,
        name: tokenName,
        id: randomID,
        symbol: symbol,
        decimals: Number(decimals),
        shardData: tokenShards,
        type: "custom"
      }
      await addOrUpdateToken(token)
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
            <label>Name</label>
            <input
              className="text-lg p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
              onChange={handleTokenNameChange}
              value={tokenName}
            />
          </div>
          <div className="mx-2 pb-6 flex flex-row">
            <div className="w-1/2 mr-1 flex flex-col">
              <label>Symbol</label>
              <input
                className="text-lg w-full p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
                onChange={(e) => setSymbol(e.target.value)}
                value={symbol}
              />
            </div>
            <div className="relative w-1/2 ml-1 flex flex-col">
              <label>Decimals</label>
              <input
                className="text-lg w-full p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
                onChange={(e) => setDecimals(e.target.value)}
                value={decimals}
              />
            </div>
          </div>
          {tokenShards.map((addressAndShard, index) => {
            return (
              <div key={index} className="pt-1 mx-2 flex flex-row pb-2">
                <div className="w-1/4 text-[14px] text-blue-600 dark:text-blue-400 text-center p-1 rounded-md secondary-bg-container">
                  {addressAndShard.shard}
                </div>
                <div className="w-3/4 cols-span-4 ml-2">
                  <input
                    className="w-full h-full text-md p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
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
            className="text-blue-600 dark:text-blue-400 font-semibold text-sm px-6 py-3 rounded secondary-bg-container"
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

export default AddOrUpdateCustomToken
