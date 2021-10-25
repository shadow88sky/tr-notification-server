// all
// debank
export enum ChainEnum {
  eth = 1,
  matic = 137,
  polygon = 137,
  bsc = 56,
  ftm = 250, // Fantom
  xdai = 100,
  okt = 66,
  heco = 128,
  avax = 43114,
  op = 10, // Optimistic Ethereum
  arb = 42161, // Arbitrum
  celo = 42220, // Celo
}

export const BalanceFromType = {
  debank: 'debank',
  bitquery: 'bitquery',
};

// BitQuery
export enum BitQueryChainEnum {
  eth = 1,
  matic = 137,
  polygon = 137,
  bsc = 56,
  ftm = 250, // Fantom
  xdai = 100,
  okt = 66,
  heco = 128,
  avax = 43114,
  op = 10, // Optimistic Ethereum
  arb = 42161, // Arbitrum
  celo = 42220, // Celo
}

export const BitQueryChain = {
  eth: 'ethereum',
  bsc: 'bsc',
  polygon: 'matic',
  matic: 'matic',
};

export const EthereumContractAddress =
  '0x0000000000000000000000000000000000000000';

  