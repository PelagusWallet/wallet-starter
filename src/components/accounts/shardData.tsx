import _ from "lodash"
import React from "react"
import toast from "react-hot-toast"
import { VscCopy, VscOpenPreview } from "react-icons/vsc"

import type { TokenNetworkAddressData } from "~background/services/network/controller"
import { type Address, getShardFromAddress } from "~storage/wallet"
import { addAdddressByShard } from "~storage/wallet"
import { useAppSelector } from "~store"

import AddressLabel from "./addressLabel"

import "../../style.css"

import { useEffect, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { getExplorerURLForShard } from "~background/services/network/chains"
import { Network } from "~background/services/network/chains"

function ShardData({ wallet, addressGroup }) {
  const [active, setActive] = useState(() => false)
  const [totalShardBalance, setTotalShardBalance] = useState(0)
  const [renderKey, setRenderKey] = useState(0)

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: new Storage({
      area: "local"
    })
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
          <AddressLabel address={addressGroup?.addresses[0].address} />
          <div className="flex flex-row">
            <span className="tooltip">
              <VscCopy
                onClick={() => copyAddress(addressGroup.addresses[0])}
                className="w-4 h-4 m-1 z-10 cursor-pointer"></VscCopy>
              <span className="tooltiptext">Copy address to clipboard</span>
            </span>

            <span className="tooltip">
              <VscOpenPreview
                onClick={() => linkToExplorer(addressGroup.addresses[0])}
                className="w-4 h-4 m-1 z-10 cursor-pointer"></VscOpenPreview>
              <span className="tooltiptext">View address on explorer</span>
            </span>
          </div>
        </div>

        {addressGroup?.addresses.map((address, i) => (
          <div key={i} className="w-full flex flex-row justify-between">
            <div className="w-4/6 flex flex-row justify-between rounded-sm text-[14px]">
              <div className="m-1">
                {address.address.substring(0, 6) +
                  "..." +
                  address.address.substring(38, 42)}
              </div>
            </div>
            <div className="w-2/6 m-1 float-right text-[14px] font-thin text-right">
              {getAddressBalance(address.address) + " QUAI"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShardData
