import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import _ from "lodash"
import React from "react"
import toast from "react-hot-toast"

import { sendToBackground } from "@plasmohq/messaging"

import type { AddressWithData } from "~background/services/network/controller"
import type { Address } from "~storage/wallet"
import { addAdddressByShard } from "~storage/wallet"
import { useAppSelector } from "~store"

import "../../style.css"

import { useEffect, useRef, useState } from "react"

function ShardData({ wallet, addressGroup }) {
  const [active, setActive] = useState(() => false)
  const [totalShardBalance, setTotalShardBalance] = useState(0)
  const [renderKey, setRenderKey] = useState(0)

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  useEffect(() => {
    getTotalShardBalance()
    setRenderKey(renderKey + 1)
  }, [addressData])

  function getTotalShardBalance() {
    let total = 0
    addressGroup?.addresses?.forEach((address) => {
      total += address.balance
    })
    setTotalShardBalance(parseFloat(Number(total).toFixed(4)))
  }

  async function addAccountByShardAction(
    wallet: any,
    path: string,
    existingShardAddresses: Address[],
    shard: string
  ) {
    let index = 0
    if (existingShardAddresses.length > 0) {
      index = existingShardAddresses[existingShardAddresses.length - 1].index
    }
    index += 1

    const resp = await sendToBackground({
      name: "wallet/generate-address",
      body: {
        wallet: wallet,
        path: path,
        index: index,
        shard: shard
      }
    })
    console.log("resp", resp)
  }

  function formatBalance(balance) {
    return parseFloat(Number(balance).toFixed(4))
  }

  function copyAddress(address: Address) {
    navigator.clipboard.writeText(address.address)
    toast("Copied to clipboard 😎"),
      { id: "copied-notification", position: "top-center" }
  }

  return (
    <div
      className={
        "shard-data-height rounded-md relative transition-[height] ease-in-out duration-800 max-height bg-zinc-950 " +
        (active ? "" : "bg-transparent")
      }>
      <div
        className={
          "w-full h-full absolute rounded-md " +
          (active ? "fadeIn shard-data-div-active" : "fadeOut")
        }></div>
      <div className="p-2 opacity-100 flex-col">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-thin text-white">
            {addressGroup.name}
          </div>
          <button
            onClick={() =>
              addAccountByShardAction(
                wallet,
                "m/44'/994'/0'/0",
                addressGroup.addresses,
                addressGroup.shard
              )
            }
            className="z-50	text-white">
            <PlusCircleIcon
              className="h-6 w-6 quai-dark-grey"
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-[14px] font-thin text-gray-400">
            {"Balance: " + totalShardBalance}
          </div>
          <div
            onClick={() => setActive(!active)}
            key={renderKey}
            className="z-20	cursor-pointer text-[14px] font-thin text-white">
            {addressGroup?.addresses.length + " Total Addresses"}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {active && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden">
              {addressGroup?.addresses.map((address, i) => (
                <div
                  key={i}
                  className="my-1 w-full flex flex-row justify-between">
                  <div className="w-4/6 flex flex-row justify-between border rounded-sm">
                    <div className="m-1 text-white">
                      {address.address.substring(0, 8) + "..."}
                    </div>
                    <div
                      onClick={() => copyAddress(address)}
                      className="m-1 z-10 text-gray-400 cursor-pointer">
                      Copy to Clipboard
                    </div>
                  </div>
                  <div className="w-2/6 m-1 float-right text-white text-[14px] font-thin text-right">
                    {formatBalance(address.balance) + " QUAI"}
                  </div>
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ShardData
