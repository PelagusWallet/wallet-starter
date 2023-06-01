import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import quaiIcon from "url:/assets/quai-icon.png"
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
import { formatBalance } from "~utils/format"

export default function AssetItem({ token: token }) {
  const [balance, setBalance] = useState(0)
  const [location, setLocation] = useLocation()

  const addressData = useAppSelector(
    (state) => state.addressData.addressesWithData as AddressWithData[]
  )

  const balanceData = useAppSelector(
    (state) => state.balanceData.balanceData as TokenNetworkAddressData[]
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
      getNativeTotalBalance()
    } else {
      let storedTokenData = balanceData.find(
        (tokenData) => tokenData.id === token.id
      )
      if (storedTokenData) {
        setBalance(storedTokenData.totalBalance)
      }
    }
  }, [addressData, balanceData])

  async function getNativeTotalBalance() {
    let addressData = balanceData.find(
      (token) => token.type === "native"
    ).addresses
    if (addressData?.length == 0) return
    let balance = addressData.reduce((acc, curr) => {
      return acc + curr.balance
    }, 0)

    balance = parseFloat(Number(balance).toFixed(4))
    setBalance(balance)
  }

  const navigateToTokenPage = () => {
    dispatch(updateActiveToken(token))
    setLocation(`/token`)
  }

  return (
    <div className="mt-3 px-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          {token.type == "native" ? (
            <img className="w-8 h-8 mr-2" src={quaiIcon} alt="quai-icon" />
          ) : (
            <div
              className={`flex rounded-full w-8 h-8 mr-2 ${
                darkMode ? `bg-white` : `bg-black`
              }  `}></div>
          )}
          <div className="m-auto text-lg">
            {formatBalance(balance, token.type == "native")} {token.name}
          </div>
        </div>
        <ChevronRightIcon
          onClick={navigateToTokenPage}
          className="h-6 w-6 cursor-pointer"
        />
      </div>
    </div>
  )
}
