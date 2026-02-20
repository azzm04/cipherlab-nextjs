"use client";
import { useState } from "react";
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix } from "@/lib/ciphers";
import CipherLayout from "./CipherLayout";

export default function PlayfairCipher() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("KEYWORD");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  let matrix: string[][] = [];
  try {
    if (key.trim()) matrix = getPlayfairMatrix(key);
  } catch {}

  function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error("Input text is required");
      if (!key.trim()) throw new Error("Key is required");
      const out = mode === "encrypt" ? playfairEncrypt(text, key) : playfairDecrypt(text, key);
      setResult(out);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <CipherLayout
      name="Playfair Cipher"
      description="A digraph substitution cipher using a 5×5 key matrix. J is merged with I. Encrypts pairs of letters using row, column, or rectangle rules."
      formula={
        <div className="text-xs space-y-1 text-terminal-dim">
          <div><span className="text-terminal-cyan">Same row:</span> shift right (+1)</div>
          <div><span className="text-terminal-cyan">Same col:</span> shift down (+1)</div>
          <div><span className="text-terminal-cyan">Rectangle:</span> swap columns</div>
        </div>
      }
    >
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">Key</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g. KEYWORD" className="terminal-input w-full px-3 py-2 rounded text-sm" />
      </div>

      {/* 5x5 matrix visualization */}
      {matrix.length === 5 && (
        <div>
          <div className="text-xs text-terminal-dim uppercase tracking-widest mb-2">Key Matrix (5×5)</div>
          <div className="inline-grid grid-cols-5 gap-1">
            {matrix.flat().map((cell, i) => (
              <div key={i} className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded" style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.2)", color: "var(--green)" }}>
                {cell}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">{mode === "encrypt" ? "Plaintext" : "Ciphertext"}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={mode === "encrypt" ? "Enter plaintext..." : "Enter ciphertext..."} className="terminal-input w-full px-3 py-2 rounded text-sm" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setMode("encrypt")} className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "encrypt" ? "border-terminal-green text-terminal-green bg-terminal-green/10" : "border-terminal-muted text-terminal-dim"}`}>ENCRYPT</button>
        <button onClick={() => setMode("decrypt")} className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "decrypt" ? "border-terminal-amber text-terminal-amber bg-terminal-amber/10" : "border-terminal-muted text-terminal-dim"}`}>DECRYPT</button>
      </div>
      <button onClick={process} className="btn-terminal w-full py-2.5 rounded text-sm font-bold bg-terminal-green text-terminal-bg hover:bg-terminal-green/90">▶ EXECUTE</button>

      {error && <div className="text-terminal-red text-xs p-2 border border-terminal-red/40 rounded bg-terminal-red/5">{error}</div>}
      {result && (
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">Output</label>
          <div className="terminal-input w-full px-3 py-2 rounded text-sm min-h-[60px] break-all cursor-pointer" onClick={() => navigator.clipboard.writeText(result)} title="Click to copy">
            {result} <span className="text-terminal-dim text-xs ml-2">[click to copy]</span>
          </div>
        </div>
      )}
    </CipherLayout>
  );
}
