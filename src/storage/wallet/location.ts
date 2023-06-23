import { Storage } from "@plasmohq/storage"

import { QUAI_CONTEXTS } from "~background/services/network/chains"

import type { Address } from "./index"

const storage = new Storage({ area: "local" })

/**
 * Update active location
 *
 * @param location Updated active location
 */
export async function setActiveLocation(location: string) {
  if (!location) {
    throw new Error("Location is required")
  }

  // save new active location
  await storage.set("active_location", location)
}

export const getQuaiContextForLocation = (latitude, longitude) => {
  if (longitude >= -168.2 && longitude <= -70.2) {
    // Americas: cyprus-1
    return QUAI_CONTEXTS.find((context) => context.shard === "cyprus-1")
  } else if (longitude > -70.2 && longitude <= -34.8) {
    // Americas: cyprus-2
    return QUAI_CONTEXTS.find((context) => context.shard === "cyprus-2")
  } else if (longitude > -34.8 && longitude <= 0) {
    // Europe & Africa: paxos-1
    return QUAI_CONTEXTS.find((context) => context.shard === "paxos-1")
  } else if (longitude > 0 && longitude <= 34.7) {
    // Europe & Africa: paxos-2
    return QUAI_CONTEXTS.find((context) => context.shard === "paxos-2")
  } else if (longitude > 34.7 && longitude <= 69.2) {
    // Europe & Africa: paxos-3
    return QUAI_CONTEXTS.find((context) => context.shard === "paxos-3")
  } else if (longitude > 69.2 && longitude <= 119.7) {
    // Asia: hydra-1
    return QUAI_CONTEXTS.find((context) => context.shard === "hydra-1")
  } else if (longitude > 119.7 && longitude <= 170.2) {
    // Asia: hydra-2
    return QUAI_CONTEXTS.find((context) => context.shard === "hydra-2")
  } else if (longitude > 170.2 && longitude <= 180) {
    // Asia: hydra-3
    return QUAI_CONTEXTS.find((context) => context.shard === "hydra-3")
  } else {
    throw new Error("Invalid longitude")
  }
}

export const sortAddressesByActiveLocation = (
  addresses: Address[],
  activeLocation: string
): Address[] => {
  // Split the shard string to get the base name (i.e., "hydra" from "hydra-2")
  const activeBase = activeLocation.split("-")[0]

  // Make a copy of the addresses array
  const addressesCopy = addresses.slice()

  // Sort addressesCopy
  return addressesCopy.sort((a, b) => {
    const aBase = a.shard.split("-")[0]
    const bBase = b.shard.split("-")[0]

    // Prioritize active shard
    if (a.shard === activeLocation) return -1
    if (b.shard === activeLocation) return 1

    // Prioritize shards with same base as active shard
    if (aBase === activeBase && bBase !== activeBase) return -1
    if (bBase === activeBase && aBase !== activeBase) return 1

    // Keep original order for everything else
    return 0
  })
}
