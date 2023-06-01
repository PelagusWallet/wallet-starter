import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "wouter"

import "../../style.css"

import { useEffect, useRef, useState } from "react"

import type { TokenNetworkAddressData } from "~background/services/network/controller"
import AddressLabel from "~components/accounts/addressLabel"
import { TokenNetworkData, getToken } from "~storage/token"
import { useAppSelector } from "~store"

export default function SelectSendFrom() {
  const [, setLocation] = useLocation()
  const [tokenData, setTokenData] = useState<TokenNetworkAddressData>()

  const activeToken = useAppSelector(
    (state) => state.activeToken.activeToken as TokenNetworkData
  )

  const balanceData = useAppSelector(
    (state) => state.balanceData.balanceData as TokenNetworkAddressData[]
  )

  useEffect(() => {
    if (!activeToken) return
    let storedTokenData = balanceData.find(
      (tokenData) => tokenData.id === activeToken.id
    )
    if (storedTokenData) {
      setTokenData(storedTokenData)
    }
  }, [activeToken])

  const formatBalance = (balance: number) => {
    // format large balance with e notation
    if (balance > 100000000) {
      return balance.toExponential(2)
    }
    // format small balance with 4 decimal places
    return parseFloat(Number(balance).toFixed(4))
  }
  return (
    <div>
      <ul role="list" className="space-y-3">
        {tokenData?.addresses?.map((address, i) => {
          if (!address || address?.balance == 0) {
            return <div> </div>
          } else {
            return (
              <div className="cursor-pointer shard-data-height rounded-md relative secondary-bg-container transition-[height] ease-in-out duration-500 max-height">
                <div className="py-1 px-2.5 opacity-100 flex-col">
                  <div className="flex flex-row justify-between">
                    <AddressLabel address={address.address} />
                    <div className="flex flex-row">
                      <div
                        className="text-[14px] font-thin"
                        onClick={() =>
                          setLocation("/send?/" + address.address)
                        }>
                        Select
                      </div>
                    </div>
                  </div>
                  <div key={i} className="w-full flex flex-row justify-between">
                    <div className="w-4/6 flex flex-row justify-between rounded-sm text-[14px]">
                      <div className="m-1">
                        {address.address.substring(0, 6) +
                          "..." +
                          address.address.substring(38, 42)}
                      </div>
                    </div>
                    <div className="w-3/6 m-1 float-right text-[14px] font-thin text-right">
                      {formatBalance(address.balance) +
                        " " +
                        activeToken.symbol}
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })}
      </ul>
    </div>
  )
}
