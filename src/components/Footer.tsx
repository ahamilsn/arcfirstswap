"use client";

import { useUISettings } from "@/providers/UISettingsProvider";
import { VertexLogo } from "./VertexLogo";

export function Footer() {
  const { copy } = useUISettings();

  return (
    <footer className="mt-14 border-t border-arc-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <VertexLogo size={20} />
          <div className="flex flex-col">
            <span className="font-display text-xl uppercase tracking-[0.14em] text-arc-white">
              ArcFirstSwap
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-arc-muted">
              {copy.footer.testnetOnly}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-arc-muted">
          <a href="https://docs.arc.network" target="_blank" rel="noopener noreferrer" className="hover:text-arc-green transition-colors">
            {copy.footer.docs}
          </a>
          <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer" className="hover:text-arc-green transition-colors">
            {copy.footer.explorer}
          </a>
          <a href="https://docs.arc.network/app-kit" target="_blank" rel="noopener noreferrer" className="hover:text-arc-green transition-colors">
            {copy.footer.appKit}
          </a>
          <span className="rounded-full border border-arc-border bg-black/20 px-3 py-1">
            {copy.footer.chainId}: 5042002
          </span>
        </div>
      </div>
    </footer>
  );
}
