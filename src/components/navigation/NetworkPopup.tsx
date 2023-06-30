import React, { useEffect, useState } from "react"

import "../../style.css"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import SwitchNetworks from "~components/settings/networks/switchNetworks"

const storage = new Storage({ area: "local" })

export default function NetworkPopup({ onClicked }) {
  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

  return (
    <div>
      <div className="absolute w-screen h-screen" onClick={onClicked}></div>
      <div className="absolute top-[70px] p-2 w-full">
        <div className="modal-content secondary-bg-container cursor-pointer border border-3 p-0 w-full">
          <SwitchNetworks activeNetwork={activeNetwork} />
        </div>
      </div>
    </div>
  )
}
