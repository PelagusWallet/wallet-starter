// @material-tailwind/react
import React from "react"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import { updateActiveAddresses } from "~slices/active-addresses"
import { updateActiveToken } from "~slices/active-token"
import { updateActivityData } from "~slices/activity-data"
import { updateBalanceData } from "~slices/balance-data"
import type { TokenNetworkData } from "~storage/token"
import { DEFAULT_TOKENS } from "~storage/token"
import type { Address } from "~storage/wallet"
import { useAppDispatch } from "~store"

const storage = new Storage({ area: "local" })

function Fetcher() {
  // const [signedIn, setSignedIn] = useState<boolean>(false)
  const [activeAddress] = useStorage<Address>({
    key: "active_address",
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
    if (!activeAddress) return
    dispatch(updateActiveToken(DEFAULT_TOKENS[0]))
    fetchData().catch((err) => console.error(err))
    const intervalId = setInterval(fetchData, 10000) // Update data every 10 seconds
    return () => {
      clearInterval(intervalId) // Clean up the interval when the component unmounts
    }
  }, [activeAddress, activeNetwork, tokens])

  async function fetchData() {
    try {
      let balanceDataPromise = sendToBackground({
        name: "get-balance-data",
        body: {
          addresses: [activeAddress]
        }
      })

      let activityDataPromise = sendToBackground({
        name: "get-activity-data",
        body: {
          addresses: [activeAddress]
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

  return <div></div>
}

export default Fetcher
