"use client";
import { useState } from "react";
import { enigmaProcess, EnigmaConfig } from "@/lib/ciphers";
import CipherLayout from "./CipherLayout";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function EnigmaCipher() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [config, setConfig] = useState<EnigmaConfig>({
    rotors: [0, 1, 2],
    positions: ["A", "A", "A"],
    rings: [0, 0, 0],
    plugboard: "AZ BY CX",
  });

  const rotorNames = ["Rotor I", "Rotor II", "Rotor III", "Rotor IV", "Rotor V"];
  const labels = ["Left", "Middle", "Right"];

  function updateRotor(i: number, v: number) {
    setConfig((c) => { const r = [...c.rotors] as [number,number,number]; r[i] = v; return { ...c, rotors: r }; });
  }
  function updatePos(i: number, v: string) {
    setConfig((c) => { const p = [...c.positions] as [string,string,string]; p[i] = v; return { ...c, positions: p }; });
  }
  function updateRing(i: number, v: number) {
    setConfig((c) => { const r = [...c.rings] as [number,number,number]; r[i] = v; return { ...c, rings: r }; });
  }

  function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error("Input text is required");
      const out = enigmaProcess(text, config);
      setResult(out);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <CipherLayout
      name="Enigma Machine"
      description="A simulation of the WWII German Enigma cipher machine with 3 rotors, a reflector (Reflector B), and a plugboard. Encryption = Decryption (symmetric)."
      formula={
        <div className="text-xs space-y-1 text-terminal-dim">
          <div><span className="text-terminal-cyan">Plugboard</span> → Rotors (R→L) → Reflector → Rotors (L→R) → Plugboard</div>
          <div>Rotors step before each character</div>
          <div className="text-terminal-amber">Enigma is self-inverse: use same settings to decrypt</div>
        </div>
      }
    >
      {/* Rotor settings */}
      <div>
        <div className="text-xs text-terminal-dim uppercase tracking-widest mb-2">Rotor Configuration</div>
        <div className="grid grid-cols-3 gap-3">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} className="space-y-2 p-3 rounded border border-terminal-border bg-black/20">
              <div className="text-xs text-terminal-amber uppercase">{labels[i]}</div>
              <div>
                <div className="text-xs text-terminal-dim mb-1">Rotor</div>
                <select
                  value={config.rotors[i]}
                  onChange={(e) => updateRotor(i, Number(e.target.value))}
                  className="terminal-input w-full px-2 py-1.5 rounded text-xs"
                  style={{ background: "rgba(0,0,0,0.6)", border: "1px solid var(--muted)", color: "var(--green)" }}
                >
                  {rotorNames.map((n, idx) => <option key={idx} value={idx}>{n}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs text-terminal-dim mb-1">Start Pos</div>
                <select
                  value={config.positions[i]}
                  onChange={(e) => updatePos(i, e.target.value)}
                  className="terminal-input w-full px-2 py-1.5 rounded text-xs"
                  style={{ background: "rgba(0,0,0,0.6)", border: "1px solid var(--muted)", color: "var(--cyan)" }}
                >
                  {ALPHA.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs text-terminal-dim mb-1">Ring (0-25)</div>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={config.rings[i]}
                  onChange={(e) => updateRing(i, Number(e.target.value))}
                  className="terminal-input w-full px-2 py-1.5 rounded text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plugboard */}
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
          Plugboard (letter pairs, space-separated e.g. "AB CD EF")
        </label>
        <input
          type="text"
          value={config.plugboard}
          onChange={(e) => setConfig((c) => ({ ...c, plugboard: e.target.value }))}
          placeholder="e.g. AZ BY CX DW"
          className="terminal-input w-full px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
          Input Text (same settings for encrypt & decrypt)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Enter text... (non-alpha characters removed)"
          className="terminal-input w-full px-3 py-2 rounded text-sm"
        />
      </div>

      <button onClick={process} className="btn-terminal w-full py-2.5 rounded text-sm font-bold bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/30">
        ▶ PROCESS (ENCRYPT/DECRYPT)
      </button>

      {error && <div className="text-terminal-red text-xs p-2 border border-terminal-red/40 rounded bg-terminal-red/5">{error}</div>}
      {result && (
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">Output</label>
          <div className="terminal-input w-full px-3 py-2 rounded text-sm min-h-[60px] break-all cursor-pointer" onClick={() => navigator.clipboard.writeText(result)} title="Click to copy">
            {result} <span className="text-terminal-dim text-xs ml-2">[click to copy]</span>
          </div>
          <div className="text-xs text-terminal-dim mt-1">⚠ Use same rotor settings and positions to decrypt</div>
        </div>
      )}
    </CipherLayout>
  );
}
