/**
 * Controller
 *
 * The network controller is responsible for listening to chain updates, updating balances, and tracking
 * transaction statuses.
 */
import { quais } from "quais"

import { getActiveNetwork } from "~storage/network"
import { TokenNetworkData } from "~storage/token"
import { getTokens } from "~storage/token"
import { Address, getShardFromAddress } from "~storage/wallet"
import type { StoredWallet } from "~storage/wallet"

import type { Network } from "./chains"

/**
 * Address object that contains the BIP-39 index that it was derived at
 */
export class AddressWithData extends Address {
  balance: number
  chainID: number
  shard: string
  nonce?: number
}

// TokenNetworkAddressData is a TokenNetworkData object that contains the addresses that hold the token
export class TokenNetworkAddressData extends TokenNetworkData {
  totalBalance: number
  addresses: AddressWithData[]
}

export class ProviderWithData extends quais.providers.JsonRpcProvider {
  chainID: number
  shard: string
}

export class RPCActivityResult {
  message: string
  result: RPCTransactionResult[]
  status: string
}

export class RPCTransactionResult {
  status: string
  shard: string
  lookupAddress: string
  blockHash: string
  blockNumber: string
  confirmations: string
  contractAddress: string
  cumulativeGasUsed: string
  from: string
  gasUsed: string
  hash: string
  input: string
  isError: string
  nonce: string
  timeStamp: string
  to: string
  transactionIndex: string
  txreceipt_status: string
  value: string
  type: string
}

export default class NetworkController {
  public activeNetwork: Network
  public tokens: TokenNetworkData[]
  public providers: ProviderWithData[]
  public activity: any[]

  /**
   * @param {Object} opts - Options for initializing the controller
   */
  constructor(opts) {
    this.activeNetwork = opts.activeNetwork
    this.tokens = []
    this.providers = []
    this.activity = []
  }

  // This function updates the network controller with the latest addresses and providers
  async updateNetworkController(wallet: StoredWallet) {
    const derivationPath = wallet.derivations.find(
      (derivation) =>
        derivation.chainCode === Number(this.activeNetwork.chainCode)
    )
    if (
      derivationPath == undefined ||
      derivationPath?.addresses?.length === 0
    ) {
      return
    }
    try {
      await this.updateController()
    } catch (e) {
      console.log(e)
    }
  }

  // This function updates the provider lists. It will add new providers if a new address is added.
  // After creating the providers the function will update the balances and fetch the activity upon
  // new block events.
  async updateController() {
    this.activeNetwork = await getActiveNetwork()
    this.providers = []
    this.activeNetwork.chains.forEach((chain) => {
      if (!this.providers.find((provider) => provider.shard === chain.shard)) {
        try {
          let provider = new ProviderWithData(chain.rpc)
          provider.shard = chain.shard
          this.providers.push(provider)
        } catch (e) {
          console.log(e)
        }
      }
    })
    const allTokens = await getTokens()
    this.tokens = allTokens.filter(
      (token) =>
        token.network === this.activeNetwork.name || token.type === "native"
    )
  }

  // This function returns the provider for a given address
  getProviderForAddress(address: string) {
    let provider = this.providers.find(
      (provider) => provider.shard === getShardFromAddress(address)[0].shard
    )
    return provider
  }

  // This function fetches the balance for a single address
  async getBalance(address: string) {
    let provider = this.providers.find(
      (provider) => provider.shard === getShardFromAddress(address)[0].shard
    )
    if (provider) {
      try {
        let res = await provider.getBalance(address)
        return quais.utils.formatEther(res)
      } catch (e) {
        console.log(e)
      }
    }
  }

  async nativeAddressData(address: Address) {
    let shard = getShardFromAddress(address.address)[0].shard
    let provider = this.getProviderForAddress(address.address)
    let balance = "0"
    let nonce = 0
    if (provider) {
      try {
        let res = await provider.getBalance(address.address)
        balance = quais.utils.formatEther(res)
        nonce = await provider.getTransactionCount(address.address)
      } catch (e) {
        console.log(e)
      }
    }

    return {
      ...address,
      balance: Number(balance),
      shard: shard,
      chainID: this.activeNetwork.chainID,
      nonce: nonce
    }
  }

