import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Pelagus } from "../index"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let activityData = await Pelagus.NetworkController.fetchActivity(
    req.body.addresses
  )

  res.send({
    activityData
  })
}

export default handler
