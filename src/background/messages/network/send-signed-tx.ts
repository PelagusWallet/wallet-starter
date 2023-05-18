import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Pelagus } from "../../index"

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let fromAddress = req.body.fromAddress
  let signedTx = req.body.signedTx

  let provider = Pelagus.NetworkController.getProviderForAddress(fromAddress)
  if (provider) {
    try {
      let response = await provider.sendTransaction(signedTx)
      res.send({
        response
      })
    } catch (e) {
      res.send({
        e
      })
    }
  }
}
