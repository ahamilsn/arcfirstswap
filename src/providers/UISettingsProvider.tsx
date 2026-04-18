"use client";

import type { Locale } from "@rainbow-me/rainbowkit";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "en" | "zh";
export type ThemeMode = "dark" | "light";

interface UIStrings {
  common: {
    connectWallet: string;
    close: string;
    arcTestnet: string;
  };
  header: {
    subtitle: string;
    badge: string;
    switchNetwork: string;
    languageToggle: string;
    switchToLight: string;
    switchToDark: string;
  };
  mainPanel: {
    eyebrow: string;
    title: string;
    tabs: {
      swap: string;
      bridge: string;
      send: string;
    };
  };
  page: {
    networkCard: string;
    networkTitle: string;
    signals: {
      settlement: string;
      settlementValue: string;
      gasToken: string;
      wallet: string;
      walletValue: string;
    };
    rpc: string;
    openExplorer: string;
  };
  stats: {
    live: string;
    network: string;
    block: string;
    finality: string;
    finalityValue: string;
    gas: string;
    evm: string;
    evmValue: string;
  };
  bridge: {
    description: string;
    route: string;
    from: string;
    to: string;
    flip: string;
    amount: string;
    protocol: string;
    receive: string;
    submitting: string;
    submitPrefix: string;
  };
  swap: {
    description: string;
    kitWarning: string;
    youPay: string;
    youReceive: string;
    flipRoute: string;
    slippage: string;
    network: string;
    estimating: string;
    submitting: string;
    submitPrefix: string;
  };
  send: {
    description: string;
    token: string;
    recipient: string;
    invalidAddress: string;
    ownAddress: string;
    validAddress: string;
    amount: string;
    from: string;
    to: string;
    total: string;
    sending: string;
    submitPrefix: string;
  };
  transaction: {
    estimatingFees: string;
    waitingWallet: string;
    approvingToken: string;
    processing: string;
    sent: string;
    failed: string;
  };
  footer: {
    testnetOnly: string;
    docs: string;
    explorer: string;
    appKit: string;
    chainId: string;
  };
  addToMetaMask: string;
}

