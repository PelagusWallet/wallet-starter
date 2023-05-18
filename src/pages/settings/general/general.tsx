import { Disclosure } from "@headlessui/react"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useLocation } from "wouter"

import type { AddressWithData } from "~background/services/network/controller"
import Footer from "~components/navigation/Footer"
import { useAppSelector } from "~store"

import "../../../style.css"

export default function GeneralSettings() {
  const [, setLocation] = useLocation()

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  function groupByShard(addresses: AddressWithData[]) {
    let groups = addresses.reduce((groups, address) => {
      const shard = address.shard
      if (!groups[shard]) {
        groups[shard] = []
      }
      groups[shard].push(address)
      return groups
    }, {})
    return groups
  }

  function generateAndCopyAddresses() {
    const zones = [
      "ZONE_0_0_COINBASE",
      "ZONE_0_1_COINBASE",
      "ZONE_0_2_COINBASE",
      "ZONE_1_0_COINBASE",
      "ZONE_1_1_COINBASE",
      "ZONE_1_2_COINBASE",
      "ZONE_2_0_COINBASE",
      "ZONE_2_1_COINBASE",
      "ZONE_2_2_COINBASE"
    ]

    const addresses = groupByShard(addressData)
    // get first of each shard

    let newAddresses = Object.keys(addresses).map(
      (key) => addresses[key][0].address
    )

    let output = zones.map((zone, i) => `${zone}=${newAddresses[i]}`).join("\n")

    navigator.clipboard
      .writeText(output)
      .then(() => {
        console.log("Addresses copied to clipboard")
      })
      .catch((err) => {
        console.log("Could not copy text: ", err)
      })
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-transparent">
          <div className="mt-3 space-y-1 px-2">
            <button
              onClick={() => setLocation("/settings")}
              className="text-gray-400">
              <ChevronLeftIcon
                className="h-6 w-6 quai-dark-grey"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button
              onClick={() => {
                generateAndCopyAddresses()
              }} // Add your onClick function here
              className="border-2 border-white text-white rounded-full py-2 px-4 hover:text-white transition duration-200">
              Copy Mining Configuration
            </button>
          </div>
        </Disclosure>
      </div>
      <Footer />
    </>
  )
}
