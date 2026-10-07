import token from "../config/token.json";
import { isSolanaAddress } from "./solana-address";
export { isSolanaAddress } from "./solana-address";

export function pumpTokenUrl(address: string): string | null {
  return isSolanaAddress(address) ? `https://pump.fun/coin/${address}` : null;
}

// The published address takes precedence over old Vercel environment values.
export const FVF_CA =
  token.mint.trim() || (import.meta.env.VITE_FVF_CA ?? "").trim();
export const FVF_SWAP_URL = pumpTokenUrl(FVF_CA);
