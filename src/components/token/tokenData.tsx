import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import _ from "lodash"
import React from "react"
import toast from "react-hot-toast"
import { VscCopy, VscOpenPreview } from "react-icons/vsc"

import type {
  AddressWithData,
  TokenNetworkAddressData
} from "~background/services/network/controller"
import { type Address, getShardFromAddress } from "~storage/wallet"
import { addAdddressByShard } from "~storage/wallet"
import { useAppSelector } from "~store"

import "../../style.css"

import { useEffect, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { getExplorerURLForShard } from "~background/services/network/chains"
import { Network } from "~background/services/network/chains"
import AddressLabel from "~components/accounts/addressLabel"
import type { TokenNetworkData } from "~storage/token"
import { formatBalance } from "~utils/format"

function TokenData({ address }) {
  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: new Storage({
      area: "local"
    })
  })

  const activeToken = useAppSelector(
    (state) => state.activeToken.activeToken as TokenNetworkData
  )

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
      <div className="w-full h-full absolute rounded-md"></div>
      <div className="py-1 px-2.5 opacity-100 flex-col">
        <div className="flex flex-row justify-between">
          <AddressLabel address={address.address} />
          <div className="flex flex-row">
            <span className="tooltip">
              <VscCopy
                onClick={() => copyAddress(address)}
                className="w-4 h-4 m-1 z-10 cursor-pointer"></VscCopy>
              <span className="tooltiptext">Copy address to clipboard</span>
            </span>

            <span className="tooltip">
              <VscOpenPreview
                onClick={() => linkToExplorer(address)}
                className="w-4 h-4 m-1 z-10 cursor-pointer"></VscOpenPreview>
              <span className="tooltiptext">View address on explorer</span>
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between">
          <div className="w-4/6 flex flex-row justify-between rounded-sm text-[14px]">
            <div className="m-1">
              {address.address.substring(0, 6) +
                "..." +
                address.address.substring(38, 42)}
            </div>
          </div>
          <div className="w-3/6 m-1 float-right text-[14px] font-thin text-right">
            {formatBalance(address.balance, activeToken.type == "native") +
              " " +
              activeToken.symbol}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenData
