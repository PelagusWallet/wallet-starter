import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

export class TokenNetworkData {
  network: string
  chainID: number
  name?: string
  symbol: string
  id: number
  shardData: TokenShardData[]
  decimals: number
  type?: string
}

export class TokenShardData {
  name: string
  symbol: string
  shard: string
  address: string
  decimals?: number
  type?: string
}

export async function addToken(token: TokenNetworkData) {
  let tokens = await getTokens()
  tokens.push(token)

  await storage.set("tokens", tokens)
}

export async function getTokens() {
  let tokens: TokenNetworkData[] = await storage.get("tokens")

  return tokens || []
}

export async function getToken(tokenID: number) {
  let tokens = await getTokens()

  return tokens.find((token) => token.id === tokenID)
}
