import type { PlasmoCSConfig } from "plasmo"

import { sendToBackgroundViaRelay } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  world: "MAIN"
}

window.quai = {
  name: "Pelagus",
  version: "0.0.0",
  request: async (message) => {
    message.url = window.location.href
    let result = await sendToBackgroundViaRelay({
      name: "api/request",
      body: message
    })
    return result
  },
  isConnected: async () => {
    let result = await sendToBackgroundViaRelay({
      name: "api/connected"
    })
    return result
  }
}
