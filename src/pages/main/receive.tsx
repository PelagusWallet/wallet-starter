import toast from "react-hot-toast"
import { VscCopy, VscOpenPreview } from "react-icons/vsc"

import type { Address } from "~storage/wallet"
import { getShardFromAddress } from "~storage/wallet"

import "../../style.css"

import { useEffect, useState } from "react"
import QRCode from "react-qr-code"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { Network } from "~background/services/network/chains"
import { getExplorerURLForShard } from "~background/services/network/chains"
import SelectListbox from "~components/form/Listbox"
import type { StoredWallet } from "~storage/wallet"
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

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

  const [activeWallet] = useStorage<StoredWallet>({
    key: "active_wallet",
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
                  username: activeWallet?.nickname
                })}
                size={256}
                style={{ color: "#000000" }}
              />
            </div>
            <div className="flex justify-center flex-col mt-4 text-center">
              <div className="text-lg m-1"> {activeWallet?.nickname} </div>
              <div className="flex flex-row justify-center">
                <span className="tooltip">
                  <VscCopy
                    onClick={() => copyAddress(selectedAddress)}
                    className="w-6 h-6 m-2 z-10 cursor-pointer"></VscCopy>
                  <span className="tooltiptext">Copy address to clipboard</span>
                </span>

                <span className="tooltip">
                  <VscOpenPreview
                    onClick={() => linkToExplorer(selectedAddress)}
                    className="w-6 h-6 m-2 z-10 cursor-pointer"></VscOpenPreview>
                  <span className="tooltiptext">View address on explorer</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
