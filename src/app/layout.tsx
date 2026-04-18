import type { Metadata } from "next";
import { FetchInterceptor } from "@/components/FetchInterceptor";
import { Providers } from "@/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcFirstSwap | Testnet",
  description:
    "ArcFirstSwap - Bridge, swap, and send stablecoins on the Arc L1 blockchain.",
  keywords: ["ArcFirstSwap", "Arc", "L1", "blockchain", "USDC", "bridge", "swap", "DeFi"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ArcFirstSwap | Testnet",
    description: "Bridge, swap, and send stablecoins on ArcFirstSwap Testnet",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <body>
        <FetchInterceptor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
