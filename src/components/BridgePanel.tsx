"use client";

import type { BridgeResult } from "@circle-fin/app-kit";
import {
  ArcTestnet as CircleArcTestnet,
  ArbitrumSepolia as CircleArbitrumSepolia,
  BaseSepolia as CircleBaseSepolia,
  EthereumSepolia as CircleEthereumSepolia,
  OptimismSepolia as CircleOptimismSepolia,
} from "@circle-fin/app-kit/chains";
import { CCTPV2BridgingProvider } from "@circle-fin/provider-cctp-v2";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import {
  arcTestnet,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
  TOKEN_ADDRESSES,
} from "@/config/chains";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { createAdapter, getAppKit, INITIAL_TX_STATE, type TxState } from "@/lib/appkit";
import { useUISettings } from "@/providers/UISettingsProvider";
import { PanelConnectButton } from "./PanelConnectButton";
import { TransactionStatus } from "./TransactionStatus";

const CHAINS = [
  { id: "Arc_Testnet", label: "Arc Testnet" },
  { id: "Ethereum_Sepolia", label: "Ethereum Sepolia" },
  { id: "Base_Sepolia", label: "Base Sepolia" },
  { id: "Optimism_Sepolia", label: "Optimism Sepolia" },
  { id: "Arbitrum_Sepolia", label: "Arbitrum Sepolia" },
] as const;

type BridgeChainId =
  | "Arc_Testnet"
  | "Ethereum_Sepolia"
  | "Base_Sepolia"
  | "Optimism_Sepolia"
  | "Arbitrum_Sepolia";

const QUICK_PERCENTAGES = [10, 25, 50, 100] as const;

const BRIDGE_BALANCE_CONFIG: Record<
  BridgeChainId,
  { chainId: number; tokenAddress: `0x${string}` }
> = {
  Arc_Testnet: {
    chainId: arcTestnet.id,
    tokenAddress: TOKEN_ADDRESSES.arcTestnet.USDC,
  },
  Ethereum_Sepolia: {
    chainId: sepolia.id,
    tokenAddress: TOKEN_ADDRESSES.sepolia.USDC,
  },
  Base_Sepolia: {
    chainId: baseSepolia.id,
    tokenAddress: TOKEN_ADDRESSES.baseSepolia.USDC,
  },
  Optimism_Sepolia: {
    chainId: optimismSepolia.id,
    tokenAddress: TOKEN_ADDRESSES.optimismSepolia.USDC,
  },
  Arbitrum_Sepolia: {
    chainId: arbitrumSepolia.id,
    tokenAddress: TOKEN_ADDRESSES.arbitrumSepolia.USDC,
  },
};

const BRIDGE_PROVIDER_CHAINS = {
  Arc_Testnet: CircleArcTestnet,
  Ethereum_Sepolia: CircleEthereumSepolia,
  Base_Sepolia: CircleBaseSepolia,
  Optimism_Sepolia: CircleOptimismSepolia,
  Arbitrum_Sepolia: CircleArbitrumSepolia,
} as const;

function getExplorerUrl(template: string, txHash: string) {
  return template.replace("{hash}", txHash);
}

