// Network class contains data about a default or custom network.
export class Network {
  name: string
  chains: ChainData[]
  isCustom: boolean
  chainCode: number
  chainID: number
}

export class ChainData {
  name: string
  shard: string
  blockExplorerUrl: string
  rpc: string
}

export const NETWORK_LIST = []

export const NETWORK_TO_CHAIN_CODE = {
  Colosseum: 994,
  Garden: 994,
  Local: 994
}

export const CHAIN_ID_TO_NETWORK = {
  9000: "Colosseum",
  12000: "Garden",
  1337: "Local"
}

export const NETWORK_TO_CHAIN_ID = {
  Colosseum: 994,
  Garden: 3,
  Local: 1337
}

export const DEFAULT_QUAI_TESNTET = {
  name: "Colosseum",
  chainCode: 994,
  chainID: 9000,
  isCustom: false,
  chains: [
    {
      name: "Prime",
      shard: "prime",
      rpc: "https://rpc.prime.colosseum.quaiscan.io",
      blockExplorerUrl: "https://prime.colosseum.quaiscan.io"
    },
    {
      name: "Cyprus",
      shard: "cyprus",
      rpc: "https://rpc.cyprus.colosseum.quaiscan.io",
      blockExplorerUrl: "https://cyprus.colosseum.quaiscan.io"
    },
    {
      name: "Cyprus One",
      shard: "cyprus-1",
      rpc: "https://rpc.cyprus1.colosseum.quaiscan.io",
      blockExplorerUrl: "https://cyprus1.colosseum.quaiscan.io"
    },
    {
      name: "Cyprus Two",
      shard: "cyprus-2",
      rpc: "https://rpc.cyprus2.colosseum.quaiscan.io",
      blockExplorerUrl: "https://cyprus2.colosseum.quaiscan.io"
    },
    {
      name: "Cyprus Three",
      shard: "cyprus-3",
      rpc: "https://rpc.cyprus3.colosseum.quaiscan.io",
      blockExplorerUrl: "https://cyprus3.colosseum.quaiscan.io"
    },
    {
      name: "Paxos",
      shard: "paxos",
      rpc: "https://rpc.paxos.colosseum.quaiscan.io",
      blockExplorerUrl: "https://paxos.colosseum.quaiscan.io"
    },
    {
      name: "Paxos One",
      shard: "paxos-1",
      rpc: "https://rpc.paxos1.colosseum.quaiscan.io",
      blockExplorerUrl: "https://paxos1.colosseum.quaiscan.io"
    },
    {
      name: "Paxos Two",
      shard: "paxos-2",
      rpc: "https://rpc.paxos2.colosseum.quaiscan.io",
      blockExplorerUrl: "https://paxos2.colosseum.quaiscan.io"
    },
    {
      name: "Paxos Three",
      shard: "paxos-3",
      rpc: "https://rpc.paxos3.colosseum.quaiscan.io",
      blockExplorerUrl: "https://paxos3.colosseum.quaiscan.io"
    },
    {
      name: "Hydra",
      shard: "hydra",
      rpc: "https://rpc.hydra.colosseum.quaiscan.io",
      blockExplorerUrl: "https://hyrda.colosseum.quaiscan.io"
    },
    {
      name: "Hydra One",
      shard: "hydra-1",
      rpc: "https://rpc.hydra1.colosseum.quaiscan.io",
      blockExplorerUrl: "https://hydra1.colosseum.quaiscan.io"
    },
    {
      name: "Hydra Two",
      shard: "hydra-2",
      rpc: "https://rpc.hydra2.colosseum.quaiscan.io",
      blockExplorerUrl: "https://hydra2.colosseum.quaiscan.io"
    },
    {
      name: "Hydra Three",
      shard: "hydra-3",
      rpc: "https://rpc.hydra3.colosseum.quaiscan.io",
      blockExplorerUrl: "https://hydra3.colosseum.quaiscan.io"
    }
  ]
} as Network

export const DEFAULT_QUAI_DEVNET = {
  name: "Garden",
  chainCode: 994,
  chainID: 12000,
  isCustom: false,
  chains: [
    {
      name: "Prime",
      shard: "prime",
      rpc: "https://rpc.prime.garden.quaiscan.io",
      blockExplorerUrl: "https://prime.garden.quaiscan.io"
    },
    {
      name: "Cyprus",
      shard: "cyprus",
      rpc: "https://rpc.cyprus.garden.quaiscan.io",
      blockExplorerUrl: "https://cyprus.garden.quaiscan.io"
    },
    {
      name: "Cyprus One",
      shard: "cyprus-1",
      rpc: "https://rpc.cyprus1.garden.quaiscan.io",
      blockExplorerUrl: "https://cyprus1.garden.quaiscan.io"
    },
    {
      name: "Cyprus Two",
      shard: "cyprus-2",
      rpc: "https://rpc.cyprus2.garden.quaiscan.io",
      blockExplorerUrl: "https://cyprus2.garden.quaiscan.io"
    },
    {
      name: "Cyprus Three",
      shard: "cyprus-3",
      rpc: "https://rpc.cyprus3.garden.quaiscan.io",
      blockExplorerUrl: "https://cyprus3.garden.quaiscan.io"
    },
    {
      name: "Paxos",
      shard: "paxos",
      rpc: "https://rpc.paxos.garden.quaiscan.io",
      blockExplorerUrl: "https://paxos.garden.quaiscan.io"
    },
    {
      name: "Paxos One",
      shard: "paxos-1",
      rpc: "https://rpc.paxos1.garden.quaiscan.io",
      blockExplorerUrl: "https://paxos1.garden.quaiscan.io"
    },
    {
      name: "Paxos Two",
      shard: "paxos-2",
      rpc: "https://rpc.paxos2.garden.quaiscan.io",
      blockExplorerUrl: "https://paxos2.garden.quaiscan.io"
    },
    {
      name: "Paxos Three",
      shard: "paxos-3",
      rpc: "https://rpc.paxos3.garden.quaiscan.io",
      blockExplorerUrl: "https://paxos3.garden.quaiscan.io"
    },
    {
      name: "Hydra",
      shard: "hydra",
      rpc: "https://rpc.hydra.garden.quaiscan.io",
      blockExplorerUrl: "https://hyrda.garden.quaiscan.io"
    },
    {
      name: "Hydra One",
      shard: "hydra-1",
      rpc: "https://rpc.hydra1.garden.quaiscan.io",
      blockExplorerUrl: "https://hydra1.garden.quaiscan.io"
    },
    {
      name: "Hydra Two",
      shard: "hydra-2",
      rpc: "https://rpc.hydra2.garden.quaiscan.io",
      blockExplorerUrl: "https://hydra2.garden.quaiscan.io"
    },
    {
      name: "Hydra Three",
      shard: "hydra-3",
      rpc: "https://rpc.hydra3.garden.quaiscan.io",
      blockExplorerUrl: "https://hydra3.garden.quaiscan.io"
    }
  ]
} as Network

