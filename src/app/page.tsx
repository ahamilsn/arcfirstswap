"use client";

import { AddToMetaMask } from "@/components/AddToMetaMask";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MainPanel } from "@/components/MainPanel";
import { StatsBar } from "@/components/StatsBar";
import { useUISettings } from "@/providers/UISettingsProvider";

export default function Home() {
  const { copy, language } = useUISettings();
  const signals = [
    {
      label: language === "zh" ? "\u9886\u6c34" : "Faucet",
      value: "https://faucet.circle.com/",
      href: "https://faucet.circle.com/",
    },
    { label: copy.page.signals.gasToken, value: "USDC" },
    {
      label: copy.page.signals.wallet,
      value: language === "zh" ? "\u652f\u6301 MetaMask \u548c OKX" : "Supports MetaMask and OKX",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-arc-bg text-arc-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10">
        <div className="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-arc-green/12 blur-3xl" />
        <div className="absolute right-[-5%] top-24 h-64 w-64 rounded-full bg-arc-blue/10 blur-3xl" />
      </div>

      <Header />

      <main className="relative flex-1 pb-16">
        <div className="mx-auto max-w-4xl space-y-6 px-5 pt-8">
          <MainPanel />

          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-arc-muted">
                  {copy.page.networkCard}
                </p>
                <p className="mt-2 font-display text-3xl uppercase text-arc-white">
                  {copy.page.networkTitle}
                </p>
              </div>
              <span className="token-tag">ArcFirstSwap</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {signals.map((row) => (
                <div
                  key={row.label}
                  className="rounded-[20px] border border-arc-border bg-black/20 px-4 py-3"
                >
                  <span className="text-[11px] uppercase tracking-[0.16em] text-arc-muted">
                    {row.label}
                  </span>
                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block break-all text-sm font-semibold text-arc-green hover:underline"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-arc-white">{row.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[20px] border border-arc-border bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-arc-muted">{copy.page.rpc}</p>
              <p className="mt-2 break-all font-mono text-sm text-arc-white">rpc.testnet.arc.network</p>
              <a
                href="https://testnet.arcscan.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.12em] text-arc-green hover:underline"
              >
                {copy.page.openExplorer}
              </a>
            </div>

            <div className="mt-4">
              <AddToMetaMask />
            </div>
          </div>

          <StatsBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
