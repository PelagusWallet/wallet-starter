import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Pelagus } from "../index"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let tokenBalanceData = await Pelagus.NetworkController.getTokenBalances(
    req.body.addresses
  )

  res.send({
    tokenBalanceData
  })
}

export default handler
