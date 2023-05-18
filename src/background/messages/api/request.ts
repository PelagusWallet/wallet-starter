import type { PlasmoMessaging } from "@plasmohq/messaging"

import handleRequest from "../../api/handle"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let response = await handleRequest(req.body)
  res.send(response)
}

export default handler
