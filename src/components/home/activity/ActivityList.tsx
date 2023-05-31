import { useEffect } from "react"

import { RPCTransactionResult } from "~background/services/network/controller"
import { useAppSelector } from "~store"

import ActivityItem from "./activityItem"

export default function ActivityList() {
  const activityData = useAppSelector(
    (state) => state.activityData.activityResults as RPCTransactionResult[]
  )

  useEffect(() => {}, [activityData])

  return (
    <div className="p-4 space-y-4 pb-20">
      {activityData?.map((activity, index) => {
        return <ActivityItem key={index} activity={activity} />
      })}
    </div>
  )
}
