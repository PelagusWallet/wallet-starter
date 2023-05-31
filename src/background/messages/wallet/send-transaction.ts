import type { PlasmoMessaging } from "@plasmohq/messaging"

import { sendTokenTransfer, signAndSendTransaction } from "~storage/wallet"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let signedTx
  try {
    if (req.body.contractAddress) {
      signedTx = await sendTokenTransfer(req.body)
    } else {
      signedTx = await signAndSendTransaction(req.body)
    }
    res.send({
      signedTx
    })
  } catch (e) {
    res.send({
      error: e.message.toString()
    })
  }
}

export default handler
