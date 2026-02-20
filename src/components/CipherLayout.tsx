"use client";
import { ReactNode } from "react";

interface Props {
  name: string;
  description: string;
  formula?: ReactNode;
  children: ReactNode;
}

export default function CipherLayout({ name, description, formula, children }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Info panel */}
      <div className="terminal-card rounded-lg p-5 space-y-4">
        <div>
          <div className="text-xs text-terminal-dim uppercase tracking-widest mb-1">Algorithm</div>
          <h2 className="text-terminal-green font-display text-xl glow-green">{name}</h2>
        </div>
        <p className="text-sm text-terminal-dim leading-relaxed">{description}</p>
        {formula && (
          <div>
            <div className="text-xs text-terminal-dim uppercase tracking-widest mb-2">Formula</div>
            <div className="bg-black/40 rounded p-3 border border-terminal-muted/30">{formula}</div>
          </div>
        )}
        <div className="pt-2 border-t border-terminal-border">
          <div className="text-xs text-terminal-dim">Non-alphabetic characters are preserved as-is.</div>
        </div>
      </div>

      {/* Main panel */}
      <div className="lg:col-span-2 terminal-card rounded-lg p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}
