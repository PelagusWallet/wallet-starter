import { Disclosure, Listbox } from "@headlessui/react"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { QUAI_CONTEXTS } from "~background/services/network/chains"
import SelectListbox from "~components/form/Listbox"
import Footer from "~components/navigation/Footer"
import { getAddresses } from "~storage/wallet"
import type { Address } from "~storage/wallet"

import "../../../style.css"

const storage = new Storage({
  area: "local"
})

export default function GeneralSettings() {
  const [, setLocation] = useLocation()
  const [selected, setSelected] = useState(null)

  const [defaultValue, setDefaultValue] = useState(null)

  const [darkMode, setDarkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: storage
  })

  const [activeLocation, setActiveLocation] = useStorage<string>({
    key: "active_location",
    instance: storage
  })

  const groupByShard = (addresses: Address[]) => {
    return addresses.reduce((groups, address) => {
      const shard = address.shard
      if (!groups[shard]) {
        groups[shard] = []
      }
      groups[shard].push(address)
      return groups
    }, {})
  }

  const generateAndCopyAddresses = async () => {
    const addressData = await getAddresses()
    const zones = [...Array(9).keys()].map(
      (i) => `ZONE_${Math.floor(i / 3)}_${i % 3}_COINBASE`
    )
    const addresses = groupByShard(addressData)
    const newAddresses = Object.values(addresses).map(
      (addresses: Address[]) => addresses[0].address
    )
    const output = zones
      .map((zone, i) => `${zone}=${newAddresses[i]}`)
      .join("\n")

    try {
      await navigator.clipboard.writeText(output)
      console.log("Addresses copied to clipboard")
    } catch (err) {
      console.error("Could not copy text: ", err)
    }
  }

  const options = QUAI_CONTEXTS?.map((context) => ({
    value: context.shard,
    label: context.name
  }))

  const handleLocationChange = (selectedOption) => {
    console.log(selectedOption)
    setActiveLocation(selectedOption.value)
  }

  useEffect(() => {
    const defaultContext = QUAI_CONTEXTS?.find(
      (context) => context.shard === activeLocation
    )
    if (defaultContext) {
      setDefaultValue({
        value: defaultContext.shard,
        label: defaultContext.name
      })
      setSelected(defaultContext)
    }
  }, [activeLocation])

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
              onClick={generateAndCopyAddresses}
              className="btn-class p-4">
              Copy Mining Configuration
            </button>
          </div>
          <div className="w-full flex justify-center pt-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-class p-4">
              Toggle Dark Mode
            </button>
          </div>
          <div className="w-full p-4">
            <p className="text-center">Select your active shard</p>
            <SelectListbox
              options={options}
              selectedOption={defaultValue}
              setSelectedOption={handleLocationChange}
            />
          </div>
        </Disclosure>
      </div>
      <Footer />
    </>
  )
}
