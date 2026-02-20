"use client";

import { useState } from "react";
import { vigenereEncrypt, vigenereDecrypt } from "@/lib/ciphers";
import CipherLayout from "./CipherLayout";

export default function VigenereCipher() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [error, setError] = useState("");

  function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error("Input text is required");
      if (!key.trim()) throw new Error("Key is required");
      const out = mode === "encrypt" ? vigenereEncrypt(text, key) : vigenereDecrypt(text, key);
      setResult(out);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <CipherLayout
      name="Vigenere Cipher"
      description="A polyalphabetic substitution cipher that uses a keyword to shift each letter. Each letter of the key determines a different Caesar shift."
      formula={
        <div className="text-xs space-y-1">
          <div><span className="text-terminal-amber">Encrypt:</span> <span className="text-terminal-cyan">C = (P + K) mod 26</span></div>
          <div><span className="text-terminal-amber">Decrypt:</span> <span className="text-terminal-cyan">P = (C − K + 26) mod 26</span></div>
          <div className="text-terminal-dim">where K = key character index</div>
        </div>
      }
    >
      {/* Key Input */}
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
          Key (letters only)
        </label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g. SECRET"
          className="terminal-input w-full px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
          {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder={mode === "encrypt" ? "Enter plaintext..." : "Enter ciphertext..."}
          className="terminal-input w-full px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Mode & Run */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encrypt")}
          className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "encrypt" ? "border-terminal-green text-terminal-green bg-terminal-green/10" : "border-terminal-muted text-terminal-dim"}`}
        >
          ENCRYPT
        </button>
        <button
          onClick={() => setMode("decrypt")}
          className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "decrypt" ? "border-terminal-amber text-terminal-amber bg-terminal-amber/10" : "border-terminal-muted text-terminal-dim"}`}
        >
          DECRYPT
        </button>
      </div>

      <button
        onClick={process}
        className="btn-terminal w-full py-2.5 rounded text-sm font-bold bg-terminal-green text-terminal-bg hover:bg-terminal-green/90"
      >
        ▶ EXECUTE
      </button>

      {error && <div className="text-terminal-red text-xs p-2 border border-terminal-red/40 rounded bg-terminal-red/5">{error}</div>}

      {result && (
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
            {mode === "encrypt" ? "Ciphertext" : "Plaintext"} Output
          </label>
          <div
            className="terminal-input w-full px-3 py-2 rounded text-sm min-h-[80px] break-all cursor-pointer"
            onClick={() => navigator.clipboard.writeText(result)}
            title="Click to copy"
          >
            {result}
            <span className="text-terminal-dim text-xs ml-2">[click to copy]</span>
          </div>
        </div>
      )}
    </CipherLayout>
  );
}
