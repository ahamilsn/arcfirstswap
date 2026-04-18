"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/config/chains";
import { useUISettings } from "@/providers/UISettingsProvider";
import { VertexLogo } from "./VertexLogo";

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 4V2m0 20v-2m8-8h2M2 12h2m12.95 4.95 1.414 1.414M4.636 4.636 6.05 6.05m10.9-1.414L15.536 6.05M4.636 19.364 6.05 17.95M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
      />
    </svg>
  );
}

export function Header() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect, isPending: disconnecting } = useDisconnect();
  const { copy, language, theme, toggleLanguage, toggleTheme } = useUISettings();
  const wrongNetwork = isConnected && chainId !== arcTestnet.id;
  const disconnectLabel = language === "zh" ? "\u65ad\u5f00\u8fde\u63a5" : "Disconnect";

  return (
    <header className="sticky top-0 z-50 border-b border-arc-border/60 bg-arc-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <VertexLogo size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl uppercase tracking-[0.14em] text-arc-white">
              ArcFirstSwap
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-arc-muted">
              {copy.header.subtitle}
            </span>
          </div>
          <span className="rounded-full border border-arc-border bg-black/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-arc-muted">
            {copy.header.badge}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="btn-ghost px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
          >
            <span className="font-mono text-xs text-arc-green">
              {language === "en" ? "EN" : "\u4e2d"}
            </span>
            {copy.header.languageToggle}
          </button>

          <button
            onClick={toggleTheme}
            className="btn-ghost px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            {theme === "dark" ? copy.header.switchToLight : copy.header.switchToDark}
          </button>

          {wrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="hidden items-center gap-2 rounded-full border border-arc-warning/40 bg-arc-warning/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-arc-warning transition-colors hover:bg-arc-warning/15 sm:flex"
            >
              <span className="h-2 w-2 rounded-full bg-arc-warning" />
              {copy.header.switchNetwork}
            </button>
          )}

          <ConnectButton.Custom>
            {({
              account,
              chain,
              mounted,
              authenticationStatus,
              openAccountModal,
              openConnectModal,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                !!account &&
                !!chain &&
                (!authenticationStatus || authenticationStatus === "authenticated");

              return (
                <div
                  aria-hidden={!ready}
                  className={!ready ? "pointer-events-none select-none opacity-0" : undefined}
                >
                  {!connected ? (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="btn-primary min-w-[142px] justify-center whitespace-nowrap px-4 py-2.5 text-xs"
                    >
                      {copy.common.connectWallet}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openAccountModal}
                      className="btn-ghost min-w-[168px] justify-center px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
                    >
                      {account.displayName}
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {isConnected && (
            <button
              onClick={() => disconnect()}
              disabled={disconnecting}
              className="btn-ghost px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
            >
              {disconnecting ? `${disconnectLabel}...` : disconnectLabel}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
