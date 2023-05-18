import type { PlasmoMessaging } from "@plasmohq/messaging"

import { addAdddressByShard } from "~storage/wallet"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("generate-address.ts", req.body)
  let addressData = await addAdddressByShard(
    req.body.wallet,
    req.body.path,
    req.body.index,
    req.body.shard
  )

  res.send({
    addressData
  })
}

export default handler
