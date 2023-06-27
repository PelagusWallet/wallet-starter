import type { PlasmoMessaging } from "@plasmohq/messaging"

import { addAdddressByShard } from "~storage/wallet"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let addressData = await addAdddressByShard(req.body.shard)

  res.send({
    addressData
  })
}

export default handler
