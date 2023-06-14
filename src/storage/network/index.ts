import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import {
  ChainData,
  DEFAULT_NETWORKS
} from "~background/services/network/chains"
import type { Network } from "~background/services/network/chains"
import { getStorageConfig } from "~utils/storage"

const storage = new Storage({ area: "local" })

export async function getActiveNetwork() {
  const activeNetwork = await storage.get<Network>("active_network")
  if (activeNetwork === undefined) {
    return DEFAULT_NETWORKS[0]
  }
  return activeNetwork
}

export async function setActiveNetwork(networkName: string) {
  let activeNetwork = DEFAULT_NETWORKS.find(
    (network) => network.name === networkName
  )

  if (activeNetwork === undefined) {
    const customNetworks = await storage.get<Network[]>("custom_networks")
    activeNetwork = customNetworks.find(
      (network) => network.name === networkName
    )
  }

  if (activeNetwork === undefined) {
    // TODO: Lookup in custom networks
    throw new Error(`Network ${networkName} not found`)
  }

  await storage.set("active_network", activeNetwork)

  await sendToContentScript({
    name: "networkChanged",
    body: activeNetwork.chainID
  })
}

export async function addCustomNetwork(network: Network) {
  const customNetworks = await storage.get<Network[]>("custom_networks")
  if (customNetworks === undefined) {
    await storage.set("custom_networks", [network])
    return
  }
  await storage.set("custom_networks", [...customNetworks, network])
}

export async function getAllNetworks() {
  const customNetworks = await storage.get<Network[]>("custom_networks")
  if (customNetworks === undefined) {
    return DEFAULT_NETWORKS
  }
  return [...DEFAULT_NETWORKS, ...customNetworks]
}

export async function updateCustomNetwork(
  oldNetwork: Network,
  newNetwork: Network
) {
  const customNetworks = await storage.get<Network[]>("custom_networks")
  if (customNetworks === undefined) {
    return
  }
  const index = customNetworks.findIndex(
    (network) => network.name === oldNetwork.name
  )
  if (index === -1) {
    return
  }
  customNetworks[index] = newNetwork
  await storage.set("custom_networks", customNetworks)
  await sendToBackground({
    name: "network/update-controller"
  })
}

export async function deleteCustomNetwork(network: Network) {
  const customNetworks = await storage.get<Network[]>("custom_networks")
  if (customNetworks === undefined) {
    return
  }
  const index = customNetworks.findIndex(
    (network) => network.name === network.name
  )
  if (index === -1) {
    return
  }
  customNetworks.splice(index, 1)
  await storage.set("custom_networks", customNetworks)

  if ((await getActiveNetwork()).name === network.name) {
    await setActiveNetwork(DEFAULT_NETWORKS[0].name)
  }
}
