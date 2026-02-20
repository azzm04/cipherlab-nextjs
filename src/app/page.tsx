"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const VigenereCipher = dynamic(() => import("@/components/VigenereCipher"), { ssr: false });
const AffineCipher = dynamic(() => import("@/components/AffineCipher"), { ssr: false });
const PlayfairCipher = dynamic(() => import("@/components/PlayfairCipher"), { ssr: false });
const HillCipher = dynamic(() => import("@/components/HillCipher"), { ssr: false });
const EnigmaCipher = dynamic(() => import("@/components/EnigmaCipher"), { ssr: false });
const HistoryPanel = dynamic(() => import("@/components/HistoryPanel"), { ssr: false });

const CIPHERS = [
  { id: "vigenere", label: "Vigenere", badge: "POLY" },
  { id: "affine", label: "Affine", badge: "MONO" },
  { id: "playfair", label: "Playfair", badge: "DIGR" },
  { id: "hill", label: "Hill", badge: "MAT" },
  { id: "enigma", label: "Enigma", badge: "ROTR" },
  { id: "history", label: "History", badge: "LOG" },
];

export default function Home() {
  const [active, setActive] = useState("vigenere");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="border-b border-terminal-border sticky top-0 z-50" style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-terminal-red opacity-80" />
              <div className="w-3 h-3 rounded-full bg-terminal-amber opacity-80" />
              <div className="w-3 h-3 rounded-full bg-terminal-green opacity-80" />
            </div>
            <div>
              <span className="text-terminal-green font-display text-lg glow-green">CipherLab</span>
              <span className="text-terminal-dim text-xs ml-2">v1.0.0 — Classical Cryptography Suite</span>
            </div>
          </div>
          <div className="text-xs text-terminal-dim hidden sm:block">
            <span className="text-terminal-green">●</span> ONLINE
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
          {CIPHERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-all ${
                active === c.id
                  ? "border-terminal-green text-terminal-green"
                  : "border-transparent text-terminal-dim hover:text-terminal-text"
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${active === c.id ? "bg-terminal-green/20 text-terminal-green" : "bg-terminal-muted/30 text-terminal-dim"}`}>
                {c.badge}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Decorative background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(var(--green) 1px, transparent 1px), linear-gradient(90deg, var(--green) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <main className="max-w-7xl mx-auto px-4 py-6 relative">
        {/* Welcome banner */}
        {active !== "history" && (
          <div className="mb-6 p-4 rounded-lg border border-terminal-muted/30 bg-black/20 flex items-center justify-between">
            <div>
              <div className="text-xs text-terminal-dim uppercase tracking-widest mb-0.5">Active Module</div>
              <div className="text-terminal-green text-sm font-bold">{CIPHERS.find((c) => c.id === active)?.label} Cipher</div>
            </div>
            <div className="text-xs text-terminal-dim text-right">
              <div>SEMESTER GENAP 2025/2026</div>
              <div>Kriptografi Klasik</div>
            </div>
          </div>
        )}

        {/* Cipher panels */}
        {active === "vigenere" && <VigenereCipher />}
        {active === "affine" && <AffineCipher />}
        {active === "playfair" && <PlayfairCipher />}
        {active === "hill" && <HillCipher />}
        {active === "enigma" && <EnigmaCipher />}
        {active === "history" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-terminal-green text-lg glow-green">Operation History</h2>
              <div className="text-xs text-terminal-dim">Powered by Supabase</div>
            </div>
            <HistoryPanel />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border mt-12 py-6 text-center text-xs text-terminal-dim">
        <div>CipherLab — Classical Cryptography Suite</div>
        <div className="mt-1">
          Built with <span className="text-terminal-green">Next.js</span> · <span className="text-terminal-cyan">Supabase</span> · Deployed on <span className="text-terminal-amber">Vercel</span>
        </div>
      </footer>
    </div>
  );
}
