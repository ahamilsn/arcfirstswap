"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/config/chains";
import { useArcBalances } from "@/hooks/useArcBalances";

const TOKENS = [
  { symbol: "USDC", color: "text-arc-green" },
  { symbol: "EURC", color: "text-arc-white" },
  { symbol: "USYC", color: "text-arc-muted" },
];

export function BalanceCard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { usdcBalance, eurcBalance, usycBalance, refetch } = useArcBalances();

  const balances: Record<string, string> = {
    USDC: usdcBalance,
    EURC: eurcBalance,
    USYC: usycBalance,
  };

  const onArc = chainId === arcTestnet.id;

  return (
    <div className="card flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-arc-muted">
            Wallet overview
          </p>
          <span className="mt-2 block font-display text-3xl uppercase text-arc-white">
            Balances
          </span>
        </div>
        {isConnected && (
          <button onClick={refetch} className="btn-ghost px-4 py-2 text-[11px] uppercase">
            Refresh
          </button>
        )}
      </div>

      {!isConnected ? (
        <p className="air-section py-5 text-center text-xs text-arc-muted">
          Connect wallet to view balances
        </p>
      ) : !onArc ? (
        <div className="air-section flex flex-col gap-3">
          <p className="text-center text-xs text-arc-muted">Switch to Arc Testnet</p>
          <button onClick={() => switchChain({ chainId: arcTestnet.id })} className="btn-primary py-2 text-xs">
            Switch Network
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {TOKENS.map((t) => (
            <div
              key={t.symbol}
              className="rounded-[20px] border border-arc-border bg-black/20 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-arc-muted">{t.symbol}</span>
                <span className={`text-sm font-semibold font-mono ${t.color}`}>
                  {balances[t.symbol]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isConnected && address && (
        <div className="rounded-[20px] border border-arc-border bg-black/20 px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-arc-muted">Address</p>
          <a
            href={`https://testnet.arcscan.app/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block break-all font-mono text-xs text-arc-green hover:underline"
          >
            {address.slice(0, 10)}...{address.slice(-8)}
          </a>
        </div>
      )}

      <a
        href="https://faucet.circle.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost w-full text-[11px] uppercase"
      >
        Get Testnet Tokens
      </a>
    </div>
  );
}
