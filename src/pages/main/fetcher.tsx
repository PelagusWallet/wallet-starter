// @material-tailwind/react
import React from "react"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import { updateActivityData } from "~slices/activity-data"
import { updateAddressData } from "~slices/address-data"
import { updateTokenBalanceData } from "~slices/token-balance-data"
import type { StoredWallet } from "~storage/wallet"
import { useAppDispatch } from "~store"

const storage = new Storage({ area: "local" })

function Fetcher() {
  // const [signedIn, setSignedIn] = useState<boolean>(false)
  const [activeWallet] = useStorage<StoredWallet>({
    key: "active_wallet",
    instance: storage
  })

  const dispatch = useAppDispatch()

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

  useEffect(() => {
    if (!activeWallet) return
    fetchAddressData().catch((err) => console.error(err))
    const intervalId = setInterval(fetchAddressData, 10000) // Update data every 10 seconds
    return () => {
      clearInterval(intervalId) // Clean up the interval when the component unmounts
    }
  }, [activeWallet, activeNetwork])

  async function fetchAddressData() {
    // Get addresses off of activeWallet derivations and match activeNetwork
    // chain code
    if (!activeWallet || !activeNetwork) return
    const addresses = activeWallet.derivations.filter(
      (derivation) => derivation.chainCode === activeNetwork.chainCode
    )[0].addresses

    const addressDataResponse = await sendToBackground({
      name: "get-address-data",
      body: {
        addresses: addresses
      }
    })

    const acitivityDataResponse = await sendToBackground({
      name: "get-activity-data",
      body: {
        addresses: addresses
      }
    })

    const getTokenDataResponse = await sendToBackground({
      name: "get-token-balance-data",
      body: {
        addresses: addresses
      }
    })

    console.log("activeNetwork in fetcher", activeNetwork)
    console.log("setting address data", addressDataResponse.addressData)
    console.log("setting activity data", acitivityDataResponse.activityData)
    dispatch(updateAddressData(addressDataResponse.addressData))
    dispatch(updateActivityData(acitivityDataResponse.activityData))
    dispatch(updateTokenBalanceData(getTokenDataResponse.tokenBalanceData))
  }

  return <div></div>
}

export default Fetcher
