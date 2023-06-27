import toast from "react-hot-toast"

import { Address } from "~storage/wallet"
import { formatAddress } from "~utils/format"

import "../../style.css"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import AddressLabel from "~components/accounts/addressLabel"

const storage = new Storage({ area: "local" })

export default function SelectedAddressHeader() {
  const [activeAddress] = useStorage<Address>({
    key: "active_address",
    instance: storage
  })

  function copyAddress(address: Address) {
    navigator.clipboard.writeText(address.address)
    toast("Copied to clipboard 😎"),
      { id: "copied-notification", position: "top-center" }
  }

  return (
    <>
      {activeAddress ? (
        <div className="flex flex-row">
          <div className="w-1/3 h-full">
            <div className="w-10 m-auto">
              {/* <AddressLabel address={activeAddress.address} /> */}
            </div>
          </div>
          <div className="w-1/3 justify-center">
            <div className="w-full h-full text-center py-1">
              <div
                onClick={() => copyAddress(activeAddress)}
                className="cursor-pointer hover:bg-zinc-400 rounded-md py-1 mt-1">
                <div className="text-base font-extrabold">
                  {activeAddress.name}
                </div>
                <div>{formatAddress(activeAddress.address)}</div>
              </div>
            </div>
          </div>
          <div className="w-1/3"></div>
        </div>
      ) : (
        <div className="h-[62px]"></div>
      )}
    </>
  )
}
