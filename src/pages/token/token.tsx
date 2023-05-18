import "../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import type { TokenNetworkAddressData } from "~background/services/network/controller"
import Footer from "~components/navigation/Footer"
import { TokenNetworkData, getToken } from "~storage/token"
import { useAppSelector } from "~store"

function TokenPage() {
  const [location, setLocation] = useLocation()
  const [tokenData, setTokenData] = useState<TokenNetworkAddressData>()

  const activeToken = useAppSelector(
    (state) => state.activeToken.activeToken as TokenNetworkData
  )

  const tokenBalanceData = useAppSelector(
    (state) => state.tokenData.tokenBalances as TokenNetworkAddressData[]
  )

  useEffect(() => {
    console.log("IN TOKEN PAGE", activeToken)
    if (!activeToken) return
    let storedTokenData = tokenBalanceData.find(
      (tokenData) => tokenData.id === activeToken.id
    )
    if (storedTokenData) {
      setTokenData(storedTokenData)
    }
  }, [activeToken])

  return (
    <div className="font-quai">
      <div className="p-6">
        <button onClick={() => setLocation("/")} className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
        <div className="flex flex-col items-center justify-center text-white cursor-default">
          <div className="text-3xl">{tokenData?.totalBalance}</div>
          <div className="text-lg"> {tokenData?.name}</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TokenPage
