import { useEffect, useState } from "react"

import { getShardFromAddress } from "~storage/wallet"

import "../../style.css"

const shardColors = {
  prime: "bg-stone-200 text-white",
  cyprus: "bg-green-700 text-white",
  "cyprus-1": "bg-green-600 text-white",
  "cyprus-2": "bg-green-500 text-white",
  "cyprus-3": "bg-green-400 text-white",
  paxos: "bg-red-700 text-white",
  "paxos-1": "bg-red-600 text-white",
  "paxos-2": "bg-red-500 text-white",
  "paxos-3": "bg-red-400 text-white",
  hydra: "bg-blue-700 text-white",
  "hydra-1": "bg-blue-600 text-white",
  "hydra-2": "bg-blue-500 text-white",
  "hydra-3": "bg-blue-400 text-white"
}

export default function AddressLabel({ address }) {
  const [shard, setShard] = useState<string>()

  useEffect(() => {
    if (!address) return
    let shardData = getShardFromAddress(address)
    if (shardData) {
      setShard(shardData[0].shard)
    }
  }, [address])
  return (
    <div className="flex flex-row justify-end space-x-1">
      <div
        className={
          shardColors[shard] + " inline-block w-3 h-3 rounded-full my-auto"
        }
      />
      <span>{shard}</span>
    </div>
  )
}