export function BridgePanel() {
  const { isConnected, connector, address } = useAccount();
  const { copy, language } = useUISettings();
  const [from, setFrom] = useState<BridgeChainId>("Ethereum_Sepolia");
  const [to, setTo] = useState<BridgeChainId>("Arc_Testnet");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);

  const sourceTokenConfig = BRIDGE_BALANCE_CONFIG[from];
  const {
    balance: sourceBalance,
    isLoading: sourceBalanceLoading,
    refetch: refetchSourceBalance,
  } = useTokenBalance({
    chainId: sourceTokenConfig.chainId,
    tokenAddress: sourceTokenConfig.tokenAddress,
    decimals: 6,
  });

  const busy = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";
  const isZh = language === "zh";
  const selectedBalance = Number.parseFloat(sourceBalance ?? "0");
  const walletBalanceLabel = isZh ? "\u94b1\u5305\u4f59\u989d" : "Wallet balance";
  const loadingBalanceLabel = isZh ? "\u8bfb\u53d6\u4e2d..." : "Loading...";
  const exceedsBalanceLabel = isZh
    ? "\u8f93\u5165\u91d1\u989d\u5df2\u8d85\u51fa\u94b1\u5305\u4f59\u989d"
    : "Amount exceeds your wallet balance";
  const optionStyle = {
    background: "rgb(var(--arc-surface))",
    color: "rgb(var(--arc-white))",
  };
  const numericAmount = Number.parseFloat(amount || "0");
  const exceedsBalance =
    amount !== "" && Number.isFinite(numericAmount) && numericAmount > selectedBalance;

  useEffect(() => {
    if (tx.status !== "success" && tx.status !== "error") {
      return;
    }

    if (tx.status === "success") {
      void refetchSourceBalance();
      const refreshTimer = window.setTimeout(() => {
        void refetchSourceBalance();
      }, 2500);

      const resetTimer = window.setTimeout(() => {
        setTx(INITIAL_TX_STATE);
      }, 7000);

      return () => {
        window.clearTimeout(refreshTimer);
        window.clearTimeout(resetTimer);
      };
    }

    const resetTimer = window.setTimeout(() => {
      setTx(INITIAL_TX_STATE);
    }, 7000);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [refetchSourceBalance, tx.status]);

  function flip() {
    setFrom(to);
    setTo(from);
  }

  function applyPercentage(percentage: (typeof QUICK_PERCENTAGES)[number]) {
    if (!Number.isFinite(selectedBalance) || selectedBalance <= 0) {
      setAmount("");
      return;
    }

    const nextAmount = ((selectedBalance * percentage) / 100)
      .toFixed(4)
      .replace(/\.?0+$/, "");

    setAmount(nextAmount === "" ? "0" : nextAmount);
  }

  async function submit() {
    if (!amount || !address) return;

    const kit = getAppKit();
    const adapter = await createAdapter(connector);
    const sourceChain = BRIDGE_PROVIDER_CHAINS[from];
    const destinationChain = BRIDGE_PROVIDER_CHAINS[to];
    const sourceWallet = { adapter, address, chain: sourceChain };
    const destinationWallet = { adapter, address, chain: destinationChain };
    const provider = new CCTPV2BridgingProvider();

    const onApprove = () =>
      setTx({
        status: "approving",
        message: isZh ? "\u6b63\u5728\u6388\u6743 USDC \u8f6c\u8d26..." : "Approving USDC transfer...",
      });
    const onBurn = () =>
      setTx({
        status: "processing",
        message: isZh ? "\u6b63\u5728\u6e90\u94fe\u4e0a\u9500\u6bc1..." : "Burning on source chain...",
      });
    const onAttestation = () =>
      setTx({
        status: "processing",
        message: isZh ? "\u7b49\u5f85 Circle \u8bc1\u660e..." : "Waiting for Circle attestation...",
      });
    const onMint = () =>
      setTx({
        status: "processing",
        message: isZh ? "\u6b63\u5728\u76ee\u6807\u94fe\u4e0a\u94f8\u9020..." : "Minting on destination chain...",
      });

    kit.on("bridge.approve", onApprove);
    kit.on("bridge.burn", onBurn);
    kit.on("bridge.fetchAttestation", onAttestation);
    kit.on("bridge.mint", onMint);

    try {
      setTx({
        status: "pending",
        message: isZh ? "\u8bf7\u5728\u94b1\u5305\u4e2d\u786e\u8ba4..." : "Confirm in your wallet...",
      });

      let txHash: string | undefined;
      let explorerUrl: string | undefined;

      if (from === "Ethereum_Sepolia") {
        const amountUnits = parseUnits(amount, 6);
        const bridgeSpender = sourceChain.kitContracts?.bridge;
        const sourceUsdcAddress = sourceChain.usdcAddress;

        if (!bridgeSpender || !sourceUsdcAddress) {
          throw new Error("Bridge spender contract is not configured for Ethereum Sepolia.");
        }

        const allowanceRequest = await adapter.prepareAction(
          "token.allowance",
          {
            tokenAddress: sourceUsdcAddress,
            delegate: bridgeSpender,
            walletAddress: address,
          },
          { chain: sourceChain },
        );
        const currentAllowance = BigInt(await allowanceRequest.execute());

        if (currentAllowance < amountUnits) {
          setTx({
            status: "approving",
            message: isZh
              ? "\u6b63\u5728\u6388\u6743 USDC \u7ed9\u6865\u63a5\u5408\u7ea6..."
              : "Approving USDC for the bridge contract...",
          });

          const approveRequest = await adapter.prepareAction(
            "token.approve",
            {
              tokenAddress: sourceUsdcAddress,
              delegate: bridgeSpender,
              amount: amountUnits,
            },
            { chain: sourceChain },
          );
          const approveTxHash = await approveRequest.execute();
          await provider.waitForTransaction(adapter, approveTxHash, sourceChain);
        }

        setTx({
          status: "processing",
          message: isZh ? "\u6b63\u5728\u6e90\u94fe\u4e0a\u9500\u6bc1..." : "Burning on source chain...",
        });

        const burnRequest = await provider.burn({
          source: sourceWallet,
          destination: destinationWallet,
          amount: amountUnits.toString(),
          token: "USDC",
          config: {
            transferSpeed: "FAST",
          },
        });
        const burnTxHash = await burnRequest.execute();
        await provider.waitForTransaction(adapter, burnTxHash, sourceChain);

        setTx({
          status: "processing",
          message: isZh ? "\u7b49\u5f85 Circle \u8bc1\u660e..." : "Waiting for Circle attestation...",
        });
        const attestation = await provider.fetchAttestation(sourceWallet, burnTxHash);

        setTx({
          status: "processing",
          message: isZh ? "\u6b63\u5728\u76ee\u6807\u94fe\u4e0a\u94f8\u9020..." : "Minting on destination chain...",
        });

        const mintRequest = await provider.mint(sourceWallet, destinationWallet, attestation);
        const mintTxHash = await mintRequest.execute();
        await provider.waitForTransaction(adapter, mintTxHash, destinationChain);

        txHash = mintTxHash;
        explorerUrl = getExplorerUrl(destinationChain.explorerUrl, mintTxHash);
      } else {
        const result: BridgeResult = await kit.bridge({
          from: { adapter, chain: from },
          to: { adapter, chain: to },
          amount,
          config: {
            batchTransactions: false,
          },
        });

        const last = result.steps?.[result.steps.length - 1];
        txHash = last?.txHash;
        explorerUrl = last?.explorerUrl;
      }

      setTx({
        status: "success",
        message: isZh
          ? `\u5df2\u6210\u529f\u8de8\u94fe ${amount} USDC`
          : `Bridged ${amount} USDC successfully`,
        txHash,
        explorerUrl,
      });
      setAmount("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({
        status: "error",
        message: isZh ? "\u8de8\u94fe\u5931\u8d25" : "Bridge failed",
        error: msg.slice(0, 150),
      });
    } finally {
      kit.off("bridge.approve", onApprove);
      kit.off("bridge.burn", onBurn);
      kit.off("bridge.fetchAttestation", onAttestation);
      kit.off("bridge.mint", onMint);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-6 text-arc-muted">
        {copy.bridge.description} <span className="text-arc-green">Circle CCTP v2</span>
      </p>

      <div className="air-section">
        <label className="mb-3 block text-[11px] uppercase tracking-[0.16em] text-arc-muted">
          {copy.bridge.route}
        </label>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-arc-muted">{copy.bridge.from}</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value as BridgeChainId)}
              disabled={busy}
              className="arc-input text-sm"
            >
              {CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id} style={optionStyle}>
                  {chain.label}
                </option>
              ))}
            </select>
          </div>

          <button onClick={flip} disabled={busy} className="btn-ghost mb-0 px-4 py-3">
            {copy.bridge.flip}
          </button>

          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-arc-muted">{copy.bridge.to}</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value as BridgeChainId)}
              disabled={busy}
              className="arc-input text-sm"
            >
              {CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id} style={optionStyle}>
                  {chain.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="air-section">
        <label className="mb-1.5 flex justify-between text-xs text-arc-muted">
          <span>{copy.bridge.amount}</span>
          <span className="font-mono text-[11px] text-arc-green">
            {isConnected
              ? `${walletBalanceLabel}: ${sourceBalanceLoading ? loadingBalanceLabel : sourceBalance} USDC`
              : "USDC"}
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={busy}
            className="arc-input pr-20 text-xl font-semibold font-mono"
          />
          <span className="token-tag absolute right-3 top-1/2 -translate-y-1/2">USDC</span>
        </div>
        {exceedsBalance && <p className="mt-2 text-xs text-arc-error">{exceedsBalanceLabel}</p>}
        <div className="mt-3 flex gap-2">
          {QUICK_PERCENTAGES.map((value) => (
            <button
              key={value}
              onClick={() => applyPercentage(value)}
              disabled={busy || !isConnected || selectedBalance <= 0}
              className="flex-1 rounded-2xl border border-arc-border bg-transparent py-2 text-xs text-arc-muted transition-colors hover:border-arc-green hover:text-arc-green disabled:opacity-40"
            >
              {value}%
            </button>
          ))}
        </div>
      </div>

      {amount && +amount > 0 && (
        <div className="air-section animate-fade-in text-xs">
          <Row
            label={copy.bridge.route}
            value={`${CHAINS.find((chain) => chain.id === from)?.label} -> ${CHAINS.find((chain) => chain.id === to)?.label}`}
          />
          <Row label={copy.bridge.protocol} value="Circle CCTP v2" green />
          <Row label={copy.bridge.receive} value={`~${amount} USDC`} green />
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <PanelConnectButton />
      ) : (
        <button
          onClick={submit}
          disabled={busy || !amount || +amount <= 0 || exceedsBalance}
          className="btn-primary"
        >
          {busy ? copy.bridge.submitting : `${copy.bridge.submitPrefix} ${amount ? `${amount} ` : ""}USDC`}
        </button>
      )}
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-arc-muted">{label}</span>
      <span className={`font-medium ${green ? "text-arc-green" : "text-arc-white"}`}>{value}</span>
    </div>
  );
}
