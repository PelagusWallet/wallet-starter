import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { getActiveWallet, getWallets } from "~storage/wallet"
import type {
  PathAddresses,
  QuaiContextAddresses,
  StoredWallet
} from "~storage/wallet"
import { groupByPrefix } from "~storage/wallet"

import "../../../style.css"

import { useEffect, useState } from "react"

import type { AddressWithData } from "~background/services/network/controller"
import SelectSendFrom from "~components/send/selectFrom"
import { useAppSelector } from "~store"

export default function SendFrom({ activeWallet }) {
  // router
  const [, setLocation] = useLocation()
  const [activePathAddressGroups, setActivePathAddressGroups] =
    useState<QuaiContextAddresses[]>()

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )
  const sortAddresses = async () => {
    let groups = groupByPrefix(addressData)
    setActivePathAddressGroups(groups)
  }

  useEffect(() => {
    sortAddresses()
  }, [])

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
        <ul role="list" className="space-y-3">
          {activePathAddressGroups?.map((addressGroup, i) => (
            <SelectSendFrom key={i} addressGroup={addressGroup} />
          ))}
        </ul>
      </div>
    </div>
  )
}
