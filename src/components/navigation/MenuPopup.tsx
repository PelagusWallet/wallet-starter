import React, { useEffect, useState } from "react"
import { useLocation } from "wouter"

import type { Address } from "~storage/wallet"
import { getAddresses, setActiveAddress } from "~storage/wallet"

import "../../style.css"

import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { Cog6ToothIcon, PlusCircleIcon } from "@heroicons/react/24/solid"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import AddressLabel from "~components/accounts/addressLabel"
import { formatAddress } from "~utils/format"

const storage = new Storage({ area: "local" })

export default function MenuPopup({ onClicked }) {
  const [location, setLocation] = useLocation()
  const [addresses, setAddresses] = useState<Address[]>([])

  const [activeAddress] = useStorage<Address>({
    key: "active_address",
    instance: storage
  })

  useEffect(() => {
    async function fetchAddresses() {
      let addresses = await getAddresses()
      setAddresses(addresses)
    }
    fetchAddresses()
  }, [])

  function clickAddress(address: Address) {
    setActiveAddress(address)
    onClicked()
  }

  function clickAddAddress() {
    setLocation("/add-address")
    onClicked()
  }

  function clickSettingsButton() {
    setLocation("/settings")
    onClicked()
  }

  return (
    <div>
      <div className="absolute w-screen h-screen" onClick={onClicked}></div>
      <div className="absolute top-[70px] p-2 w-full">
        <div className="modal-content secondary-bg-container cursor-pointer border border-3 p-0">
          <div className="border-b">
            <div className="m-2 text-base">My accounts</div>
          </div>
          {addresses.map((address) => {
            return (
              <div
                onClick={() => clickAddress(address)}
                className="flex flex-row mb-3 m-2 w-full">
                <div className="flex flex-row w-1/2">
                  {address.address === activeAddress.address ? (
                    <CheckCircleIcon className="h-6 w-6 my-auto mr-2 text-green-600"></CheckCircleIcon>
                  ) : (
                    <div className="h-6 w-6 my-auto mr-2"></div>
                  )}
                  <div className="items-center my-auto w-fit">
                    {address.name}
                  </div>
                </div>
                <div className="my-auto w-1/2 flex justify-end mr-10">
                  <div className="w-fit">
                    <AddressLabel address={address.address}></AddressLabel>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="flex flex-col mt-2">
            <div className="border-t-2" onClick={clickAddAddress}>
              <div className="flex flex-row m-2">
                <PlusCircleIcon className="h-6 w-6 my-auto" />
                <div className="block rounded-md px-3 text-base font-medium">
                  Add Account
                </div>
              </div>
            </div>
            <div onClick={clickSettingsButton}>
              <div className="flex flex-row m-2">
                <Cog6ToothIcon className="h-6 w-6 my-auto" />
                <div className="block rounded-md px-3 text-base font-medium">
                  Settings
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
