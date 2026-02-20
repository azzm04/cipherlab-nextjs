"use client";
import { useState } from "react";
import { affineEncrypt, affineDecrypt } from "@/lib/ciphers";
import CipherLayout from "./CipherLayout";

const VALID_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

export default function AffineCipher() {
  const [text, setText] = useState("");
  const [a, setA] = useState(5);
  const [b, setB] = useState(8);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error("Input text is required");
      const out = mode === "encrypt" ? affineEncrypt(text, a, b) : affineDecrypt(text, a, b);
      setResult(out);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <CipherLayout
      name="Affine Cipher"
      description="A monoalphabetic cipher where each letter is mapped using a linear function. Requires 'a' to be coprime with 26."
      formula={
        <div className="text-xs space-y-1">
          <div><span className="text-terminal-amber">Encrypt:</span> <span className="text-terminal-cyan">C = (a·P + b) mod 26</span></div>
          <div><span className="text-terminal-amber">Decrypt:</span> <span className="text-terminal-cyan">P = a⁻¹·(C − b) mod 26</span></div>
          <div className="text-terminal-dim">a must be coprime with 26</div>
        </div>
      }
    >
      {/* Keys */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
            Key a (coprime with 26)
          </label>
          <select
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="terminal-input w-full px-3 py-2 rounded text-sm"
            title="Select a value for key a that is coprime with 26"
          >
            {VALID_A.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
            Key b (0–25)
          </label>
          <input
            type="number"
            aria-label="Key b (0–25)"
            value={b}
            min={0}
            max={25}
            onChange={(e) => setB(Number(e.target.value))}
            className="terminal-input w-full px-3 py-2 rounded text-sm"
          />
        </div>
      </div>

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
