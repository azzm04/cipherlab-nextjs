import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CipherLab — Classical Cryptography",
  description:
    "Web-based classical cipher calculator: Vigenere, Affine, Playfair, Hill, and Enigma ciphers. Encrypt and decrypt in your browser.",
  keywords: ["cryptography", "cipher", "vigenere", "affine", "playfair", "hill", "enigma"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
