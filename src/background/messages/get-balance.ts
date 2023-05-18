import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Pelagus } from "../index"

const handler: PlasmoMessaging.MessageHandler = async(req, res) => {
  let balance = await Pelagus.NetworkController.getBalance(req.body.address)
  res.send({
    balance
  })
}

export default handler
