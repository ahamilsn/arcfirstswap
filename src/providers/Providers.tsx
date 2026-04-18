"use client";

import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/config/wagmi";
import { UISettingsProvider, useUISettings } from "@/providers/UISettingsProvider";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const darkGoldTheme = darkTheme({
  accentColor: "#f4c237",
  accentColorForeground: "#16120a",
  borderRadius: "large",
  fontStack: "system",
  overlayBlur: "small",
});

const lightGoldTheme = lightTheme({
  accentColor: "#c28d17",
  accentColorForeground: "#fff8eb",
  borderRadius: "large",
  fontStack: "system",
  overlayBlur: "small",
});

function ThemedRainbowKit({ children }: { children: React.ReactNode }) {
  const { rainbowKitLocale, theme } = useUISettings();

  return (
    <RainbowKitProvider
      theme={theme === "light" ? lightGoldTheme : darkGoldTheme}
      modalSize="compact"
      locale={rainbowKitLocale}
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <UISettingsProvider>
          <ThemedRainbowKit>{children}</ThemedRainbowKit>
        </UISettingsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
