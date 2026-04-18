"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUISettings } from "@/providers/UISettingsProvider";

export function PanelConnectButton() {
  const { copy } = useUISettings();

  return (
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
            className={!ready ? "pointer-events-none w-full select-none opacity-0" : "w-full"}
          >
            {!connected ? (
              <button
                type="button"
                onClick={openConnectModal}
                className="btn-primary w-full justify-center px-6 py-3.5 text-sm"
              >
                {copy.common.connectWallet}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAccountModal}
                className="btn-ghost w-full justify-center px-4 py-3 text-[11px] uppercase tracking-[0.16em]"
              >
                {account.displayName}
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
