import "../../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { Network, QUAI_CONTEXTS } from "~background/services/network/chains"
import type { ChainData } from "~background/services/network/chains"
import Footer from "~components/navigation/Footer"
import { addCustomNetwork, setActiveNetwork } from "~storage/network"

function AddCustomNetwork() {
  const [, setLocation] = useLocation()
  const [networkName, setNetworkName] = useState("")
  const [chainCode, setChainCode] = useState("")
  const [chainID, setChainID] = useState("")

  const [endpoints, setEndpoints] = useState<ChainData[]>([])

  useEffect(() => {
    const newEndpoints = [...endpoints]
    QUAI_CONTEXTS.forEach((context) => {
      let endpointAndShard = {
        name: context.name,
        shard: context.shard,
        rpc: "",
        blockExplorerUrl: ""
      } as ChainData
      newEndpoints.push(endpointAndShard)
    })
    setEndpoints(newEndpoints)
  }, [])

  const handleNetworkNameChange = (event) => {
    setNetworkName(event.target.value)
  }

  const handleEndpointChange = (event, index) => {
    const newEndpoints = [...endpoints]
    newEndpoints[index].rpc = event.target.value
    setEndpoints(newEndpoints)
  }

  const handleAddNetwork = () => {
    try {
      let network: Network = {
        name: networkName,
        chainCode: Number(chainCode),
        chainID: Number(chainID),
        isCustom: true,
        chains: endpoints
      }
      addCustomNetwork(network)
      setActiveNetwork(network.name)
      setLocation("/settings/network")
    } catch (e) {}
  }

  return (
    <>
      <div className="p-6">
        <button
          onClick={() => setLocation("/settings/network")}
          className="text-gray-400">
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
              onChange={handleNetworkNameChange}
              value={networkName}
            />
          </div>
          <div className="mx-2 pb-6 flex flex-row">
            <div className="w-1/2 mr-1 flex flex-col">
              <label>Chain Code</label>
              <input
                className="text-lg w-full p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
                onChange={(e) => setChainCode(e.target.value)}
                value={chainCode}
              />
            </div>
            <div className="relative w-1/2 ml-1 flex flex-col">
              <label>Chain ID</label>
              <input
                className="text-lg w-full p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
                onChange={(e) => setChainID(e.target.value)}
                value={chainID}
              />
            </div>
          </div>
          {endpoints.map((endpointAndShard, index) => {
            return (
              <div key={index} className="pt-1 mx-2 flex flex-row pb-2">
                <div className="w-1/4 text-[14px] text-blue-600 dark:text-blue-400 text-center p-1 rounded-md secondary-bg-container">
                  {endpointAndShard.shard}
                </div>
                <div className="w-3/4 cols-span-4 ml-2">
                  <input
                    className="w-full h-full text-md p-2 rounded-md secondary-bg-container border focus:border-0 focus:ring-white"
                    onChange={(e) => handleEndpointChange(e, index)}
                    value={endpointAndShard.rpc}
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
            onClick={() => handleAddNetwork()}>
            Save Custom Network
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AddCustomNetwork
