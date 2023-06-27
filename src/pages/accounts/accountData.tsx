import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useLocation, useRoute } from "wouter"

import type { Address, QuaiContextAddresses } from "~storage/wallet"

import "../../style.css"

import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { sortAddressesByActiveShard } from "~storage/wallet/shard"
import { useAppSelector } from "~store"

import ShardData from "../../components/accounts/shardData"

const storage = new Storage({
  area: "local"
})

export default function AccountData({ activeWallet }) {
  // router
  const [, setLocation] = useLocation()
  const [sortedAddresses, setSortedAddresses] = useState<Address[]>()

  const [activeLocation] = useStorage<string>({
    key: "active_location",
    instance: storage
  })

  const activeAddresses = useAppSelector(
    (state) => state.activeAddresses.activeAddresses as Address[]
  )

  const sortAddresses = async () => {
    if (!activeAddresses) return
    if (!activeLocation) return

    let addresses = sortAddressesByActiveShard(activeAddresses, activeLocation)
    setSortedAddresses(addresses)
  }

  useEffect(() => {
    sortAddresses()
  }, [activeAddresses, activeLocation])

  return (
    <div className="">
      <div className="mt-2 px-4">
        <button onClick={() => setLocation("/")} className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
        <div className="flex flex-row items-baseline justify-between">
          <div className="text-lg cursor-default">
            {activeWallet?.nickname + " Breakdown"}
          </div>
          <div className="cursor-pointer text-md">Learn More</div>
        </div>
        <ul role="list" className="space-y-3">
          {sortedAddresses?.map((addressData, i) => (
            <ShardData key={i} addressData={addressData} />
          ))}
        </ul>
      </div>
    </div>
  )
}
