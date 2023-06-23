import _ from "lodash"
import React from "react"
import toast from "react-hot-toast"
import { VscCopy, VscOpenPreview, VscStarFull } from "react-icons/vsc"

import type { TokenNetworkAddressData } from "~background/services/network/controller"
import { type Address, getShardFromAddress } from "~storage/wallet"
import { useAppSelector } from "~store"

import AddressLabel from "./addressLabel"

import "../../style.css"

import { useEffect, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { getExplorerURLForShard } from "~background/services/network/chains"
import { Network } from "~background/services/network/chains"

const storage = new Storage({
  area: "local"
})

function ShardData({ addressData }) {
  const [active, setActive] = useState(() => false)
  const [renderKey, setRenderKey] = useState(0)

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

  const [activeLocation] = useStorage<string>({
    key: "active_location",
    instance: storage
  })

  const balanceData = useAppSelector(
    (state) => state.balanceData.balanceData as TokenNetworkAddressData[]
  )

  useEffect(() => {
    setRenderKey(renderKey + 1)
  }, [balanceData])

  function getAddressBalance(lookupAddress: string) {
    let addressData = balanceData.find(
      (token) => token.type === "native"
    ).addresses

    if (!addressData) return

    if (addressData?.length == 0) return

    let balance = addressData?.find(
      (address) => address.address == lookupAddress
    )?.balance

    return formatBalance(balance)
  }

  function formatBalance(balance) {
    return parseFloat(Number(balance).toFixed(4))
  }

  // Support Quaiscan by default
  function linkToExplorer(address: Address): string {
    const shard = getShardFromAddress(address.address)[0].shard
    if (shard == undefined) {
      return ""
    }
    const explorerURL = getExplorerURLForShard(activeNetwork, shard)
    const url = explorerURL + "/address/" + address.address
    window.open(url, "_blank")
  }

  function copyAddress(address: Address) {
    navigator.clipboard.writeText(address.address)
    toast("Copied to clipboard 😎"),
      { id: "copied-notification", position: "top-center" }
  }

  return (
    <div className="shard-data-height rounded-md relative transition-[height] ease-in-out duration-800 max-heigh secondary-bg-container">
      <div
        className={
          "w-full h-full absolute rounded-md " +
          (active ? "fadeIn shard-data-div-active" : "fadeOut")
        }></div>
      <div className="py-1 px-2.5 opacity-100 flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row space-x-1">
            <AddressLabel address={addressData.address} />
            {activeLocation == addressData.shard && (
              <VscStarFull className="w-4 h-4 m-auto z-10" />
            )}
          </div>
          <div className="flex flex-row">
            <span className="tooltip">
              <VscCopy
                onClick={() => copyAddress(addressData)}
                className="w-4 h-4 m-1 z-10 cursor-pointer"></VscCopy>
              <span className="tooltiptext">Copy address to clipboard</span>
            </span>

            <span className="tooltip">
              <VscOpenPreview
                onClick={() => linkToExplorer(addressData)}
                className="w-4 h-4 m-1 z-10 cursor-pointer"></VscOpenPreview>
              <span className="tooltiptext">View address on explorer</span>
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between">
          <div className="w-4/6 flex flex-row justify-between rounded-sm text-[14px]">
            <div className="m-1">
              {addressData.address.substring(0, 6) +
                "..." +
                addressData.address.substring(38, 42)}
            </div>
          </div>
          <div className="w-2/6 m-1 float-right text-[14px] font-thin text-right">
            {getAddressBalance(addressData.address) + " QUAI"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShardData
