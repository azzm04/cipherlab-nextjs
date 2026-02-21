"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n, Locale } from "@/lib/i18n";
import "/node_modules/country-flag-icons/3x2/flags.css";
import { GB, ID } from "country-flag-icons/react/3x2";

const FlagIcon = ({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) => {
  if (locale === "en") return <GB className={className} />;
  if (locale === "id") return <ID className={className} />;
  return null;
};

const LABELS: Record<Locale, string> = {
  en: "English",
  id: "Indonesia",
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const options: Locale[] = ["en", "id"];

  return (
    <div ref={ref} className="relative select-none">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all"
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(0,255,136,0.25)",
          color: "#c8c8e8",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(0,255,136,0.6)";
          (e.currentTarget as HTMLButtonElement).style.color = "#00ff88";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(0,255,136,0.25)";
          (e.currentTarget as HTMLButtonElement).style.color = "#c8c8e8";
        }}
      >
        <FlagIcon locale={locale} className="w-5 h-auto rounded-sm" />
        <span className="hidden sm:inline">{LABELS[locale]}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            opacity: 0.6,
          }}
        >
          <path
            d="M1 3l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 rounded overflow-hidden z-50"
          style={{
            minWidth: "160px",
            background: "#111118",
            border: "1px solid rgba(0,255,136,0.2)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,136,0.05)",
            animation: "dropIn 0.15s ease",
          }}
        >
          {/* Dropdown header */}
          <div
            className="px-3 py-2 text-[10px] uppercase tracking-widest border-b"
            style={{ color: "#3a3a5c", borderColor: "rgba(0,255,136,0.1)" }}
          >
            Language / Bahasa
          </div>

          {options.map((lang) => {
            const isActive = locale === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  setLocale(lang);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors"
                style={{
                  background: isActive ? "rgba(0,255,136,0.08)" : "transparent",
                  color: isActive ? "#00ff88" : "#c8c8e8",
                  borderLeft: isActive
                    ? "2px solid #00ff88"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }
                }}
              >
                {/* Checkmark */}
                <span className="btn-span">
                  {isActive && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#00ff88"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <FlagIcon locale={lang} className="w-5 h-auto rounded-sm" />

                <span className="font-mono text-xs">{LABELS[lang]}</span>
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
