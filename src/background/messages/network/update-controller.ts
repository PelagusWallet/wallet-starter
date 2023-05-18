import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { DEFAULT_QUAI_DEVNET } from "~background/services/network/chains"
import type { Network } from "~background/services/network/chains"
import { getActiveWallet } from "~storage/wallet"
import { getStorageConfig } from "~utils/storage"

import { Pelagus } from "../../index"
import NetworkController from "../../services/network/controller"

// create storage client
const storage = new Storage(getStorageConfig())

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  updateNetworkController()
}

export async function updateNetworkController() {
  let activeNetwork = (await storage.get("active_network")) as Network
  if (activeNetwork === undefined) {
    activeNetwork = DEFAULT_QUAI_DEVNET
  }

  let newController = new NetworkController({
    activeNetwork: activeNetwork
  })

  Pelagus.NetworkController = newController
  let wallet = await getActiveWallet()
  if (wallet) {
    await Pelagus.NetworkController.updateNetworkController(wallet)
  }
}

export default handler
