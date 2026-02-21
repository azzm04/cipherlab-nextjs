"use client";
import { useState } from "react";
import { vigenereEncrypt, vigenereDecrypt } from "@/lib/ciphers";
import { saveHistory } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import CipherLayout from "./CipherLayout";

export default function VigenereCipher() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [error, setError] = useState("");

  async function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error(t("cipher.inputRequired"));
      if (!key.trim()) throw new Error(t("cipher.keyRequired"));
      const out = mode === "encrypt" ? vigenereEncrypt(text, key) : vigenereDecrypt(text, key);
      setResult(out);
      await saveHistory({
        cipher_type: "vigenere",
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
      name={t("vigenere.name")}
      description={t("vigenere.description")}
      formula={
        <div className="text-xs space-y-1">
          <div><span className="text-terminal-amber">{t("cipher.encrypt")}:</span> <span className="text-terminal-cyan">C = (P + K) mod 26</span></div>
          <div><span className="text-terminal-amber">{t("cipher.decrypt")}:</span> <span className="text-terminal-cyan">P = (C − K + 26) mod 26</span></div>
          <div className="text-terminal-dim">{t("vigenere.formulaWhere")}</div>
        </div>
      }
    >
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">{t("vigenere.keyLabel")}</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder={t("vigenere.keyPlaceholder")} className="terminal-input w-full px-3 py-2 rounded text-sm" />
      </div>
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
          {mode === "encrypt" ? t("cipher.plaintext") : t("cipher.ciphertext")}
        </label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
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
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
            {mode === "encrypt" ? t("cipher.ciphertext") : t("cipher.plaintext")} {t("cipher.output")}
          </label>
          <div className="terminal-input w-full px-3 py-2 rounded text-sm min-h-[80px] break-all cursor-pointer" onClick={() => navigator.clipboard.writeText(result)} title="Click to copy">
            {result}<span className="text-terminal-dim text-xs ml-2">[{t("cipher.clickToCopy")}]</span>
          </div>
        </div>
      )}
    </CipherLayout>
  );
}
