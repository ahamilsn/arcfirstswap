"use client";

import type { TxState } from "@/lib/appkit";
import { useUISettings } from "@/providers/UISettingsProvider";

interface Props {
  tx: TxState;
  onClose?: () => void;
}

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4Z" />
  </svg>
);

export function TransactionStatus({ tx, onClose }: Props) {
  const { copy } = useUISettings();

  if (tx.status === "idle") return null;

  const config: Record<string, { label: string; color: string; bg: string }> = {
    estimating: { label: copy.transaction.estimatingFees, color: "text-arc-green", bg: "border-arc-border bg-black/20" },
    pending: { label: copy.transaction.waitingWallet, color: "text-arc-green", bg: "border-arc-border bg-black/20" },
    approving: { label: copy.transaction.approvingToken, color: "text-arc-warning", bg: "border-arc-border bg-black/20" },
    processing: { label: copy.transaction.processing, color: "text-arc-green", bg: "border-arc-border bg-black/20" },
    success: { label: copy.transaction.sent, color: "text-arc-green", bg: "border-arc-green/20 bg-arc-green/5" },
    error: { label: copy.transaction.failed, color: "text-arc-error", bg: "border-arc-error/25 bg-arc-error/5" },
  };

  const current = config[tx.status];
  if (!current) return null;

  const isDone = tx.status === "success" || tx.status === "error";
  const isSpinning = !isDone;

  return (
    <div className={`animate-slide-up flex items-start gap-3 rounded-[22px] border p-4 text-sm ${current.bg}`}>
      <span className={current.color}>
        {isSpinning ? (
          <Spinner />
        ) : tx.status === "success" ? (
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className={`font-semibold uppercase tracking-[0.08em] ${current.color}`}>{current.label}</p>
        {tx.message && <p className="mt-1 text-xs text-arc-muted">{tx.message}</p>}
        {tx.txHash && (
          <a
            href={tx.explorerUrl ?? `https://testnet.arcscan.app/tx/${tx.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-mono text-xs text-arc-green hover:underline"
          >
            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
          </a>
        )}
        {tx.error && (
          <p className="mt-2 break-all font-mono text-xs text-arc-error">{tx.error}</p>
        )}
      </div>

      {isDone && onClose && (
        <button
          onClick={onClose}
          aria-label={copy.common.close}
          className="flex-shrink-0 text-arc-muted hover:text-arc-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
