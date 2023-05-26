import type { PlasmoMessaging } from "@plasmohq/messaging"

import { createWallet } from "~storage/wallet"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let hdWallet = await createWallet(req.body.password, req.body.mnemonic)

  res.send({
    hdWallet
  })
}

export default handler
