"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { ssr: false });
const VigenereCipher = dynamic(() => import("@/components/VigenereCipher"), { ssr: false });
const AffineCipher = dynamic(() => import("@/components/AffineCipher"), { ssr: false });
const PlayfairCipher = dynamic(() => import("@/components/PlayfairCipher"), { ssr: false });
const HillCipher = dynamic(() => import("@/components/HillCipher"), { ssr: false });
const EnigmaCipher = dynamic(() => import("@/components/EnigmaCipher"), { ssr: false });
const HistoryPanel = dynamic(() => import("@/components/HistoryPanel"), { ssr: false });

export default function Home() {
  const { t } = useI18n();
  const [showSplash, setShowSplash] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [active, setActive] = useState("vigenere");

  const CIPHERS = [
    { id: "vigenere", label: "Vigenere", badge: "POLY" },
    { id: "affine", label: "Affine", badge: "MONO" },
    { id: "playfair", label: "Playfair", badge: "DIGR" },
    { id: "hill", label: "Hill", badge: "MAT" },
    { id: "enigma", label: "Enigma", badge: "ROTR" },
    { id: "history", label: t("tabs.history"), badge: "LOG" },
  ];

  function handleEnter() {
    setTimeout(() => {
      setShowSplash(false);
      setAppVisible(true);
    }, 800);
  }

  return (
    <>
      {showSplash && <SplashScreen onEnter={handleEnter} />}

      <div
        className="min-h-screen"
        style={{
          background: "var(--bg)",
          opacity: appVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
          visibility: appVisible ? "visible" : "hidden",
        }}
      >
        {/* Header */}
        <header
          className="border-b border-terminal-border sticky top-0 z-50"
          style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(10px)" }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-terminal-red opacity-80" />
                <div className="w-3 h-3 rounded-full bg-terminal-amber opacity-80" />
                <div className="w-3 h-3 rounded-full bg-terminal-green opacity-80" />
              </div>
              <div>
                <span className="text-terminal-green font-display text-lg glow-green">CipherLab</span>
                <span className="text-terminal-dim text-xs ml-2">Classical Cryptography Suite</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />

              <div className="text-xs text-terminal-dim hidden sm:block">
                <span className="text-terminal-green">●</span> {t("nav.online")}
              </div>
              <button
                onClick={() => { setAppVisible(false); setShowSplash(true); }}
                className="text-xs text-terminal-dim hover:text-terminal-green transition-colors hidden sm:block"
              >
                ⟳ {t("nav.intro")}
              </button>
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
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  active === c.id ? "bg-terminal-green/20 text-terminal-green" : "bg-terminal-muted/30 text-terminal-dim"
                }`}>
                  {c.badge}
                </span>
              </button>
            ))}
          </div>
        </header>

        {/* Background grid */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(var(--green) 1px, transparent 1px), linear-gradient(90deg, var(--green) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <main className="max-w-7xl mx-auto px-4 py-6 relative">
          {active !== "history" && (
            <div className="mb-6 p-4 rounded-lg border border-terminal-muted/30 bg-black/20 flex items-center justify-between">
              <div>
                <div className="text-xs text-terminal-dim uppercase tracking-widest mb-0.5">{t("banner.activeModule")}</div>
                <div className="text-terminal-green text-sm font-bold">
                  {CIPHERS.find((c) => c.id === active)?.label} Cipher
                </div>
              </div>
            </div>
          )}

          {active === "vigenere" && <VigenereCipher />}
          {active === "affine" && <AffineCipher />}
          {active === "playfair" && <PlayfairCipher />}
          {active === "hill" && <HillCipher />}
          {active === "enigma" && <EnigmaCipher />}
          {active === "history" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-terminal-green text-lg glow-green">{t("history.title")}</h2>
                <div className="text-xs text-terminal-dim">{t("history.poweredBy")}</div>
              </div>
              <HistoryPanel />
            </div>
          )}
        </main>

        <footer className="border-t border-terminal-border mt-12 py-6 text-center text-xs text-terminal-dim">
          <div>CipherLab — Classical Cryptography Suite</div>
          <div className="mt-1">
            {t("footer.builtWith")} <span className="text-terminal-green">Next.js</span> ·{" "}
            <span className="text-terminal-cyan">Supabase</span> · {t("footer.deployedOn")}{" "}
            <span className="text-terminal-amber">Azzam</span>
          </div>
        </footer>
      </div>
    </>
  );
}
