import { useEffect, useState } from "react"

import { RPCTransactionResult } from "~background/services/network/controller"
import ActivityItem from "~components/home/activity/activityItem"
import { useAppSelector } from "~store"

import "../../style.css"

import TokenData from "./tokenData"

export default function TokenBalanceOverview({ tokenData }) {
  const [filteredActivity, setFilteredActivity] = useState<
    RPCTransactionResult[]
  >([])

  const activityData = useAppSelector(
    (state) => state.activityData.activityResults as RPCTransactionResult[]
  )

  useEffect(() => {
    if (!tokenData) return

    if (tokenData.type === "native") {
      let filteredActivity = activityData.filter((activity) => {
        return activity.contractAddress === null
      })
      setFilteredActivity(filteredActivity)
      return
    }

    let tokenAddrs = tokenData.shardData.map((addr) => addr.address)
    let filteredActivity = activityData.filter((activity) => {
      return tokenAddrs
        .map((addr) => {
          if (addr === undefined) {
            return false
          } else {
            return addr.toLowerCase()
          }
        })
        .includes(activity.contractAddress?.toLowerCase())
    })
    setFilteredActivity(filteredActivity)
  }, [tokenData, activityData])

  return (
    <div className="mt-2 px-4">
      <ul role="list" className="space-y-3">
        {tokenData.addresses?.map((address, i) => (
          <div key={i}>
            {address.balance > 0 && (
              <TokenData key={"tokenData" + i} address={address} />
            )}
          </div>
        ))}
      </ul>
      <div>
        {filteredActivity?.map((activity, index) => {
          return (
            <ActivityItem key={"activityItem" + index} activity={activity} />
          )
        })}
      </div>
    </div>
  )
}
