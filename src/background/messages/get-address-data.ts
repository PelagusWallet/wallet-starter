import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Pelagus } from "../index"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let addressData = await Pelagus.NetworkController.getAddressData(
    req.body.addresses
  )

  res.send({
    addressData
  })
}

export default handler
