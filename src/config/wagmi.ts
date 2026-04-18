import { createStorage } from "wagmi";
import { getDefaultConfig, type WalletList } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";
import { arcTestnet, SUPPORTED_CHAINS } from "./chains";
import { sepolia } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "arc-dapp-dev";

const wallets: WalletList = [
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet,
      okxWallet,
    ],
  },
];

export const wagmiConfig = getDefaultConfig({
  appName: "ArcFirstSwap",
  projectId,
  wallets,
  chains: SUPPORTED_CHAINS,
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ key: "arcfirstswap-wagmi-v1" }),
  ssr: true,
});

export { arcTestnet, sepolia };
