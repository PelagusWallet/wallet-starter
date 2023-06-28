import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCheck, FaPencilAlt } from "react-icons/fa"
import { VscCopy, VscOpenPreview } from "react-icons/vsc"
import QRCode from "react-qr-code"

import type { Address } from "~storage/wallet"

import "../../../style.css"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { Network } from "~background/services/network/chains"
import { getExplorerURLForShard } from "~background/services/network/chains"
import { getShardFromAddress, updateAddressName } from "~storage/wallet"
import { formatAddress } from "~utils/format"

const storage = new Storage({ area: "local" })

export default function DetailsPage({ setPage }) {
  const [activeAddress] = useStorage<Address>({
    key: "active_address",
    instance: storage
  })

  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState(activeAddress?.name)

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

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

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  async function handleNameComplete(e) {
    setIsEditing(false)
    console.log("handleNameComplete")
    await updateAddressName(activeAddress, name)
    e.stopPropagation()
  }

  const handleEditClick = (e) => {
    setIsEditing(true)
    e.stopPropagation()
  }

  return (
    activeAddress && (
      <div className="z-10">
        <div className="flex justify-center mt-2">
          {isEditing ? (
            <form
              className="flex flex-row justify-center items-center"
              onSubmit={(e) => handleNameComplete(e)}>
              <input
                type="text"
                value={name}
                defaultValue={activeAddress?.name}
                onChange={handleNameChange}
                className="text-lg m-1 text-center input-class"
              />
              <button
                type="submit"
                onClick={(e) => handleNameComplete(e)}
                className="ml-2 cursor-pointer z-10">
                <FaCheck />
              </button>
            </form>
          ) : (
            <div className="text-lg m-1 flex justify-center items-center">
              {activeAddress?.name}
              <FaPencilAlt
                onClick={(e) => handleEditClick(e)}
                className="ml-2 cursor-pointer z-10"
              />
            </div>
          )}
        </div>

        <div className="flex space-y-4 w-full h-full justify-center mt-10">
          <QRCode
            value={JSON.stringify({
              address: activeAddress.address,
              username: activeAddress?.name
            })}
            size={128}
            style={{ color: "#000000" }}
          />
        </div>
        <div className="flex justify-center flex-col mt-4 text-center">
          <div className="text-sm m-1 break-words">{activeAddress.address}</div>
          <div className="flex flex-row justify-center">
            <span className="tooltip">
              <VscCopy
                onClick={() => copyAddress(activeAddress)}
                className="w-6 h-6 m-2 z-10 cursor-pointer"></VscCopy>
              <span className="tooltiptext">Copy address to clipboard</span>
            </span>

            <span className="tooltip">
              <VscOpenPreview
                onClick={() => linkToExplorer(activeAddress)}
                className="w-6 h-6 m-2 z-10 cursor-pointer"></VscOpenPreview>
              <span className="tooltiptext">View address on explorer</span>
            </span>
          </div>

          <div className="w-full flex justify-center">
            <button
              className="border-2 border-red-500 text-red-500 rounded-full py-2 px-4 hover:bg-red-500 hover:transition duration-200 hover:text-white"
              onClick={() => setPage("revealPrivateKey")}>
              Reveal private key
            </button>
          </div>
        </div>
      </div>
    )
  )
}
