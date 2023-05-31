// @material-tailwind/react
import React from "react"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import { updateActiveAddresses } from "~slices/active-addresses"
import { updateActivityData } from "~slices/activity-data"
import { updateBalanceData } from "~slices/balance-data"
import type { TokenNetworkData } from "~storage/token"
import type { Address, StoredWallet } from "~storage/wallet"
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

  const [tokens] = useStorage<TokenNetworkData[]>({
    key: "tokens",
    instance: storage
  })

  useEffect(() => {
    if (!activeWallet) return
    fetchAddressData().catch((err) => console.error(err))
    const intervalId = setInterval(fetchAddressData, 10000) // Update data every 10 seconds
    return () => {
      clearInterval(intervalId) // Clean up the interval when the component unmounts
    }
  }, [activeWallet, activeNetwork, tokens])

  async function fetchData(addresses: Address[]) {
    console.log("tokens here", tokens)
    try {
      let balanceDataPromise = sendToBackground({
        name: "get-balance-data",
        body: {
          addresses: addresses
        }
      })

      let activityDataPromise = sendToBackground({
        name: "get-activity-data",
        body: {
          addresses: addresses
        }
      })

      const [getBalanceDataReponse, acitivityDataResponse] = await Promise.all([
        balanceDataPromise,
        activityDataPromise
      ])

      dispatch(updateBalanceData(getBalanceDataReponse.tokenBalanceData))
      dispatch(updateActivityData(acitivityDataResponse.activityData))
    } catch (error) {
      // handle error
      console.log(error)
    }
  }

  async function fetchAddressData() {
    // Get addresses off of activeWallet derivations and match activeNetwork
    // chain code
    if (!activeWallet || !activeNetwork) return
    const addresses = activeWallet.derivations.filter(
      (derivation) => derivation.chainCode === activeNetwork.chainCode
    )[0].addresses

    dispatch(updateActiveAddresses(addresses))

    await fetchData(addresses)
  }

  return <div></div>
}

export default Fetcher
