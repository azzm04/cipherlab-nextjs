"use client";
import { useState } from "react";
import { hillEncrypt, hillDecrypt } from "@/lib/ciphers";
import { saveHistory } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import CipherLayout from "./CipherLayout";

export default function HillCipher() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [mat, setMat] = useState([
    [6, 24],
    [1, 13],
  ]);

  function setCell(r: number, c: number, val: string) {
    const n = parseInt(val) || 0;
    setMat((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) =>
          ri === r && ci === c ? ((n % 26) + 26) % 26 : cell,
        ),
      ),
    );
  }

  async function process() {
    setError("");
    try {
      if (!text.trim()) throw new Error(t("cipher.inputRequired"));
      const out =
        mode === "encrypt" ? hillEncrypt(text, mat) : hillDecrypt(text, mat);
      setResult(out);
      await saveHistory({
        cipher_type: "hill",
        operation: mode,
        plaintext: mode === "encrypt" ? text.toUpperCase() : out,
        ciphertext: mode === "encrypt" ? out : text.toUpperCase(),
        key_info: `matrix=[[${mat[0]}],[${mat[1]}]]`,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  const presets = [
    {
      label: "Classic",
      mat: [
        [6, 24],
        [1, 13],
      ],
    },
    {
      label: "GYBNQKURP",
      mat: [
        [6, 24],
        [13, 16],
      ],
    },
    {
      label: "Simple",
      mat: [
        [3, 3],
        [2, 5],
      ],
    },
  ];

  return (
    <CipherLayout
      name={t("hill.name")}
      description={t("hill.description")}
      formula={
        <div className="text-xs space-y-1">
          <div>
            <span className="text-terminal-amber">{t("cipher.encrypt")}:</span>{" "}
            <span className="text-terminal-cyan">C = K · P (mod 26)</span>
          </div>
          <div>
            <span className="text-terminal-amber">{t("cipher.decrypt")}:</span>{" "}
            <span className="text-terminal-cyan">P = K⁻¹ · C (mod 26)</span>
          </div>
          <div className="text-terminal-dim">{t("hill.formulaNote")}</div>
        </div>
      }
    >
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-2">
          {t("hill.presetLabel")}
        </label>
        <div className="flex gap-2 flex-wrap">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setMat(p.mat)}
              className="btn-terminal text-xs px-3 py-1.5 rounded border border-terminal-muted text-terminal-dim hover:border-terminal-cyan hover:text-terminal-cyan"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-2">
          {t("hill.matrixLabel")}
        </label>
        <div className="inline-grid grid-cols-2 gap-2">
          {mat.map((row, ri) =>
            row.map((cell, ci) => (
              <input
                key={`${ri}-${ci}`}
                type="number"
                min={0}
                max={25}
                value={cell}
                onChange={(e) => setCell(ri, ci, e.target.value)}
                className="terminal-input w-16 h-12 text-center text-lg font-bold rounded"
                aria-label="input"
              />
            )),
          )}
        </div>
        <div className="text-xs text-terminal-dim mt-1">
          {t("hill.detLabel")} ={" "}
          {(((mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]) % 26) + 26) % 26}{" "}
          mod 26
        </div>
      </div>
      <div>
        <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
          {mode === "encrypt" ? t("cipher.plaintext") : t("cipher.ciphertext")}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={
            mode === "encrypt"
              ? t("cipher.enterPlaintext")
              : t("cipher.enterCiphertext")
          }
          className="terminal-input w-full px-3 py-2 rounded text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encrypt")}
          className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "encrypt" ? "border-terminal-green text-terminal-green bg-terminal-green/10" : "border-terminal-muted text-terminal-dim"}`}
        >
          {t("cipher.encrypt")}
        </button>
        <button
          onClick={() => setMode("decrypt")}
          className={`btn-terminal flex-1 py-2 rounded text-sm border ${mode === "decrypt" ? "border-terminal-amber text-terminal-amber bg-terminal-amber/10" : "border-terminal-muted text-terminal-dim"}`}
        >
          {t("cipher.decrypt")}
        </button>
      </div>
      <button
        onClick={process}
        className="btn-terminal w-full py-2.5 rounded text-sm font-bold bg-terminal-green text-terminal-bg hover:bg-terminal-green/90"
      >
        {t("cipher.execute")}
      </button>
      {error && (
        <div className="text-terminal-red text-xs p-2 border border-terminal-red/40 rounded bg-terminal-red/5">
          {error}
        </div>
      )}
      {result && (
        <div>
          <label className="block text-xs text-terminal-dim uppercase tracking-widest mb-1">
            {t("cipher.output")}
          </label>
          <div
            className="terminal-input w-full px-3 py-2 rounded text-sm min-h-[60px] break-all cursor-pointer"
            onClick={() => navigator.clipboard.writeText(result)}
            title="Click to copy"
          >
            {result}{" "}
            <span className="text-terminal-dim text-xs ml-2">
              [{t("cipher.clickToCopy")}]
            </span>
          </div>
        </div>
      )}
    </CipherLayout>
  );
}
