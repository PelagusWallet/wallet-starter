import { watch } from "fs"
import { Wallet, quais } from "quais"
import type { HDNode } from "quais/lib/utils"
import { useEffect } from "react"
import browser from "webextension-polyfill"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"

import { getActiveNetwork } from "~/storage/network"
import { setupDefaultTokens } from "~/storage/token"
import { QUAI_CONTEXTS, QuaiContext } from "~background/services/network/chains"
import {
  decryptHDKey,
  deriveAddress,
  encryptHDKey,
  encryptMnemonic,
  getWalletFromMnemonic
} from "~crypto"

import { WALLET_GENERATED } from "./constants"
import { watchKeyRemoval } from "./password"

const storage = new Storage({ area: "local" })
const secureStorage = new SecureStorage({ area: "local" })

/**
 * Address object that contains the BIP-39 index that it was derived at
 */
export class Address {
  index: number
  path: string
  address: string
  shard: string
}

/**
 * Object that contains a BIP-39 path and addresses at index
 */
export class PathAddresses {
  path: string
  addresses: Address[]
  chainCode: number
}

/**
 * Keyfile stored in secure storage
 */
export interface Keyfile {
  nickname: string
  pubkey: string
  keyfile: string
  mnemonic: string
  type: string
}

/**
 * StoredWallet stored in the localstorage
 */
export interface StoredWallet {
  nickname: string
  pubkey: string
  derivations: PathAddresses[]
  type: string
}

/**
 * Hook that opens a new tab if Pelagus has not been set up yet
 */

export const useSetUp = (darkMode) =>
  useEffect(() => {
    ;(async () => {
      // inject jdenticon color
      window.jdenticon_config = {
        lightness: {
          color: [1, 1],
          grayscale: [1, 1]
        },
        backColor: darkMode ? "#ffffff" : "#000000"
      }

      const setup = await storage.get("is_setup")

      if (!setup) {
        await browser.tabs.create({
          url: browser.runtime.getURL("tabs/welcome.html")
        })
        window.top.close()
      }

      watchKeyRemoval()

      // Add default tokens to storage and set active token
      setupDefaultTokens()
    })()
  }, [])

/**
 * Get the active address
 */
export async function getActiveWallet(): Promise<StoredWallet | null> {
  const activeWallet = (await storage.get("active_wallet")) as StoredWallet
  if (!activeWallet) {
    return null
  }
  return activeWallet
}

/**
 * Update active address
 *
 * @param address Updated active address
 */
export async function setActiveWallet(newActiveWallet?: StoredWallet) {
  const wallets = await getWallets()
  let wallet = wallets.find(
    (wallet) => wallet.pubkey === newActiveWallet.pubkey
  )
  if (!wallet) {
    return
  }

  // save new active address
  await storage.set("active_wallet", wallet)
}

/**
 * Get wallets from storage
 *
 * @returns Wallets in storage
 */
export async function getWallets() {
  let wallets: StoredWallet[] = await storage.get("wallets")
  return wallets || []
}

/**
 * Get keyfiles from secure storage
 * @param password
 * @returns
 */
export async function getKeyfiles(password?: string) {
  if (!password) {
    password = await storage.get("decryption_key")
    if (!password) {
      return []
    }
  }

  await secureStorage.setPassword(password)
  let keyfiles: Keyfile[] = await secureStorage.get("keyfiles")
  return keyfiles || []
}

/**
 * Get keyfile for wallet
 * @param pubkey
 */
function getKeyfileForWallet(pubkey: string) {
  return getKeyfiles().then((keyfiles) =>
    keyfiles.find((keyfile) => keyfile.pubkey === pubkey)
  )
}

/**
 * Get keyfile for wallet
 * @param pubkey
 * @param password
 */
export function attemptGetKeyfileForWallet(pubkey: string, password: string) {
  return getKeyfiles(password).then((keyfiles) =>
    keyfiles.find((keyfile) => keyfile.pubkey === pubkey)
  )
}

/**
 * Create a new wallet
 * @param password
 * @param mnemonic
 * @returns hdWallet
 */
export async function createWallet(password: string, mnemonic: string) {
  // check password
  await secureStorage.setPassword(password)
  await secureStorage.set("keyfiles", [])
  await storage.set("wallets", [])

  let hdWallet = await getWalletFromMnemonic(mnemonic)
  await addWallet(hdWallet, mnemonic, password)

  await storage.set("decryption_key", password)
  await storage.set("is_setup", true)
  await storage.set("signed_in", true)

  return hdWallet
}

/**
 * Add a wallet for the user
 *
 * @param wallet Wallet JWK object
 * @param password Password to encrypt with
 */
