import type { PlasmoCSConfig } from "plasmo"

import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  all_frames: true
}

const OnMessage = () => {
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name) {
      console.log(req)
    }

    switch (req.name) {
      case "networkChanged":
        dispatchEvent(
          new CustomEvent("networkChanged", {
            detail: { network: req.body }
          })
        )
        break
    }
  })
}

export default OnMessage
