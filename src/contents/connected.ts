import type { PlasmoCSConfig } from "plasmo"

import { relayMessage, sendToBackground } from "@plasmohq/messaging"
import { relay } from "@plasmohq/messaging/relay"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>", "http://localhost:*/*"]
}

relay(
  {
    name: "api/connected" as const
  },
  async (req) => {
    const result = await sendToBackground(req)
    return result
  }
)
