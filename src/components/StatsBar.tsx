"use client";

import { useBlockNumber } from "wagmi";
import { arcTestnet } from "@/config/chains";
import { useUISettings } from "@/providers/UISettingsProvider";

export function StatsBar() {
  const { data: block } = useBlockNumber({ chainId: arcTestnet.id, watch: true });
  const { copy } = useUISettings();

  const stats = [
    { label: copy.stats.network, value: copy.common.arcTestnet, tone: "primary" },
    { label: copy.stats.gas, value: "USDC", tone: "accent" },
    { label: copy.stats.finality, value: copy.stats.finalityValue, tone: "accent" },
    { label: copy.stats.block, value: block ? `#${block.toLocaleString()}` : "--", tone: "default" },
    { label: copy.stats.evm, value: copy.stats.evmValue, tone: "default" },
  ];

  return (
    <div className="card overflow-hidden px-4 py-3">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <div className="flex flex-shrink-0 items-center gap-2 rounded-full border border-arc-green/25 bg-black/25 px-4 py-2 shadow-[0_10px_24px_rgba(244,194,55,0.08)]">
          <span className="dot-live" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-arc-green">
            {copy.stats.live}
          </span>
        </div>
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 ${
              s.tone === "primary"
                ? "border-arc-green/35 bg-arc-green/12 px-4 py-2 shadow-[0_12px_30px_rgba(244,194,55,0.1)]"
                : s.tone === "accent"
                  ? "border-arc-border/80 bg-black/25"
                  : "border-arc-border/70 bg-black/10"
            }`}
          >
            <span className="text-[11px] uppercase tracking-[0.12em] text-arc-muted">
              {s.label}
            </span>
            <span
              className={`text-xs font-mono font-semibold ${
                s.tone === "default" ? "text-arc-white" : "text-arc-green"
              }`}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