export async function addWallet(wallet: any, mnemonic: any, password: string) {
  const wallets = await getWallets()
  const keyfiles = await getKeyfiles()
  const freshInstall = wallets.length === 0

  const encryptedHDKey = await encryptHDKey(password, wallet)
  const encryptedMnemonic = await encryptMnemonic(password, mnemonic)

  // Get address at default hdPath and 0 index
  const chainCode = 994
  const hdPath = "m/44'/994'/0'/0"
  let addresses = []
  for (const shard of QUAI_CONTEXTS) {
    const address = grindAddress(wallet, hdPath, 0, shard.shard)

    const addressList: Address = {
      index: address.index,
      address: address.address,
      path: hdPath + "/" + address.index.toString(),
      shard: shard.shard
    }

    addresses.push(addressList)
  }

  const addressDerivations: PathAddresses[] = [
    {
      chainCode: chainCode,
      path: hdPath,
      addresses: addresses
    }
  ]

  let accountNode = wallet.derive(hdPath)

  let walletName = `Wallet ${wallets.length + 1}`
  // Push wallet
  wallets.push({
    nickname: walletName,
    pubkey: accountNode.publicKey.toString("hex"),
    derivations: addressDerivations,
    type: WALLET_GENERATED
  })

  keyfiles.push({
    nickname: walletName,
    pubkey: accountNode.publicKey.toString("hex"),
    keyfile: encryptedHDKey,
    mnemonic: encryptedMnemonic,
    type: WALLET_GENERATED
  })

  // Save data
  await secureStorage.setPassword(password)
  await secureStorage.set("keyfiles", keyfiles)
  await storage.set("wallets", wallets)

  // Set active wallet
  await storage.set("active_wallet", wallets[0])
}

export async function addAdddressByShard(
  wallet: any,
  path: string,
  index: number,
  shard: string
) {
  const wallets = await getWallets()

  // Decrypt and derive address
  const password = await storage.get("decryption_key")
  const keyfile = await getKeyfileForWallet(wallet.pubkey)

  const hdKey = await decryptHDKey(password, keyfile.keyfile)
  const newAddress = grindAddress(hdKey, path, index, shard)

  // Add address to derivation in place
  const newDerivations = wallet.derivations.map((item) => {
    if (item.path !== path) {
      return item
    }

    let contains = false
    if (
      item.addresses.find((address) => address.address === newAddress.address)
    ) {
      contains = true
    }

    if (!contains) {
      item.addresses.push(newAddress)
    }

    return {
      ...item,
      addresses: item.addresses
    }
  })

  // Update wallet in place
  const newWallets = wallets.map((item) => {
    if (item.pubkey !== wallet.pubkey) {
      return item
    }

    return {
      ...item,
      derivations: newDerivations
    }
  })

  // save updated wallets
  await storage.set("wallets", newWallets)

  let activeWallet = await getActiveWallet()
  if (activeWallet.pubkey === wallet.pubkey) {
    wallet.derivations = newDerivations
    await setActiveWallet(wallet)
  }

  await sendToBackground({
    name: "network/update-controller"
  })
}

function grindAddress(hdKey, path, index, shard) {
  let found = false
  let newAddress = ""
  while (!found) {
    newAddress = deriveAddress(hdKey, { hdPath: path, index: index })
    let addrShard = getShardFromAddress(newAddress)

    // Check if address is in a shard
    if (addrShard[0] !== undefined) {
      // Check if address is in correct shard
      if (addrShard[0].shard === shard) {
        found = true
        break
      }
    }
    index++
  }
  return {
    address: newAddress,
    index: index,
    path: path + "/" + index.toString()
  }
}

export function getShardFromAddress(address: string) {
  return QUAI_CONTEXTS.filter((obj) => {
    const num = Number(address.substring(0, 4))
    const start = Number("0x" + obj.byte[0])
    const end = Number("0x" + obj.byte[1])
    return num >= start && num <= end
  })
}

export class QuaiContextAddresses extends QuaiContext {
  addresses: Address[]
}

export function groupByPrefix(addresses: Address[]) {
  let groups = QUAI_CONTEXTS as QuaiContextAddresses[]
  groups.forEach((obj) => (obj.addresses = []))
  for (let i = 0; i < addresses.length; i++) {
    const shard = getShardFromAddress(addresses[i].address)
    if (shard[0] !== undefined) {
      groups
        .find((obj) => obj.name === shard[0].name)
        .addresses.push(addresses[i])
    }
  }
  return groups
}

export interface TransactionRequest {
  to?: string
  from: string
  value?: string
  externalGasLimit?: number
  externalGasPrice?: number
  externalGasTip?: number
  gasLimit?: number
  maxFeePerGas?: number
  maxPriorityFeePerGas?: number
  data?: string
  nonce?: number
  type?: number
}

async function getSigningWallet(from: string) {
  const wallet = await getActiveWallet()
  const activeNetwork = await getActiveNetwork()
  const activeDerivations = wallet.derivations?.find(
    (item) => item.chainCode === Number(activeNetwork.chainCode)
  )
  const activeAddress = activeDerivations?.addresses?.find(
    (item) => item.address === from
  )
  const password = await storage.get("decryption_key")
  const keyfile = await getKeyfileForWallet(wallet.pubkey)

  const hdKey = await decryptHDKey(password, keyfile.keyfile)

  let addressNode = hdKey.derive(activeAddress.path)
  let privKey = addressNode.privateKey

  let fromShard = getShardFromAddress(from)
  let fromChain = activeNetwork.chains.find(
    (item) => item.shard === fromShard[0].shard
  )

  const provider = new quais.providers.JsonRpcProvider(fromChain.rpc)
  const signingWallet = new quais.Wallet(privKey, provider)
  return signingWallet
}

