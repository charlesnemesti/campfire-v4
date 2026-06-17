import { mainnet } from "wagmi/chains";
import type { Address } from "viem";

export const CHAIN = mainnet;

export const CONTRACTS = {
  token: "0x0000000000000000000000000000000000000000" as Address,
  hook: "0x0000000000000000000000000000000000000000" as Address,
  pool: "0x0000000000000000000000000000000000000000" as Address,
} as const;

export const TOKEN = {
  name: "CampfireV4",
  symbol: "CAMPFIRE",
  supply: 1_000_000_000,
  swapFeeBps: 30,
} as const;

export const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address;

export function isContractDeployed(address: Address): boolean {
  return address.toLowerCase() !== ZERO_ADDRESS.toLowerCase();
}
