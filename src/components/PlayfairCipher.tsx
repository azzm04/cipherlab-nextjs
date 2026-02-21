"use client";
import { useState } from "react";
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix } from "@/lib/ciphers";
import { saveHistory } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import CipherLayout from "./CipherLayout";

export default function PlayfairCipher() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [key, setKey] = useState("KEYWORD");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  let matrix: string[][] = [];
  try { if (key.trim()) matrix = getPlayfairMatrix(key); } catch {}

  async function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error(t("cipher.inputRequired"));
      if (!key.trim()) throw new Error(t("cipher.keyRequired"));
      const out = mode === "encrypt" ? playfairEncrypt(text, key) : playfairDecrypt(text, key);
      setResult(out);
      await saveHistory({
        cipher_type: "playfair",
        operation: mode,
        plaintext: mode === "encrypt" ? text.toUpperCase() : out,
        ciphertext: mode === "encrypt" ? out : text.toUpperCase(),
        key_info: `key=${key.toUpperCase()}`,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <CipherLayout
      name={t("playfair.name")}
      description={t("playfair.description")}
      formula={
        <div className="text-xs space-y-1 text-terminal-dim">
          <div><span className="text-terminal-cyan">{t("playfair.ruleRow")}</span></div>
          <div><span className="text-terminal-cyan">{t("playfair.ruleCol")}</span></div>
          <div><span className="text-terminal-cyan">{t("playfair.ruleRect")}</span></div>
        </div>
      }
    >
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">{t("playfair.keyLabel")}</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g. KEYWORD" className="terminal-input w-full px-3 py-2 rounded text-sm" />
      </div>
      {matrix.length === 5 && (
        <div>
          <div className="text-xs text-terminal-dim uppercase tracking-widest mb-2">{t("playfair.matrixLabel")}</div>
          <div className="inline-grid grid-cols-5 gap-1">
            {matrix.flat().map((cell, i) => (
              <div key={i} className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded" style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.2)", color: "var(--green)" }}>{cell}</div>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">{mode === "encrypt" ? t("cipher.plaintext") : t("cipher.ciphertext")}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
          placeholder={mode === "encrypt" ? t("cipher.enterPlaintext") : t("cipher.enterCiphertext")}
          className="terminal-input w-full px-3 py-2 rounded text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMode("encrypt")} className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "encrypt" ? "border-terminal-green text-terminal-green bg-terminal-green/10" : "border-terminal-muted text-terminal-dim"}`}>{t("cipher.encrypt")}</button>
        <button onClick={() => setMode("decrypt")} className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "decrypt" ? "border-terminal-amber text-terminal-amber bg-terminal-amber/10" : "border-terminal-muted text-terminal-dim"}`}>{t("cipher.decrypt")}</button>
      </div>
      <button onClick={process} className="btn-terminal w-full py-2.5 rounded text-sm font-bold bg-terminal-green text-terminal-bg hover:bg-terminal-green/90">{t("cipher.execute")}</button>
      {error && <div className="text-terminal-red text-xs p-2 border border-terminal-red/40 rounded bg-terminal-red/5">{error}</div>}
      {result && (
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">{t("cipher.output")}</label>
          <div className="terminal-input w-full px-3 py-2 rounded text-sm min-h-[60px] break-all cursor-pointer" onClick={() => navigator.clipboard.writeText(result)} title="Click to copy">
            {result} <span className="text-terminal-dim text-xs ml-2">[{t("cipher.clickToCopy")}]</span>
          </div>
        </div>
      )}
    </CipherLayout>
  );
}
