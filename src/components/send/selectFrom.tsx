import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "wouter"

import "../../style.css"

import { useRef, useState } from "react"

export default function SelectSendFrom({ addressGroup }) {
  const [active, setActive] = useState(false)
  const nodeRef = useRef(null)
  const [, setLocation] = useLocation()

  function formatBalance(balance) {
    return parseFloat(Number(balance).toFixed(4))
  }

  return (
    <div
      className={
        "cursor-pointer shard-data-height rounded-md relative secondary-bg-container transition-[height] ease-in-out duration-500 max-height " +
        (active ? "" : "bg-transparent")
      }
      onClick={() => setActive(!active)}>
      <div className="py-1 px-2.5 opacity-100 flex-col">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-thin">{addressGroup.name}</div>
          <div className="flex flex-row">
            <div
              className="text-[14px] font-thin"
              onClick={() =>
                setLocation("/send?/" + addressGroup.addresses[0].address)
              }>
              Select
            </div>
          </div>
        </div>

        {addressGroup?.addresses.map((address, i) => (
          <div key={i} className="w-full flex flex-row justify-between">
            <div className="w-4/6 flex flex-row justify-between rounded-sm text-[14px]">
              <div className="m-1">
                {address.address.substring(0, 6) +
                  "..." +
                  address.address.substring(38, 42)}
              </div>
            </div>
            <div className="w-2/6 m-1 float-right text-[14px] font-thin text-right">
              {formatBalance(address.balance) + " QUAI"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
