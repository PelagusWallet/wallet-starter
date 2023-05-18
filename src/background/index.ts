import type NetworkController from "~background/services/network/controller"

import { updateNetworkController } from "./messages/network/update-controller"

export class PelagusController {
  public NetworkController: NetworkController
}

export let Pelagus = new PelagusController()

export default async function InitializePelagus() {
  console.log("INITIALIZED PELAGUS 🚀")

  updateNetworkController()
}
