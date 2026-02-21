"use client";
import { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  name: string;
  description: string;
  formula?: ReactNode;
  children: ReactNode;
}

export default function CipherLayout({ name, description, formula, children }: Props) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="terminal-card rounded-lg p-5 space-y-4">
        <div>
          <div className="text-xs text-terminal-dim uppercase tracking-widest mb-1">{t("cipher.algorithm")}</div>
          <h2 className="text-terminal-green font-display text-xl glow-green">{name}</h2>
        </div>
        <p className="text-sm text-terminal-dim leading-relaxed">{description}</p>
        {formula && (
          <div>
            <div className="text-xs text-terminal-dim uppercase tracking-widest mb-2">{t("cipher.formula")}</div>
            <div className="bg-black/40 rounded p-3 border border-terminal-muted/30">{formula}</div>
          </div>
        )}
        <div className="pt-2 border-t border-terminal-border">
          <div className="text-xs text-terminal-dim">{t("cipher.nonAlpha")}</div>
        </div>
      </div>
      <div className="lg:col-span-2 terminal-card rounded-lg p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}
