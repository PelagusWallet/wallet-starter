import * as bip39 from "bip39"

import type { PlasmoMessaging } from "@plasmohq/messaging"

export const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
  let mnemonic = await bip39.generateMnemonic()
  res.send(mnemonic)
}