export const DEFAULT_QUAI_LOCAL = {
  name: "Local",
  chainCode: 994,
  chainID: 1337,
  isCustom: false,
  chains: [
    {
      name: "Prime",
      shard: "prime",
      rpc: "http://localhost:8546",
      blockExplorerUrl: "https://dev.prime.quaiscan.io"
    },
    {
      name: "Cyprus",
      shard: "cyprus",
      rpc: "http://localhost:8578",
      blockExplorerUrl: "https://dev.cyprus.quaiscan.io"
    },
    {
      name: "Cyprus One",
      shard: "cyprus-1",
      rpc: "http://localhost:8610",
      blockExplorerUrl: "http://localhost:4002"
    },
    {
      name: "Cyprus Two",
      shard: "cyprus-2",
      rpc: "http://localhost:8542",
      blockExplorerUrl: "https://dev.cyprus2.quaiscan.io"
    },
    {
      name: "Cyprus Three",
      shard: "cyprus-3",
      rpc: "http://localhost:8674",
      blockExplorerUrl: "https://dev.cyprus3.quaiscan.io"
    },
    {
      name: "Paxos",
      shard: "paxos",
      rpc: "http://localhost:8581",
      blockExplorerUrl: "https://dev.paxos.quaiscan.io"
    },
    {
      name: "Paxos One",
      shard: "paxos-1",
      rpc: "http://localhost:8512",
      blockExplorerUrl: "https://dev.paxos1.quaiscan.io"
    },
    {
      name: "Paxos Two",
      shard: "paxos-2",
      rpc: "http://localhost:8544",
      blockExplorerUrl: "https://dev.paxos2.quaiscan.io"
    },
    {
      name: "Paxos Three",
      shard: "paxos-3",
      rpc: "http://localhost:8576",
      blockExplorerUrl: "https://dev.paxos3.quaiscan.io"
    },
    {
      name: "Hydra",
      shard: "hydra",
      rpc: "http://localhost:8582",
      blockExplorerUrl: "https://dev.hydra.quaiscan.io"
    },
    {
      name: "Hydra One",
      shard: "hydra-1",
      rpc: "http://localhost:8614",
      blockExplorerUrl: "https://dev.hydra1.quaiscan.io"
    },
    {
      name: "Hydra Two",
      shard: "hydra-2",
      rpc: "http://localhost:8646",
      blockExplorerUrl: "https://dev.hydra2.quaiscan.io"
    },
    {
      name: "Hydra Three",
      shard: "hydra-3",
      rpc: "http://localhost:8678",
      blockExplorerUrl: "https://dev.hydra3.quaiscan.io"
    }
  ]
} as Network

export const DEFAULT_NETWORKS = [
  DEFAULT_QUAI_TESNTET,
  DEFAULT_QUAI_DEVNET,
  DEFAULT_QUAI_LOCAL
]

export class QuaiContext {
  name: string
  shard: string
  context: number
  byte: string[]
}

export const QUAI_CONTEXTS = [
  {
    name: "Cyprus One",
    shard: "cyprus-1",
    context: 2,
    byte: ["00", "1D"]
  },
  {
    name: "Cyprus Two",
    shard: "cyprus-2",
    context: 2,
    byte: ["1E", "3A"]
  },
  {
    name: "Cyprus Three",
    shard: "cyprus-3",
    context: 2,
    byte: ["3B", "57"]
  },
  {
    name: "Paxos One",
    shard: "paxos-1",
    context: 2,
    byte: ["58", "73"]
  },
  {
    name: "Paxos Two",
    shard: "paxos-2",
    context: 2,
    byte: ["74", "8F"]
  },
  {
    name: "Paxos Three",
    shard: "paxos-3",
    context: 2,
    byte: ["90", "AB"]
  },
  {
    name: "Hydra One",
    shard: "hydra-1",
    context: 2,
    byte: ["AC", "C7"]
  },
  {
    name: "Hydra Two",
    shard: "hydra-2",
    context: 2,
    byte: ["C8", "E3"]
  },
  {
    name: "Hydra Three",
    shard: "hydra-3",
    context: 2,
    byte: ["E4", "FF"]
  }
]

export function getExplorerURLForShard(network: Network, shard: string) {
  let chainData = network.chains.find(
    (chain) => chain.shard === shard
  ) as ChainData
  if (chainData === undefined) {
    return undefined
  }
  return chainData.blockExplorerUrl
}
