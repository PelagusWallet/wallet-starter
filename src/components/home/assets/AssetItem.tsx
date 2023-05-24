import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

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

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: new Storage({
      area: "local"
    })
  })

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
    <div className="mt-3 px-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div
            className={`flex rounded-full w-8 h-8 mr-2 ${
              darkMode ? `bg-white` : `bg-black`
            }  `}></div>
          <div className="m-auto text-lg">
            {balance} {token.name}
          </div>
        </div>
        {token.type == "native" ? null : (
          <ChevronRightIcon
            onClick={navigateToTokenPage}
            className="h-6 w-6cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}
