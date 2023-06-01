import "../../style.css"

import { ChevronLeftIcon, PencilIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import type { TokenNetworkAddressData } from "~background/services/network/controller"
import Footer from "~components/navigation/Footer"
import TokenBalanceOverview from "~components/token/tokenBalanceOverview"
import TokenButtonGroup from "~components/token/tokenButtonGroup"
import { updateCustomToken } from "~slices/update-token"
import { TokenNetworkData } from "~storage/token"
import { useAppDispatch, useAppSelector } from "~store"
import { formatBalance } from "~utils/format"

function TokenPage() {
  const dispatch = useAppDispatch()
  const [location, setLocation] = useLocation()
  const [tokenData, setTokenData] = useState<TokenNetworkAddressData>()

  const activeToken = useAppSelector(
    (state) => state.activeToken.activeToken as TokenNetworkData
  )

  const tokenBalanceData = useAppSelector(
    (state) => state.balanceData.balanceData as TokenNetworkAddressData[]
  )

  useEffect(() => {
    if (!activeToken) return
    let storedTokenData = tokenBalanceData.find(
      (tokenData) => tokenData.id === activeToken.id
    )
    if (storedTokenData) {
      setTokenData(storedTokenData)
    }
  }, [activeToken])

  function setEditCustom() {
    dispatch(updateCustomToken(activeToken))
    setLocation("/token/add")
  }

  return (
    <div className="pb-20">
      <div className="p-6">
        <div className="flex flex-row justify-between items-center">
          <button onClick={() => setLocation("/")} className="text-gray-400">
            <ChevronLeftIcon
              className="h-6 w-6 quai-dark-grey"
              aria-hidden="true"
            />
          </button>
          {activeToken?.type === "custom" && (
            <PencilIcon
              className="h-5 w-5 cursor-pointer z-20"
              onClick={() => setEditCustom()}
            />
          )}
        </div>
        <div className="flex flex-col items-center justify-center cursor-default">
          {tokenData && (
            <div className="text-3xl">
              {formatBalance(
                tokenData?.totalBalance,
                activeToken.type == "native"
              )}
            </div>
          )}
          <div className="text-lg"> {tokenData?.name}</div>
        </div>
      </div>
      <TokenButtonGroup />
      {tokenData && <TokenBalanceOverview tokenData={tokenData} />}
      <Footer />
    </div>
  )
}

export default TokenPage
