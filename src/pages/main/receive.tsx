import toast from "react-hot-toast"
import { VscCopy, VscOpenPreview } from "react-icons/vsc"

import type { Address } from "~storage/wallet"
import { getShardFromAddress } from "~storage/wallet"

import "../../style.css"

import QRCode from "react-qr-code"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { Network } from "~background/services/network/chains"
import { getExplorerURLForShard } from "~background/services/network/chains"
import { formatAddress } from "~utils/format"

const storage = new Storage({
  area: "local"
})

export default function Receive() {
  const [activeAddress] = useStorage<Address>({
    key: "active_address",
    instance: storage
  })
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

  return (
    <div className="m-4">
      <div>
        {activeAddress && (
          <div>
            <div className="flex space-y-4 w-full h-full justify-center mt-10">
              <QRCode
                value={JSON.stringify({
                  address: activeAddress.address,
                  username: activeAddress?.name
                })}
                size={256}
                style={{ color: "#000000" }}
              />
            </div>
            <div className="flex justify-center flex-col mt-4 text-center">
              <div className="text-lg m-1"> {activeAddress?.name} </div>
              <div className="text-sm m-1">
                {" "}
                {formatAddress(activeAddress.address)}{" "}
              </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
