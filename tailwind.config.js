/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Courier Prime'", "monospace"],
        body: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        terminal: {
          bg: "#0a0a0f",
          surface: "#111118",
          border: "#1e1e2e",
          green: "#00ff88",
          amber: "#ffb700",
          cyan: "#00d4ff",
          red: "#ff4757",
          muted: "#3a3a5c",
          text: "#c8c8e8",
          dim: "#6b6b9a",
        },
      },
      animation: {
        "scan": "scan 3s linear infinite",
        "blink": "blink 1s step-end infinite",
        "flicker": "flicker 0.15s infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "0.97" },
          "96%": { opacity: "0.95" },
          "98%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.2)" },
        },
      },
    },
  },
  plugins: [],
};
