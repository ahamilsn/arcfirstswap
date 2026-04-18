"use client";

import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useArcBalances } from "@/hooks/useArcBalances";
import { createAdapter, getAppKit, INITIAL_TX_STATE, KIT_KEY, type TxState } from "@/lib/appkit";
import { useUISettings } from "@/providers/UISettingsProvider";
import { PanelConnectButton } from "./PanelConnectButton";
import { TransactionStatus } from "./TransactionStatus";

const TOKENS = ["USDC", "EURC"] as const;
const QUICK_PERCENTAGES = [10, 25, 50, 100] as const;

export function SwapPanel() {
  const { isConnected } = useAccount();
  const { copy, language } = useUISettings();
  const { usdcBalance, eurcBalance } = useArcBalances();
  const [tokenIn, setTokenIn] = useState<(typeof TOKENS)[number]>("USDC");
  const [tokenOut, setTokenOut] = useState<(typeof TOKENS)[number]>("EURC");
  const [amountIn, setAmountIn] = useState("");
  const [estimated, setEstimated] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);
  const estimateRequestRef = useRef(0);

  const busy = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";
  const isZh = language === "zh";
  const optionStyle = {
    background: "rgb(var(--arc-surface))",
    color: "rgb(var(--arc-white))",
  };
  const tokenBalances = {
    USDC: usdcBalance,
    EURC: eurcBalance,
  };
  const selectedBalance = Number.parseFloat(tokenBalances[tokenIn] ?? "0");

  function flip() {
    const nextTokenIn = tokenOut;
    const nextTokenOut = tokenIn;

    setTokenIn(nextTokenIn);
    setTokenOut(nextTokenOut);
    setEstimated(null);

    if (amountIn && +amountIn > 0) {
      void estimateQuote(amountIn, nextTokenIn, nextTokenOut);
    }
  }

  function applyPercentage(percentage: (typeof QUICK_PERCENTAGES)[number]) {
    if (!Number.isFinite(selectedBalance) || selectedBalance <= 0) {
      setAmountIn("");
      setEstimated(null);
      return;
    }

    const nextAmount = ((selectedBalance * percentage) / 100)
      .toFixed(4)
      .replace(/\.?0+$/, "");

    const normalizedAmount = nextAmount === "" ? "0" : nextAmount;

    setAmountIn(normalizedAmount);
    setEstimated(null);
    void estimateQuote(normalizedAmount);
  }

  async function estimateQuote(
    nextAmount: string,
    nextTokenIn = tokenIn,
    nextTokenOut = tokenOut,
  ) {
    if (!nextAmount || +nextAmount <= 0) {
      setEstimated(null);
      setEstimating(false);
      return;
    }

    const requestId = ++estimateRequestRef.current;
    setEstimating(true);

    try {
      const adapter = await createAdapter();
      const result = await getAppKit().estimateSwap({
        from: { adapter, chain: "Arc_Testnet" },
        tokenIn: nextTokenIn,
        tokenOut: nextTokenOut,
        amountIn: nextAmount,
        config: { kitKey: KIT_KEY, slippageBps: 300 },
      });

      if (estimateRequestRef.current === requestId) {
        setEstimated(result.estimatedOutput?.amount ?? null);
      }
    } catch {
      if (estimateRequestRef.current === requestId) {
        setEstimated(null);
      }
    } finally {
      if (estimateRequestRef.current === requestId) {
        setEstimating(false);
      }
    }
  }

  async function submit() {
    if (!amountIn) return;
    try {
      setTx({ status: "estimating", message: isZh ? "正在获取报价..." : "Getting quote..." });
      const adapter = await createAdapter();
      setTx({ status: "pending", message: isZh ? "请在钱包中确认..." : "Confirm in your wallet..." });

      const result = await getAppKit().swap({
        from: { adapter, chain: "Arc_Testnet" },
        tokenIn,
        tokenOut,
        amountIn,
        config: { kitKey: KIT_KEY, slippageBps: 300 },
      });

      setTx({
        status: "success",
        message: isZh
          ? `已完成 ${amountIn} ${tokenIn} 到 ${tokenOut} 的兑换`
          : `Swapped ${amountIn} ${tokenIn} -> ${tokenOut}`,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      });
      setAmountIn("");
      setEstimated(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: isZh ? "兑换失败" : "Swap failed", error: msg.slice(0, 150) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-6 text-arc-muted">
        {copy.swap.description} <span className="text-arc-green">{copy.common.arcTestnet}</span>
        {!KIT_KEY && <span className="ml-1 text-arc-warning">{copy.swap.kitWarning}</span>}
      </p>

      <div className="air-section">
        <label className="mb-1.5 block text-xs text-arc-muted">{copy.swap.youPay}</label>
        <div className="relative">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => {
              setAmountIn(e.target.value);
              setEstimated(null);
            }}
            onBlur={() => void estimateQuote(amountIn)}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={busy}
            className="arc-input pr-28 text-xl font-semibold font-mono"
          />
          <select
            value={tokenIn}
            onChange={(e) => {
              const nextTokenIn = e.target.value as (typeof TOKENS)[number];
              setTokenIn(nextTokenIn);
              setEstimated(null);
              if (amountIn && +amountIn > 0) {
                void estimateQuote(amountIn, nextTokenIn, tokenOut);
              }
            }}
            disabled={busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[14px] border border-arc-border bg-arc-card px-3 py-2 text-sm font-semibold text-arc-green"
          >
            {TOKENS.map((token) => (
              <option key={token} value={token} style={optionStyle}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={flip} disabled={busy} className="btn-ghost px-5">
          {copy.swap.flipRoute}
        </button>
      </div>

      <div className="air-section">
        <label className="mb-1.5 block text-xs text-arc-muted">{copy.swap.youReceive}</label>
        <div className="relative">
          <input
            readOnly
            value={estimating ? copy.swap.estimating : estimated ? `~${(+estimated).toFixed(4)}` : ""}
            placeholder="0.00"
            className="arc-input pr-28 text-xl font-semibold font-mono text-arc-green"
          />
          <select
            value={tokenOut}
            onChange={(e) => {
              const nextTokenOut = e.target.value as (typeof TOKENS)[number];
              setTokenOut(nextTokenOut);
              setEstimated(null);
              if (amountIn && +amountIn > 0) {
                void estimateQuote(amountIn, tokenIn, nextTokenOut);
              }
            }}
            disabled={busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[14px] border border-arc-border bg-arc-card px-3 py-2 text-sm font-semibold text-arc-green"
          >
            {TOKENS.map((token) => (
              <option key={token} value={token} style={optionStyle}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
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

      {amountIn && +amountIn > 0 && (
        <div className="air-section animate-fade-in text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-arc-muted">{copy.swap.slippage}</span>
            <span className="text-arc-white">0.3%</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-arc-muted">{copy.swap.network}</span>
            <span className="text-arc-green">{copy.common.arcTestnet}</span>
          </div>
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <PanelConnectButton />
      ) : (
        <button
          onClick={submit}
          disabled={busy || !amountIn || +amountIn <= 0 || tokenIn === tokenOut}
          className="btn-primary"
        >
          {busy ? copy.swap.submitting : `${copy.swap.submitPrefix} ${tokenIn} -> ${tokenOut}`}
        </button>
      )}
    </div>
  );
}