  async tokenAddressData(address: Address, token: TokenNetworkData) {
    let shard = getShardFromAddress(address.address)[0].shard

    let chainData = this.activeNetwork.chains.find((chain) => {
      return chain.shard === shard
    })

    let explorerEndpoint = chainData?.blockExplorerUrl

    // let tokenData = await fetch(
    //   `${explorerEndpoint}/api?module=account&action=tokenbalance&contractaddress=${tokenShardData.address}&address=${address.address}`
    // )

    // let tokenDataJSON = await tokenData.json()
    // // Return if the request was successful
    // if (tokenDataJSON.status === "1") {
    //   addressTokenData.push({
    //     id: token.id,
    //     contractAddressHash: tokenShardData.address,
    //     balance: Number(tokenDataJSON.result)
    //   })
    // }

    return {
      ...address,
      balance: 100,
      shard: shard,
      chainID: this.activeNetwork.chainID
    }
  }

  // This function fetches the balances for all addresses in the wallet
  async getAddressData(addresses: Address[]): Promise<AddressWithData[]> {
    await this.updateController()
    const addressDataPromises = addresses.map(async (address) => {
      try {
        let nativeAddressData = await this.nativeAddressData(address)
        return nativeAddressData
      } catch (e) {
        console.log(e)
      }
    })

    const addressData = await Promise.all(addressDataPromises)
    return addressData
  }

  // This function fetches the activity for all addresses in the wallet
  async fetchActivity(addresses: Address[]) {
    const activityDataPromises = addresses.map(async (address) => {
      try {
        let shard = getShardFromAddress(address.address)[0].shard
        let chainData = this.activeNetwork.chains.find((chain) => {
          return chain.shard === shard
        })

        let explorerEndpoint = chainData?.blockExplorerUrl
        if (explorerEndpoint) {
          let accountActivity = []

          let pendingData = await fetch(
            `${explorerEndpoint}/api?module=account&action=pendingtxlist&address=${address.address}`
          )

          let pendingDataJSON = await pendingData.json()
          // Return if the request was successful
          if (pendingDataJSON.status === "1") {
            // add shard and address to each result
            pendingDataJSON.result.forEach((item) => {
              item.shard = shard
              item.lookupAddress = address.address
              item.status = "pending"
            })

            accountActivity = accountActivity.concat(pendingDataJSON.result)
          }

          let confirmedData = await fetch(
            `${explorerEndpoint}/api?module=account&action=txlist&address=${address.address}`
          )

          let confirmedDataJSON = await confirmedData.json()
          // Return if the request was successful
          if (confirmedDataJSON.status === "1") {
            // add shard and address to each result
            confirmedDataJSON.result.forEach((item) => {
              item.shard = shard
              item.lookupAddress = address.address
              item.status = "confirmed"
            })

            accountActivity = accountActivity.concat(confirmedDataJSON.result)
          }

          return accountActivity
        }
      } catch (e) {
        console.log(e)
      }
    })

    const activityData = await Promise.all(activityDataPromises)
    // Remove undefined values
    let filteredActivityData = activityData.filter((item) => item !== undefined)

    let activity = []
    filteredActivityData.forEach((item) => {
      activity = activity.concat(item)
    })

    // sort pending first and by timestamp second
    activity.sort((a, b) => {
      if (a.status === "pending" && b.status === "confirmed") {
        return -1
      } else if (a.status === "confirmed" && b.status === "pending") {
        return 1
      } else {
        return Number(b.timeStamp) - Number(a.timeStamp)
      }
    })

    // set the type of each activity item
    // remove duplicate hashes and set the duplicates to transfer
    let uniqueActivity = []
    let hashes = []
    activity.forEach((item) => {
      if (!hashes.includes(item.hash)) {
        uniqueActivity.push(item)
        hashes.push(item.hash)
        let send =
          item.lookupAddress.trim().toLowerCase() ===
          item.from.trim().toLowerCase()
        if (send) {
          item.type = "send"
        } else {
          item.type = "receive"
        }
      } else {
        let index = uniqueActivity.findIndex((i) => i.hash === item.hash)
        if (index !== -1) {
          uniqueActivity[index].type = "transfer"
        }
      }
    })

    return uniqueActivity
  }

  async getTokenBalances(
    addresses: Address[]
  ): Promise<TokenNetworkAddressData[]> {
    const tokenBalancesPromises = this.tokens.map(async (token) => {
      const addressDataPromises = addresses.map(async (address) => {
        try {
          if (token.type === "native") {
            let nativeAddressData = await this.nativeAddressData(address)
            return nativeAddressData
          }
          if (token.type === "custom") {
            let tokenAddressData = await this.tokenAddressData(address, token)
            return tokenAddressData
          }
        } catch (e) {
          console.log(e)
        }
      })
      const addressData = await Promise.all(addressDataPromises)

      let totalBalance = 0
      addressData.forEach((address) => {
        totalBalance += address.balance
      })

      return {
        ...token,
        addresses: addressData,
        totalBalance: totalBalance
      }
    })
    const tokenBalances = await Promise.all(tokenBalancesPromises)
    return tokenBalances
  }
}
