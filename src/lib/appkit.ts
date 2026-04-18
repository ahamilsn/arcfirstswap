import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";

let kitInstance: AppKit | null = null;

type ProviderLike = Parameters<typeof createViemAdapterFromProvider>[0]["provider"];

type ConnectorLike = {
  getProvider: () => Promise<unknown>;
};

export function getAppKit(): AppKit {
  if (!kitInstance) {
    kitInstance = new AppKit();
  }
  return kitInstance;
}

function isProviderLike(value: unknown): value is ProviderLike {
  return (
    !!value &&
    typeof value === "object" &&
    "request" in value &&
    "on" in value &&
    "removeListener" in value
  );
}

export async function createAdapter(connector?: ConnectorLike | null) {
  let provider: ProviderLike | null = null;

  if (connector) {
    try {
      const connectorProvider = await connector.getProvider();
      if (isProviderLike(connectorProvider)) {
        provider = connectorProvider;
      }
    } catch {
      // Fall back to the injected provider below.
    }
  }

  if (!provider && typeof window !== "undefined" && isProviderLike(window.ethereum)) {
    provider = window.ethereum;
  }

  if (!provider) {
    throw new Error("No compatible wallet provider was found.");
  }

  return createViemAdapterFromProvider({ provider });
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
