import { Disclosure } from "@headlessui/react"
import { useEffect, useState } from "react"
import Jdenticon from "react-jdenticon"
import pelagusDarkBlueIcon from "url:/assets/logos/dark-blue/png/icon.png"
import pelagusLightBlueIcon from "url:/assets/logos/light-blue/png/icon.png"
import { useLocation } from "wouter"

import { Address } from "~storage/wallet"
import { formatAddress } from "~utils/format"

import "../../style.css"

import { ChevronDownIcon } from "@heroicons/react/24/outline"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"

import MenuPopup from "./MenuPopup"
import NetworkPopup from "./NetworkPopup"

const storage = new Storage({ area: "local" })

export default function MenuBar() {
  const [location, setLocation] = useLocation()
  const [MenuPopupOpen, setMenuPopupOpen] = useState(false)
  const [NetworkPopupOpen, setNetworkPopupOpen] = useState(false)

  const [activeAddress] = useStorage<Address>({
    key: "active_address",
    instance: storage
  })

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: storage
  })

  function networkButtonClick() {
    setNetworkPopupOpen(!NetworkPopupOpen)
  }

  function clickAccountButton() {
    setMenuPopupOpen(!MenuPopupOpen)
  }

  useEffect(() => {
    console.log(activeAddress)
  }, [activeAddress])

  return (
    <div className=" secondary-bg-container fixed top-0 w-full z-50">
      <div className=" min-h-full">
        {MenuPopupOpen && <MenuPopup onClicked={clickAccountButton} />}
        {NetworkPopupOpen && <NetworkPopup onClicked={networkButtonClick} />}
        <Disclosure as="nav" className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => setLocation("/")}>
                  {darkMode ? (
                    <img
                      className="h-9"
                      src={pelagusLightBlueIcon}
                      alt="Pelagus"
                    />
                  ) : (
                    <img
                      className="h-9"
                      src={pelagusDarkBlueIcon}
                      alt="Pelagus"
                    />
                  )}
                </div>
              </div>
              <Disclosure.Button
                onClick={() => networkButtonClick()}
                className="hover:bg-pelagus-dark-blue dark:hover:bg-pelagus-light-blue hover:text-white  w-1/3 rounded-full inline-flex items-center justify-center ease-in-out focus:outline-none p-1 shadow shadow-pelagus-dark-blue dark:shadow-pelagus-light-blue border border-pelagus-dark-blue dark:border-pelagus-light-blue">
                <div className="w-full flex flex-row items-center justify-center px-1">
                  <div className="text-center">{activeNetwork?.name}</div>
                  <ChevronDownIcon className="w-3 h-3" />
                </div>
              </Disclosure.Button>
              <div
                className="p-1 my-1 mr-1 border-2 rounded-full border-pelagus-dark-blue dark:border-pelagus-light-blue cursor-pointer shadow shadow-pelagus-dark-blue dark:shadow-pelagus-light-blue overflow-hidden"
                onClick={() => clickAccountButton()}>
                {activeAddress ? (
                  <Jdenticon
                    size="38"
                    value={activeAddress.address ? activeAddress.address : ""}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Disclosure>
      </div>
    </div>
  )
}
