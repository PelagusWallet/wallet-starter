import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

export class TokenNetworkData {
  network?: string
  chainID?: number
  name?: string
  symbol: string
  id: number
  shardData?: TokenShardData[]
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

const DEFAULT_TOKENS = [
  {
    name: "Quai",
    symbol: "QUAI",
    decimals: 18,
    type: "native",
    id: 0
  }
]

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

export async function setupDefaultTokens() {
  let tokens = await getTokens()
  if (tokens.length === 0) {
    await storage.set("tokens", DEFAULT_TOKENS)
  } else {
    // for default token that is not in tokens, add it
    for (let i = 0; i < DEFAULT_TOKENS.length; i++) {
      const token = DEFAULT_TOKENS[i]
      if (!tokens.find((t) => t.symbol === token.symbol)) {
        tokens.push(token)
      }
    }
    // remove duplicate tokens
    tokens = tokens.filter(
      (token, index, self) =>
        index === self.findIndex((t) => t.symbol === token.symbol)
    )

    await storage.set("tokens", tokens)
  }
}
