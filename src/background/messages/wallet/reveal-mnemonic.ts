import type { PlasmoMessaging } from "@plasmohq/messaging"

import { decryptMnemonic } from "~crypto"
import { attemptGetKeyfileForWallet } from "~storage/wallet"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let keyfile = await attemptGetKeyfileForWallet(
    req.body.pubkey,
    req.body.password
  )

  let decryptedMnemonic = await decryptMnemonic(
    req.body.password,
    keyfile.mnemonic
  )
  res.send({
    decryptedMnemonic
  })
}

export default handler
