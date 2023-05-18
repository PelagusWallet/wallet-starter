import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useLocation, useRoute } from "wouter"

import type { QuaiContextAddresses } from "~storage/wallet"
import { groupByPrefix } from "~storage/wallet"

import "../../style.css"

import { useEffect, useState } from "react"

import type { AddressWithData } from "~background/services/network/controller"
import { useAppSelector } from "~store"

import ShardData from "../../components/accounts/shardData"

export default function AccountData({ activeWallet }) {
  // router
  const [, setLocation] = useLocation()
  const [activePathAddressGroups, setActivePathAddressGroups] =
    useState<QuaiContextAddresses[]>()
  const [match, params] = useRoute("/accounts?/:account")

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  const sortAddresses = async () => {
    let groups = groupByPrefix(addressData)
    setActivePathAddressGroups(groups)
  }

  useEffect(() => {
    sortAddresses()
    console.log("sorting addresses", addressData)
  }, [addressData])

  // TODO Refactor to only pass the group addresses down to shard
  // data component
  return (
    <div className="font-quai">
      <div className="px-4">
        <button onClick={() => setLocation("/")} className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
        <div className="flex flex-row items-baseline justify-between">
          <div className="text-white text-lg cursor-default">
            {activeWallet?.nickname + " Breakdown"}
          </div>
          <div className="cursor-pointer text-white text-md">Learn More</div>
        </div>
        <ul role="list" className="space-y-3">
          {activePathAddressGroups?.map((group, i) => (
            <ShardData key={i} addressGroup={group} wallet={activeWallet} />
          ))}
        </ul>
      </div>
    </div>
  )
}
