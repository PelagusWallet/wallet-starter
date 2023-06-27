import React, { useEffect, useState } from "react"
import { useLocation } from "wouter"

import type { Address } from "~storage/wallet"
import { getAddresses, setActiveAddress } from "~storage/wallet"

import "../../style.css"

import { Cog6ToothIcon, PlusCircleIcon } from "@heroicons/react/24/solid"

import { formatAddress } from "~utils/format"

export default function MenuPopup({ onClicked }) {
  const [location, setLocation] = useLocation()
  const [addresses, setAddresses] = useState<Address[]>([])

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
        <div className="modal-content secondary-bg-container cursor-pointer border border-3 ">
          {addresses.map((address) => {
            return (
              <div
                onClick={() => clickAddress(address)}
                className="flex flex-col mb-3 ml-3">
                <div>{address.name}</div>
              </div>
            )
          })}
          <div className="flex flex-col space-y-4 mt-2">
            <div className="border-b-1" onClick={clickAddAddress}>
              <div className="flex flex-row">
                <PlusCircleIcon className="h-6 w-6 my-auto" />
                <div className="block rounded-md px-3 text-base font-medium">
                  Add Account
                </div>
              </div>
            </div>
            <div className="border-b-1" onClick={clickSettingsButton}>
              <div className="flex flex-row">
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
