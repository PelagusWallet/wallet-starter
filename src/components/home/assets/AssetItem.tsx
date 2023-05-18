import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"

import type {
  AddressWithData,
  TokenNetworkAddressData
} from "~background/services/network/controller"
import { updateActiveToken } from "~slices/active-token"
import { useAppSelector } from "~store"
import { useAppDispatch } from "~store"

export default function AssetItem({ token: token }) {
  const [balance, setBalance] = useState(0)
  const [location, setLocation] = useLocation()

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  const tokenBalanceData = useAppSelector(
    (state) => state.tokenData.tokenBalances as TokenNetworkAddressData[]
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (token.type == "native") {
      setBalance(getNativeTotalBalance())
    } else {
      let storedTokenData = tokenBalanceData.find(
        (tokenData) => tokenData.id === token.id
      )
      if (storedTokenData) {
        setBalance(storedTokenData.totalBalance)
      }
    }
  }, [addressData])

  function getNativeTotalBalance() {
    if (addressData.length == 0) return
    return parseFloat(
      Number(
        addressData?.reduce((accumulator, object) => {
          return accumulator + object.balance
        }, 0)
      ).toFixed(4)
    )
  }

  const navigateToTokenPage = () => {
    dispatch(updateActiveToken(token))
    setLocation(`/token`)
  }

  return (
    <div className="mt-2 px-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div className="flex rounded-full bg-black w-8 h-8"></div>
          <div className="text-white font-quai m-auto text-lg">
            {balance} {token.name}
          </div>
        </div>
        {token.type == "native" ? null : (
          <ChevronRightIcon
            onClick={navigateToTokenPage}
            className="h-6 w-6 text-white cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}
