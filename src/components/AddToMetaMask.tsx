"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { arcTestnet } from "@/config/chains";
import { useUISettings } from "@/providers/UISettingsProvider";

type WalletProvider = {
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
  providers?: WalletProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type WalletWindow = Window & {
  ethereum?: WalletProvider;
  okxwallet?: {
    ethereum?: WalletProvider;
  };
};

type ProviderError = Error & {
  code?: number;
};

const ARC_CHAIN_ID_HEX = `0x${arcTestnet.id.toString(16)}`;
const ARC_CHAIN_PARAMS = {
  chainId: ARC_CHAIN_ID_HEX,
  chainName: arcTestnet.name,
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: arcTestnet.rpcUrls.default.http,
  blockExplorerUrls: [arcTestnet.blockExplorers.default.url],
};

export function AddToMetaMask() {
  const { connector } = useAccount();
  const { language } = useUISettings();
  const [feedback, setFeedback] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buttonLabel =
    language === "zh" ? "\u6dfb\u52a0 Arc \u5230\u94b1\u5305" : "Add Arc to Wallet";

  async function getActiveProvider() {
    if (connector) {
      try {
        const provider = (await connector.getProvider()) as WalletProvider | undefined;
        if (provider?.request) return provider;
      } catch {
        // Fall through to injected providers.
      }
    }

    if (typeof window === "undefined") return null;

    const walletWindow = window as WalletWindow;
    const injectedProvider = walletWindow.ethereum;
    const okxProvider = walletWindow.okxwallet?.ethereum;

    if (okxProvider?.request) return okxProvider;

    if (injectedProvider?.providers?.length) {
      const preferredProvider =
        injectedProvider.providers.find((provider: WalletProvider) => provider.isOkxWallet) ??
        injectedProvider.providers.find((provider: WalletProvider) => provider.isMetaMask) ??
        injectedProvider.providers[0];

      if (preferredProvider?.request) return preferredProvider;
    }

    return injectedProvider?.request ? injectedProvider : null;
  }

  async function add() {
    const provider = await getActiveProvider();

    if (!provider) {
      setFeedback({
        type: "error",
        message:
          language === "zh"
            ? "\u672a\u68c0\u6d4b\u5230 MetaMask \u6216 OKX Wallet\uff0c\u8bf7\u5148\u6253\u5f00\u94b1\u5305\u6269\u5c55\u3002"
            : "No compatible wallet was found. Please open MetaMask or OKX Wallet first.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

    try {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARC_CHAIN_ID_HEX }],
        });
      } catch (error) {
        const switchError = error as ProviderError;
        const notAdded =
          switchError.code === 4902 ||
          switchError.message?.toLowerCase().includes("not added") ||
          switchError.message?.toLowerCase().includes("unrecognized chain");

        if (!notAdded) {
          throw switchError;
        }

        await provider.request({
          method: "wallet_addEthereumChain",
          params: [ARC_CHAIN_PARAMS],
        });
      }

      setFeedback({
        type: "success",
        message:
          language === "zh"
            ? "\u5df2\u5411\u94b1\u5305\u53d1\u9001 Arc \u7f51\u7edc\u8bf7\u6c42\u3002"
            : "Arc network request was sent to your wallet.",
      });
    } catch (error) {
      const providerError = error as ProviderError;
      setFeedback({
        type: "error",
        message:
          providerError.message ||
          (language === "zh"
            ? "\u6dfb\u52a0 Arc \u7f51\u7edc\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002"
            : "Failed to add Arc network. Please try again."),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={add}
        disabled={isSubmitting}
        className="btn-ghost w-full text-[11px] uppercase"
      >
        {isSubmitting ? `${buttonLabel}...` : buttonLabel}
      </button>
      {feedback.message && (
        <p
          className={`text-xs ${feedback.type === "error" ? "text-arc-error" : "text-arc-muted"}`}
          aria-live="polite"
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
