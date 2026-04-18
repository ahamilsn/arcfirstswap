"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { TOKEN_ADDRESSES } from "@/config/chains";
import { createAdapter, getAppKit, INITIAL_TX_STATE, type TxState } from "@/lib/appkit";
import { useUISettings } from "@/providers/UISettingsProvider";
import { TransactionStatus } from "./TransactionStatus";

const TOKEN_CONFIG: Record<string, { label: string; sendAs: string }> = {
  USDC: { label: "USD Coin", sendAs: "USDC" },
  EURC: { label: "Euro Coin", sendAs: TOKEN_ADDRESSES.arcTestnet.EURC },
};

export function SendPanel() {
  const { isConnected, address } = useAccount();
  const { copy, language } = useUISettings();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [tx, setTx] = useState<TxState>(INITIAL_TX_STATE);

  const busy = tx.status !== "idle" && tx.status !== "success" && tx.status !== "error";
  const valid = recipient.startsWith("0x") && isAddress(recipient);
  const isSelf = !!address && address.toLowerCase() === recipient.toLowerCase();
  const isZh = language === "zh";

  async function submit() {
    if (!amount || !valid) return;

    try {
      setTx({ status: "pending", message: isZh ? "请在钱包中确认..." : "Confirm in your wallet..." });

      const adapter = await createAdapter();
      const result = await getAppKit().send({
        from: { adapter, chain: "Arc_Testnet" },
        to: recipient,
        amount,
        token: TOKEN_CONFIG[token].sendAs as "USDC",
      });

      setTx({
        status: "success",
        message: isZh
          ? `已发送 ${amount} ${token} 至 ${recipient.slice(0, 6)}...${recipient.slice(-4)}`
          : `Sent ${amount} ${token} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      });
      setAmount("");
      setRecipient("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTx({ status: "error", message: isZh ? "转账失败" : "Transfer failed", error: msg.slice(0, 150) });
    }
  }

  const addrState = !recipient ? "empty" : !valid ? "invalid" : isSelf ? "self" : "ok";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-6 text-arc-muted">
        {copy.send.description} <span className="text-arc-green">{copy.common.arcTestnet}</span>
      </p>

      <div className="air-section">
        <label className="mb-3 block text-[11px] uppercase tracking-[0.16em] text-arc-muted">
          {copy.send.token}
        </label>
        <div className="flex gap-2">
          {Object.keys(TOKEN_CONFIG).map((item) => (
            <button
              key={item}
              onClick={() => setToken(item)}
              disabled={busy}
              className={`flex-1 rounded-[20px] border px-4 py-3 text-left transition-colors disabled:opacity-40 ${
                token === item
                  ? "border-arc-green bg-arc-green-glow text-arc-green"
                  : "border-arc-border text-arc-muted hover:border-arc-dim"
              }`}
            >
              <span className="block text-sm font-semibold uppercase tracking-[0.08em]">{item}</span>
              <span className="mt-1 block text-xs font-normal text-arc-muted">
                {TOKEN_CONFIG[item].label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="air-section">
        <label className="mb-1.5 flex justify-between text-xs">
          <span className="text-arc-muted">{copy.send.recipient}</span>
          {addrState === "invalid" && <span className="text-arc-error">{copy.send.invalidAddress}</span>}
          {addrState === "self" && <span className="text-arc-warning">{copy.send.ownAddress}</span>}
          {addrState === "ok" && <span className="text-arc-green">{copy.send.validAddress}</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={busy}
            className={`arc-input pr-10 font-mono text-sm ${
              addrState === "invalid"
                ? "border-arc-error/50"
                : addrState === "ok"
                  ? "border-arc-green/30"
                  : ""
            }`}
          />
          {recipient && (
            <button
              onClick={() => setRecipient("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-arc-muted hover:text-arc-white"
            >
              x
            </button>
          )}
        </div>
      </div>

      <div className="air-section">
        <label className="mb-1.5 flex justify-between text-xs text-arc-muted">
          <span>{copy.send.amount}</span>
          <span className="text-arc-green">{token}</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={busy}
            className="arc-input pr-20 text-xl font-semibold font-mono"
          />
          <span className="token-tag absolute right-3 top-1/2 -translate-y-1/2">{token}</span>
        </div>
        <div className="mt-3 flex gap-2">
          {["1", "5", "10", "50"].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              disabled={busy}
              className="flex-1 rounded-2xl border border-arc-border bg-transparent py-2 text-xs text-arc-muted transition-colors hover:border-arc-green hover:text-arc-green disabled:opacity-40"
            >
              ${value}
            </button>
          ))}
        </div>
      </div>

      {addrState === "ok" && amount && +amount > 0 && (
        <div className="air-section animate-fade-in text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-arc-muted">{copy.send.from}</span>
            <span className="font-mono text-arc-white">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-arc-muted">{copy.send.to}</span>
            <span className="font-mono text-arc-white">{recipient.slice(0, 8)}...{recipient.slice(-6)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-arc-border pt-2">
            <span className="text-arc-muted">{copy.send.total}</span>
            <span className="font-mono font-semibold text-arc-green">{amount} {token}</span>
          </div>
        </div>
      )}

      <TransactionStatus tx={tx} onClose={() => setTx(INITIAL_TX_STATE)} />

      {!isConnected ? (
        <ConnectButton label={copy.common.connectWallet} />
      ) : (
        <button
          onClick={submit}
          disabled={busy || !amount || +amount <= 0 || addrState !== "ok"}
          className="btn-primary"
        >
          {busy ? copy.send.sending : `${copy.send.submitPrefix} ${amount ? `${amount} ` : ""}${token}`}
        </button>
      )}
    </div>
  );
}
