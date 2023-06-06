import "../../style.css"

import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "wouter"

import { QUAI_CONTEXTS } from "~background/services/network/chains"
import Footer from "~components/navigation/Footer"
import { updateCustomToken } from "~slices/update-token"
import { getActiveNetwork } from "~storage/network"
import { addOrUpdateToken, removeToken } from "~storage/token"
import type { TokenNetworkData, TokenShardData } from "~storage/token"
import { getShardFromAddress } from "~storage/wallet"
import { useAppSelector } from "~store"

function AddOrUpdateCustomToken() {
  const [, setLocation] = useLocation()
  const [tokenName, setTokenName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [decimals, setDecimals] = useState("")
  const [randomID, setRandomID] = useState(Math.floor(Math.random() * 1000000))
  const [contractAddress, setContractAddress] = useState("")
  const [isMultiShard, setIsMultiShard] = useState(false)
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

  /*
   * This useEffect is used to update the UI when the user is updating a token
   */
  useEffect(() => {
    if (updateToken === null || updateToken === undefined) return
    if (
      Object.keys(updateToken).length === 0 &&
      updateToken.constructor === Object
    )
      return
    if (updateToken.type !== "custom") return
    setTokenName(updateToken.name)
    setSymbol(updateToken.symbol)
    setDecimals(updateToken.decimals.toString())
    let shardsWithCA = updateToken.shardData.filter(
      (shard) => shard.address !== ""
    )
    if (shardsWithCA.length > 1) {
      setTokenShards(JSON.parse(JSON.stringify(updateToken.shardData))) // Deep copy
    } else {
      setContractAddress(updateToken.shardData[0].address)
    }
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

  const handleContractAddressChange = (event) => {
    setContractAddress(event.target.value)

    let shardForAddress = getShardFromAddress(event.target.value)
    if (shardForAddress === null) return
    // find the shard in the tokenShards array
    let shardIndex = tokenShards.findIndex(
      (shard) => shard.shard === shardForAddress[0].shard
    )
    if (shardIndex === -1) return
    let newTokenShards = [...tokenShards]
    newTokenShards[shardIndex].address = event.target.value
    setTokenShards(newTokenShards)
  }

  const toggleMultiShard = () => {
    setIsMultiShard(!isMultiShard)
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
      console.log(token)
      await addOrUpdateToken(token)
      setLocation("/")
    } catch (e) {
      console.log(e)
    }
  }

  const handleRemoveToken = async () => {
    try {
      await removeToken(updateToken.id)
      setLocation("/")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="p-6">
        <div className="flex flex-row justify-between items-center">
          <button
            onClick={() => setLocation("/token")}
            className="text-gray-400">
            <ChevronLeftIcon
              className="h-6 w-6 quai-dark-grey"
              aria-hidden="true"
            />
          </button>
          {updateToken && (
            <TrashIcon
              className="h-5 w-5 cursor-pointer z-20"
              onClick={() => handleRemoveToken()}
            />
          )}
        </div>
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

          <div className="mx-2 pb-6 flex flex-row items-center">
            <label htmlFor="multishard" className="mr-2">
              Is this a multi-shard token?
            </label>
            <div className="relative inline-block w-10 align-middle select-none">
              <input
                type="checkbox"
                name="multishard"
                id="multishard"
                checked={isMultiShard}
                onChange={toggleMultiShard}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="multishard"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>

          {!isMultiShard && (
            <div className="mx-2 pb-6 flex flex-col">
              <label>Contract Address</label>
              <input
                className="text-lg p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
                onChange={handleContractAddressChange}
                value={contractAddress}
              />
            </div>
          )}

          {isMultiShard &&
            tokenShards.map((addressAndShard, index) => {
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
