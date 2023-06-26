import type { Address } from "~storage/wallet"

import "../../style.css"

import { useEffect, useState } from "react"
import QRCode from "react-qr-code"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import SelectListbox from "~components/form/Listbox"
import { sortAddressesByActiveLocation } from "~storage/wallet/location"
import { useAppSelector } from "~store"

const storage = new Storage({
  area: "local"
})

export default function Receive() {
  const [sortedAddresses, setSortedAddresses] = useState<Address[]>()
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

  const [activeLocation] = useStorage<string>({
    key: "active_location",
    instance: storage
  })

  const activeAddresses = useAppSelector(
    (state) => state.activeAddresses.activeAddresses as Address[]
  )

  const handleAddressChange = (selectedOption) => {
    const address = sortedAddresses.find(
      (address) => address.address === selectedOption.value
    )
    setSelectedAddress(address)
  }

  useEffect(() => {
    sortAddresses().then((addresses) => {
      setSelectedAddress(addresses ? addresses[0] : null)
    })
  }, [activeAddresses, activeLocation])

  const options = sortedAddresses?.map((address) => ({
    value: address.address,
    label: `${address.shard} - ${address.address.slice(
      0,
      6
    )}...${address.address.slice(-4)}`
  }))

  const sortAddresses = async () => {
    if (!activeAddresses) return
    if (!activeLocation) return

    let addresses = await sortAddressesByActiveLocation(
      activeAddresses,
      activeLocation
    )
    setSortedAddresses(addresses)
    return addresses
  }

  return (
    <div className="m-4">
      <div>
        {options && (
          <SelectListbox
            options={options}
            setSelectedOption={handleAddressChange}
            selectedOption={options[0]}
          />
        )}
        {selectedAddress && (
          <div>
            <div className="flex space-y-4 w-full h-full justify-center mt-10">
              <QRCode
                value={JSON.stringify({
                  address: selectedAddress.address,
                  username: "test wallet"
                })}
                size={256}
                style={{ color: "#000000" }}
              />
            </div>
            <div className="flex justify-center flex-col mt-4 text-center">
              <div> test wallet </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
