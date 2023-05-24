import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "wouter"

import "../../style.css"

import { useRef, useState } from "react"

export default function SelectSendFrom({ addressGroup }) {
  const [active, setActive] = useState(false)
  const nodeRef = useRef(null)
  const [, setLocation] = useLocation()

  function getTotalShardBalance() {
    let total = 0
    addressGroup?.addresses?.forEach((address) => {
      if (address.shard == addressGroup.shard) {
        total += address.balance
      }
    })
    return parseFloat(Number(total).toFixed(4))
  }

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
      <div
        className={
          "w-full h-full absolute rounded-md " +
          (active ? "fadeIn shard-data-div-active" : "fadeOut")
        }></div>
      <div className="p-2 opacity-100 flex-col">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-thin">{addressGroup.name}</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-[14px] font-thin text-gray-400">
            {"Balance: " + getTotalShardBalance()}
          </div>
          <div
            onClick={() => setActive(!active)}
            className="z-20	cursor-pointer text-[14px] font-thin">
            {addressGroup?.addresses.length + " Total Addresses"}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {active && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden">
              {addressGroup?.addresses.map((address, i) => (
                <div
                  key={i}
                  className="my-1 w-full flex flex-row justify-between">
                  <div
                    onClick={() => setLocation("/send?/" + address.address)}
                    className="w-4/6 flex flex-row justify-between border rounded-sm">
                    <div className="m-1">
                      {address.address.substring(0, 8) + "..."}
                    </div>
                    <div
                      onClick={() => setLocation("/send?/" + address.address)}
                      className="m-1 z-30 text-gray-400 cursor-pointer">
                      Select
                    </div>
                  </div>
                  <div className="w-2/6 m-1 float-right text-[14px] font-thin text-right">
                    {formatBalance(address.balance) + " QUAI"}
                  </div>
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
