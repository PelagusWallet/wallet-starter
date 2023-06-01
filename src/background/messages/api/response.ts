import type { PlasmoMessaging } from "@plasmohq/messaging"

import { handleResponse } from "../../api/handle"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let response = await handleResponse(req.body)
  res.send(response)
}

export default handler