export async function signAndSendTransaction(transaction: TransactionRequest) {
  const wallet = await getActiveWallet()
  const activeNetwork = await getActiveNetwork()
  const activeDerivations = wallet.derivations?.find(
    (item) => item.chainCode === Number(activeNetwork.chainCode)
  )
  const activeAddress = activeDerivations?.addresses?.find(
    (item) => item.address === transaction.from
  )

  if (activeAddress === undefined) {
    throw new Error("Address not found")
  }

  const password = await storage.get("decryption_key")
  const keyfile = await getKeyfileForWallet(wallet.pubkey)

  const hdKey = await decryptHDKey(password, keyfile.keyfile)

  let addressNode = hdKey.derive(activeAddress.path)
  let privKey = addressNode.privateKey

  let fromShard = getShardFromAddress(transaction.from)
  let fromChain = activeNetwork.chains.find(
    (item) => item.shard === fromShard[0].shard
  )

  let toShard = getShardFromAddress(transaction.from)

  const provider = new quais.providers.JsonRpcProvider(fromChain.rpc)
  const signingWallet = new quais.Wallet(privKey, provider)

  console.log(fromShard[0].shard, toShard[0].shard)

  if (fromShard[0].shard !== toShard[0].shard) {
    transaction.type = 2
  }

  const feeData = await provider.getFeeData()

  if (transaction.maxFeePerGas == undefined) {
    transaction.maxFeePerGas = 1
  }
  if (transaction.maxPriorityFeePerGas == undefined) {
    transaction.maxPriorityFeePerGas = 1
  }

  if (transaction.gasLimit === undefined) {
    transaction.gasLimit = 21000
  }

  const rawTransaction = {
    to: transaction.to,
    value: BigInt(Number(transaction.value)),
    nonce: transaction.nonce,
    // gasLimit: BigInt(Number(transaction.gasLimit)),
    maxFeePerGas: BigInt(transaction.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(transaction.maxPriorityFeePerGas),
    gasLimit: BigInt(transaction.gasLimit),
    type: 0,
    externalGasLimit: null,
    externalGasPrice: null,
    externalGasTip: null
  }

  if (fromShard[0].shard != toShard[0].shard) {
    rawTransaction.gasLimit = BigInt(420000)
    rawTransaction.externalGasLimit = BigInt(100000)
    rawTransaction.externalGasPrice = BigInt(Number(feeData.maxFeePerGas) * 2)
    rawTransaction.externalGasTip = BigInt(
      Number(feeData.maxPriorityFeePerGas) * 2
    )
    rawTransaction.type = 2
  }

  const tx = await signingWallet.sendTransaction(rawTransaction)
  return tx
}

export async function sendTokenTransfer(transaction) {
  const signingWallet = await getSigningWallet(transaction.from)

  if (transaction.abi === undefined) {
    transaction.abi = [
      // transfer
      "function transfer(address recipient, uint256 amount) public returns (bool)"
    ]
  }
  const myContract = new quais.Contract(
    transaction.contractAddress,
    transaction.abi,
    signingWallet
  )

  // If your contract requires constructor args, you can specify them here
  const tx = await myContract.transfer(transaction.to, transaction.value, {
    gasLimit: 1000000
  })

  return tx
}

export async function getAddresses() {
  const wallet = await getActiveWallet()
  const activeNetwork = await getActiveNetwork()
  const activeDerivations = wallet.derivations?.find(
    (item) => item.chainCode === Number(activeNetwork.chainCode)
  )
  return activeDerivations.addresses
}

export async function getAddress(address: string) {
  const wallet = await getActiveWallet()
  const activeNetwork = await getActiveNetwork()
  const activeDerivations = wallet.derivations?.find(
    (item) => item.chainCode === Number(activeNetwork.chainCode)
  )
  const requestedAddress = activeDerivations?.addresses?.find(
    (item) => item.address === address
  )
  return requestedAddress
}

export async function personalSignFromAddress(address: string, msg: string) {
  const wallet = await getActiveWallet()
  const activeNetwork = await getActiveNetwork()
  const activeDerivations = wallet.derivations?.find(
    (item) => item.chainCode === Number(activeNetwork.chainCode)
  )
  const activeAddress = activeDerivations?.addresses?.find(
    (item) => item.address === address
  )
  if (activeAddress === undefined) {
    throw new Error("Address not found")
  }

  const password = await storage.get("decryption_key")
  const keyfile = await getKeyfileForWallet(wallet.pubkey)

  const hdKey = await decryptHDKey(password, keyfile.keyfile)

  let addressNode = hdKey.derive(activeAddress.path)
  let privKey = addressNode.privateKey

  const signingWallet = new quais.Wallet(privKey)

  const signature = await signingWallet.signMessage(msg)
  return signature
}
