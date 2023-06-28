import type { PlasmoMessaging } from "@plasmohq/messaging"

import { attemptGetPrivateKeyForAddress } from "~storage/wallet"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let privateKey = await attemptGetPrivateKeyForAddress(
    req.body.address,
    req.body.password
  )

  res.send({
    privateKey
  })
}

export default handler
