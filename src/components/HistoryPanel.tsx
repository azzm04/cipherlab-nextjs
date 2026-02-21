"use client";
import { useEffect, useState, useCallback } from "react";
import { getHistory, CipherHistory } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

const CIPHER_STYLES: Record<string, { color: string; bg: string }> = {
  vigenere: { color: "#00ff88", bg: "rgba(0,255,136,0.08)" },
  affine:   { color: "#ffb700", bg: "rgba(255,183,0,0.08)" },
  playfair: { color: "#00d4ff", bg: "rgba(0,212,255,0.08)" },
  hill:     { color: "#c084fc", bg: "rgba(192,132,252,0.08)" },
  enigma:   { color: "#ff4757", bg: "rgba(255,71,87,0.08)" },
};

export default function HistoryPanel() {
  const { t } = useI18n();
  const [history, setHistory] = useState<CipherHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHistory(50);
    setHistory(data);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const i = setInterval(load, 10000); return () => clearInterval(i); }, [load]);

  if (loading && history.length === 0) {
    return (
      <div className="terminal-card rounded-lg p-8 text-center">
        <div className="text-terminal-green text-sm animate-pulse">{t("history.loading")}</div>
      </div>
    );
  }

  if (!loading && history.length === 0) {
    return (
      <div className="terminal-card rounded-lg p-8 text-center space-y-3">
        <div className="text-terminal-dim text-2xl">◈</div>
        <div className="text-terminal-text text-sm font-bold">{t("history.noHistory")}</div>
        <div className="text-xs text-terminal-dim max-w-sm mx-auto">{t("history.noHistoryDesc")}</div>
        <div className="text-xs text-terminal-muted mt-2 border border-terminal-border rounded px-3 py-2 inline-block">{t("history.envHint")}</div>
        <div className="pt-2">
          <button onClick={load} className="btn-terminal text-xs px-4 py-2 rounded border border-terminal-muted text-terminal-dim hover:border-terminal-green hover:text-terminal-green">{t("history.refresh")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-terminal-dim">
        <div>{t("history.showing", { count: history.length })}</div>
        <div className="flex items-center gap-3">
          <span>{t("history.updated")}: {lastRefresh.toLocaleTimeString()}</span>
          <button onClick={load} className="btn-terminal px-3 py-1.5 rounded border border-terminal-muted text-terminal-dim hover:border-terminal-green hover:text-terminal-green">
            {loading ? "..." : t("history.refresh")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[90px_70px_1fr_1fr_130px] gap-3 text-[10px] uppercase tracking-widest text-terminal-dim px-3 py-2 border-b border-terminal-border">
        <div>{t("history.colCipher")}</div><div>{t("history.colOp")}</div>
        <div>{t("history.colPlain")}</div><div>{t("history.colCipher2")}</div><div>{t("history.colTime")}</div>
      </div>
      {history.map((entry) => {
        const style = CIPHER_STYLES[entry.cipher_type] || { color: "#c8c8e8", bg: "transparent" };
        const time = new Date(entry.created_at);
        return (
          <div key={entry.id} className="grid grid-cols-[90px_70px_1fr_1fr_130px] gap-3 items-center px-3 py-2.5 rounded text-xs border border-terminal-border" style={{ background: style.bg }}>
            <div className="font-bold uppercase text-[10px] px-2 py-0.5 rounded text-center" style={{ color: style.color, border: `1px solid ${style.color}40` }}>{entry.cipher_type}</div>
            <div style={{ color: entry.operation === "encrypt" ? "#00ff88" : "#ffb700" }}>{entry.operation === "encrypt" ? t("history.opEnc") : t("history.opDec")}</div>
            <div className="truncate text-terminal-text font-mono" title={entry.plaintext}>{entry.plaintext}</div>
            <div className="truncate font-mono font-bold" style={{ color: style.color }} title={entry.ciphertext}>{entry.ciphertext}</div>
            <div className="text-terminal-dim text-[10px]">{time.toLocaleDateString()} <span className="text-terminal-muted">{time.toLocaleTimeString()}</span></div>
          </div>
        );
      })}
    </div>
  );
}
