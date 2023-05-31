import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { getActiveWallet, getWallets } from "~storage/wallet"
import type {
  Address,
  QuaiContextAddresses,
  StoredWallet
} from "~storage/wallet"
import { groupByPrefix } from "~storage/wallet"

import "../../../style.css"

import { useState } from "react"

import SelectSendFrom from "~components/send/selectFrom"

export default function SendFrom({ activeWallet }) {
  // router
  const [, setLocation] = useLocation()
  const [activePathAddressGroups, setActivePathAddressGroups] =
    useState<QuaiContextAddresses[]>()

  return (
    <div className="overflow-hidden">
      <div className="mt-2 px-4">
        <button onClick={() => setLocation("/")} className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
        <div className="flex flex-row justify-between items-baseline">
          {activeWallet ? (
            <div className="text-lg">
              {"Select From " + activeWallet?.nickname}
            </div>
          ) : null}
          <div className="cursor-pointer text-md">Learn More</div>
        </div>
        <SelectSendFrom />
      </div>
    </div>
  )
}