const strings: Record<Language, UIStrings> = {
  en: {
    common: {
      connectWallet: "Connect Wallet",
      close: "Close",
      arcTestnet: "Arc Testnet",
    },
    header: {
      subtitle: "ARC Swap AND Bridge",
      badge: "Testnet",
      switchNetwork: "Switch to Arc Testnet",
      languageToggle: "中文",
      switchToLight: "Light",
      switchToDark: "Dark",
    },
    mainPanel: {
      eyebrow: "Routing actions",
      title: "ArcFirstSwap console",
      tabs: {
        swap: "Swap",
        bridge: "Bridge",
        send: "Send",
      },
    },
    page: {
      networkCard: "Network card",
      networkTitle: "Arc routing",
      signals: {
        settlement: "Settlement",
        settlementValue: "Sub-second feel",
        gasToken: "Gas token",
        wallet: "Wallet",
        walletValue: "MetaMask ready",
      },
      rpc: "RPC",
      openExplorer: "Open explorer",
    },
    stats: {
      live: "Live",
      network: "Network",
      block: "Block",
      finality: "Finality",
      finalityValue: "< 1s",
      gas: "Gas",
      evm: "EVM",
      evmValue: "Compatible",
    },
    bridge: {
      description: "Cross-chain USDC transfers via",
      route: "Route",
      from: "From",
      to: "To",
      flip: "Flip",
      amount: "Amount",
      protocol: "Protocol",
      receive: "Receive",
      submitting: "Bridging...",
      submitPrefix: "Bridge",
    },
    swap: {
      description: "Same-chain swaps on",
      kitWarning: "Set NEXT_PUBLIC_KIT_KEY for live quotes.",
      youPay: "You pay",
      youReceive: "You receive",
      flipRoute: "Flip route",
      slippage: "Slippage",
      network: "Network",
      estimating: "Estimating...",
      submitting: "Swapping...",
      submitPrefix: "Swap",
    },
    send: {
      description: "Send stablecoins to any wallet on",
      token: "Token",
      recipient: "Recipient address",
      invalidAddress: "Invalid address",
      ownAddress: "Your own address",
      validAddress: "Valid address",
      amount: "Amount",
      from: "From",
      to: "To",
      total: "Total",
      sending: "Sending...",
      submitPrefix: "Send",
    },
    transaction: {
      estimatingFees: "Estimating fees...",
      waitingWallet: "Waiting for wallet...",
      approvingToken: "Approving token...",
      processing: "Processing...",
      sent: "Transaction sent",
      failed: "Failed",
    },
    footer: {
      testnetOnly: "Testnet only",
      docs: "Docs",
      explorer: "Explorer",
      appKit: "App Kit",
      chainId: "Chain ID",
    },
    addToMetaMask: "Add Arc to Wallet",
  },
  zh: {
    common: {
      connectWallet: "连接钱包",
      close: "关闭",
      arcTestnet: "Arc 测试网",
    },
    header: {
      subtitle: "稳定币路由控制台",
      badge: "测试网",
      switchNetwork: "切换到 Arc 测试网",
      languageToggle: "English",
      switchToLight: "浅色",
      switchToDark: "深色",
    },
    mainPanel: {
      eyebrow: "路由操作",
      title: "ArcFirstSwap 控制台",
      tabs: {
        swap: "兑换",
        bridge: "跨链",
        send: "发送",
      },
    },
    page: {
      networkCard: "网络信息",
      networkTitle: "Arc 路由",
      signals: {
        settlement: "结算",
        settlementValue: "亚秒级体验",
        gasToken: "Gas 代币",
        wallet: "钱包",
        walletValue: "支持 MetaMask",
      },
      rpc: "RPC",
      openExplorer: "打开浏览器",
    },
    stats: {
      live: "实时",
      network: "网络",
      block: "区块",
      finality: "终局性",
      finalityValue: "< 1 秒",
      gas: "Gas",
      evm: "EVM",
      evmValue: "兼容",
    },
    bridge: {
      description: "通过",
      route: "路线",
      from: "来源",
      to: "目标",
      flip: "切换",
      amount: "数量",
      protocol: "协议",
      receive: "预计到账",
      submitting: "跨链中...",
      submitPrefix: "跨链",
    },
    swap: {
      description: "在",
      kitWarning: "请设置 NEXT_PUBLIC_KIT_KEY 以获取实时报价。",
      youPay: "支付",
      youReceive: "收到",
      flipRoute: "切换路径",
      slippage: "滑点",
      network: "网络",
      estimating: "估算中...",
      submitting: "兑换中...",
      submitPrefix: "兑换",
    },
    send: {
      description: "向",
      token: "代币",
      recipient: "收款地址",
      invalidAddress: "地址无效",
      ownAddress: "这是你自己的地址",
      validAddress: "地址有效",
      amount: "数量",
      from: "发送方",
      to: "接收方",
      total: "合计",
      sending: "发送中...",
      submitPrefix: "发送",
    },
    transaction: {
      estimatingFees: "正在估算费用...",
      waitingWallet: "等待钱包确认...",
      approvingToken: "正在授权代币...",
      processing: "处理中...",
      sent: "交易已发送",
      failed: "失败",
    },
    footer: {
      testnetOnly: "仅限测试网",
      docs: "文档",
      explorer: "浏览器",
      appKit: "App Kit",
      chainId: "链 ID",
    },
    addToMetaMask: "添加 Arc 到钱包",
  },
};

const LANGUAGE_KEY = "arcfirstswap-language-v2";
const THEME_KEY = "arcfirstswap-theme-v2";

interface UISettingsContextValue {
  language: Language;
  theme: ThemeMode;
  rainbowKitLocale: Locale;
  copy: UIStrings;
  toggleLanguage: () => void;
  toggleTheme: () => void;
}

const UISettingsContext = createContext<UISettingsContextValue | null>(null);

export function UISettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    const storedTheme = window.localStorage.getItem(THEME_KEY);

    if (storedLanguage === "en" || storedLanguage === "zh") {
      setLanguage(storedLanguage);
    }

    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(LANGUAGE_KEY, language);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [language, theme]);

  const value = useMemo<UISettingsContextValue>(
    () => ({
      language,
      theme,
      rainbowKitLocale: language === "zh" ? "zh-CN" : "en",
      copy: strings[language],
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "zh" : "en")),
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [language, theme],
  );

  return <UISettingsContext.Provider value={value}>{children}</UISettingsContext.Provider>;
}

export function useUISettings() {
  const context = useContext(UISettingsContext);

  if (!context) {
    throw new Error("useUISettings must be used within UISettingsProvider.");
  }

  return context;
}
