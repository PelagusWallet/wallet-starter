import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let message = "Are we connected?"
  res.send({
    message
  })
}

export default handler
