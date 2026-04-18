import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arc: {
          bg: "rgb(var(--arc-bg) / <alpha-value>)",
          surface: "rgb(var(--arc-surface) / <alpha-value>)",
          card: "rgb(var(--arc-card) / <alpha-value>)",
          panel: "rgb(var(--arc-panel) / <alpha-value>)",
          border: "rgb(var(--arc-border) / <alpha-value>)",
          hover: "rgb(var(--arc-hover) / <alpha-value>)",
          green: "rgb(var(--arc-green) / <alpha-value>)",
          gold: "rgb(var(--arc-green) / <alpha-value>)",
          "green-dim": "rgb(var(--arc-green-dim) / <alpha-value>)",
          "green-glow": "rgb(var(--arc-green) / 0.14)",
          white: "rgb(var(--arc-white) / <alpha-value>)",
          muted: "rgb(var(--arc-muted) / <alpha-value>)",
          dim: "rgb(var(--arc-dim) / <alpha-value>)",
          blue: "rgb(var(--arc-blue) / <alpha-value>)",
          error: "rgb(var(--arc-error) / <alpha-value>)",
          warning: "rgb(var(--arc-warning) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Barlow Condensed", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        green: "0 20px 45px rgba(214,167,47,0.18)",
        card: "0 20px 70px rgba(0,0,0,0.32)",
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-green": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
