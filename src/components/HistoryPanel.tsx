"use client";
import { useEffect, useState } from "react";
import { getHistory, CipherHistory } from "@/lib/supabase";

export default function HistoryPanel() {
  const [history, setHistory] = useState<CipherHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory(30).then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const cipherColors: Record<string, string> = {
    vigenere: "text-terminal-green",
    affine: "text-terminal-amber",
    playfair: "text-terminal-cyan",
    hill: "#c084fc",
    enigma: "text-terminal-red",
  };

  if (loading) return <div className="text-terminal-dim text-sm text-center py-8">Loading history...</div>;

  if (history.length === 0) return (
    <div className="terminal-card rounded-lg p-6 text-center">
      <div className="text-terminal-dim text-sm mb-2">No history yet</div>
      <div className="text-xs text-terminal-muted">Connect Supabase to enable history logging across sessions</div>
    </div>
  );

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <div key={entry.id} className="terminal-card rounded p-3 text-xs grid grid-cols-[auto_1fr_1fr] gap-3 items-start">
          <div className={`uppercase font-bold ${cipherColors[entry.cipher_type] || "text-terminal-text"}`}>
            {entry.cipher_type}
          </div>
          <div>
            <div className="text-terminal-dim mb-0.5">{entry.operation === "encrypt" ? "↑ Plain" : "↓ Cipher"}</div>
            <div className="text-terminal-text truncate">{entry.operation === "encrypt" ? entry.plaintext : entry.ciphertext}</div>
          </div>
          <div>
            <div className="text-terminal-dim mb-0.5">{entry.operation === "encrypt" ? "↓ Cipher" : "↑ Plain"}</div>
            <div className="text-terminal-green truncate">{entry.operation === "encrypt" ? entry.ciphertext : entry.plaintext}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
