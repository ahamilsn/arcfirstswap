"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function HeroSection() {
  const { isConnected } = useAccount();

  const highlights = [
    { label: "Primary flow", value: "Bridge / Swap / Send" },
    { label: "Settlement", value: "Arc Testnet" },
    { label: "Visual tone", value: "Dark + warm gold" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="card relative overflow-hidden p-7 sm:p-9">
          <div className="pointer-events-none absolute right-[-72px] top-[-72px] h-44 w-44 rounded-full bg-arc-green/12 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-96px] left-[-36px] h-52 w-52 rounded-full bg-arc-blue/10 blur-3xl" />

          <div className="relative">
            <p className="inline-flex rounded-full border border-arc-border bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-arc-green">
              ArcFirstSwap testnet
            </p>

            <h1 className="mt-5 max-w-3xl font-display text-5xl uppercase leading-[0.9] text-arc-white sm:text-6xl">
              Cross-chain stablecoin routes
              <span className="mt-2 block text-arc-green">with a cleaner console</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-arc-muted sm:text-base">
              Bridge, swap, and send on Arc Testnet through an ArcFirstSwap surface tuned
              for calmer hierarchy, richer cards, and wallet-first actions.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="token-tag">Intent-ready UI</span>
              <span className="token-tag">Arc-native stablecoins</span>
              <span className="token-tag">Premium dark theme</span>
            </div>
          </div>
        </div>

        <div className="card flex flex-col gap-4 p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-arc-muted">
              Surface highlights
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase text-arc-white">
              ArcFirstSwap deck
            </h2>
          </div>

          <div className="space-y-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-arc-border bg-black/20 px-4 py-3"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-arc-muted">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-2xl uppercase text-arc-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {!isConnected && (
            <div className="pt-1">
              <ConnectButton label="Connect Wallet" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
