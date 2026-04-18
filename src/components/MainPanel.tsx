"use client";

import { useState } from "react";
import { useUISettings } from "@/providers/UISettingsProvider";
import { BridgePanel } from "./BridgePanel";
import { SendPanel } from "./SendPanel";
import { SwapPanel } from "./SwapPanel";

type Tab = "bridge" | "swap" | "send";

export function MainPanel() {
  const [tab, setTab] = useState<Tab>("swap");
  const { copy } = useUISettings();

  const visibleTabs: { id: Exclude<Tab, "send">; label: string }[] = [
    { id: "swap", label: copy.mainPanel.tabs.swap },
    { id: "bridge", label: copy.mainPanel.tabs.bridge },
  ];

  return (
    <div className="card p-3 sm:p-4">
      <div className="flex flex-col gap-4 px-2 pb-4 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-arc-muted">
            {copy.mainPanel.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase text-arc-white">
            {copy.mainPanel.title}
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-arc-border bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-arc-muted">
          <span className="dot-live" />
          {copy.common.arcTestnet}
        </div>
      </div>

      <div className="rounded-[24px] border border-arc-border bg-black/20 p-2">
        <div className="grid grid-cols-2 gap-2">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-[18px] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-all ${
                tab === t.id
                  ? "tab-active"
                  : "border border-transparent text-arc-muted hover:border-arc-border hover:bg-white/5 hover:text-arc-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-arc-border bg-arc-panel/60 p-5 sm:p-6">
        <div className="animate-fade-in">
          {tab === "bridge" && <BridgePanel />}
          {tab === "swap" && <SwapPanel />}
          {tab === "send" && <SendPanel />}
        </div>
      </div>
    </div>
  );
}
