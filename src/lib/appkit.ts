import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";

let kitInstance: AppKit | null = null;

export function getAppKit(): AppKit {
  if (!kitInstance) {
    kitInstance = new AppKit();
  }
  return kitInstance;
}

/**
 * Creates a ViemAdapter from the browser's EIP1193 provider (MetaMask, WalletConnect, etc.)
 * Uses createViemAdapterFromProvider — the correct factory per SDK v1.8 docs.
 */
export async function createAdapter() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet detected. Please install MetaMask.");
  }
  return createViemAdapterFromProvider({ provider: window.ethereum });
}

export const KIT_KEY = (process.env.NEXT_PUBLIC_KIT_KEY ?? "").trim();

export type TxStatus =
  | "idle"
  | "estimating"
  | "pending"
  | "approving"
  | "processing"
  | "success"
  | "error";

export interface TxState {
  status: TxStatus;
  message: string;
  txHash?: string;
  explorerUrl?: string;
  error?: string;
}

export const INITIAL_TX_STATE: TxState = { status: "idle", message: "" };
