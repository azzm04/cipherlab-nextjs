// ============================================================
// CLASSICAL CIPHER ALGORITHMS
// ============================================================

// ---- Helpers ----
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toUpper(str: string) {
  return str.toUpperCase();
}

function isAlpha(ch: string) {
  return /[A-Z]/.test(ch);
}

function charToNum(ch: string) {
  return ch.charCodeAt(0) - 65;
}

function numToChar(n: number) {
  return String.fromCharCode(((n % 26) + 26) % 26 + 65);
}

// ============================================================
// 1. VIGENERE CIPHER
// ============================================================
export function vigenereEncrypt(plaintext: string, key: string): string {
  const pt = toUpper(plaintext);
  const k = toUpper(key).replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key must contain at least one letter");
  let result = "";
  let ki = 0;
  for (const ch of pt) {
    if (isAlpha(ch)) {
      const shift = charToNum(k[ki % k.length]);
      result += numToChar(charToNum(ch) + shift);
      ki++;
    } else {
      result += ch;
    }
  }
  return result;
}

export function vigenereDecrypt(ciphertext: string, key: string): string {
  const ct = toUpper(ciphertext);
  const k = toUpper(key).replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key must contain at least one letter");
  let result = "";
  let ki = 0;
  for (const ch of ct) {
    if (isAlpha(ch)) {
      const shift = charToNum(k[ki % k.length]);
      result += numToChar(charToNum(ch) - shift);
      ki++;
    } else {
      result += ch;
    }
  }
  return result;
}

// ============================================================
// 2. AFFINE CIPHER
// ============================================================
function modInverse(a: number, m: number): number {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  throw new Error(`a=${a} has no modular inverse mod ${m}. a must be coprime with 26.`);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function affineEncrypt(plaintext: string, a: number, b: number): string {
  if (gcd(a, 26) !== 1) throw new Error(`'a' (${a}) must be coprime with 26. Valid values: 1,3,5,7,9,11,15,17,19,21,23,25`);
  const pt = toUpper(plaintext);
  let result = "";
  for (const ch of pt) {
    if (isAlpha(ch)) {
      result += numToChar(a * charToNum(ch) + b);
    } else {
      result += ch;
    }
  }
  return result;
}

export function affineDecrypt(ciphertext: string, a: number, b: number): string {
  if (gcd(a, 26) !== 1) throw new Error(`'a' (${a}) must be coprime with 26. Valid values: 1,3,5,7,9,11,15,17,19,21,23,25`);
  const aInv = modInverse(a, 26);
  const ct = toUpper(ciphertext);
  let result = "";
  for (const ch of ct) {
    if (isAlpha(ch)) {
      result += numToChar(aInv * (charToNum(ch) - b));
    } else {
      result += ch;
    }
  }
  return result;
}

// ============================================================
// 3. PLAYFAIR CIPHER
// ============================================================
function buildPlayfairMatrix(key: string): string[][] {
  const k = toUpper(key).replace(/[^A-Z]/g, "").replace(/J/g, "I");
  const seen = new Set<string>();
  const seq: string[] = [];
  for (const ch of k + ALPHA) {
    const c = ch === "J" ? "I" : ch;
    if (!seen.has(c)) {
      seen.add(c);
      seq.push(c);
    }
  }
  const matrix: string[][] = [];
  for (let i = 0; i < 5; i++) matrix.push(seq.slice(i * 5, i * 5 + 5));
  return matrix;
}

function findInMatrix(matrix: string[][], ch: string): [number, number] {
  const c = ch === "J" ? "I" : ch;
  for (let r = 0; r < 5; r++)
    for (let col = 0; col < 5; col++)
      if (matrix[r][col] === c) return [r, col];
  throw new Error(`Character ${c} not found in matrix`);
}

function playfairPrepare(plaintext: string): string[] {
  const pt = toUpper(plaintext).replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const pairs: string[] = [];
  let i = 0;
  while (i < pt.length) {
    const a = pt[i];
    let b = pt[i + 1] || "X";
    if (a === b) { b = "X"; i++; }
    else i += 2;
    pairs.push(a + b);
  }
  if (pairs.length > 0) {
    const last = pairs[pairs.length - 1];
    if (last.length === 1) pairs[pairs.length - 1] = last + "X";
  }
  return pairs;
}

export function playfairEncrypt(plaintext: string, key: string): string {
  const matrix = buildPlayfairMatrix(key);
  const pairs = playfairPrepare(plaintext);
  let result = "";
  for (const pair of pairs) {
    const [r1, c1] = findInMatrix(matrix, pair[0]);
    const [r2, c2] = findInMatrix(matrix, pair[1]);
    if (r1 === r2) {
      result += matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5];
    } else if (c1 === c2) {
      result += matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2];
    } else {
      result += matrix[r1][c2] + matrix[r2][c1];
    }
  }
  return result;
}

export function playfairDecrypt(ciphertext: string, key: string): string {
  const matrix = buildPlayfairMatrix(key);
  const ct = toUpper(ciphertext).replace(/[^A-Z]/g, "");
  const pairs: string[] = [];
  for (let i = 0; i < ct.length; i += 2) pairs.push(ct[i] + (ct[i + 1] || "X"));
  let result = "";
  for (const pair of pairs) {
    const [r1, c1] = findInMatrix(matrix, pair[0]);
    const [r2, c2] = findInMatrix(matrix, pair[1]);
    if (r1 === r2) {
      result += matrix[r1][(c1 + 4) % 5] + matrix[r2][(c2 + 4) % 5];
    } else if (c1 === c2) {
      result += matrix[(r1 + 4) % 5][c1] + matrix[(r2 + 4) % 5][c2];
    } else {
      result += matrix[r1][c2] + matrix[r2][c1];
    }
  }
  return result;
}

export function getPlayfairMatrix(key: string): string[][] {
  return buildPlayfairMatrix(key);
}

// ============================================================
// 4. HILL CIPHER
// ============================================================
function matMul(A: number[][], B: number[][], mod: number): number[][] {
  const n = A.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod;
  return result;
}

function matDet2x2(m: number[][]): number {
  return ((m[0][0] * m[1][1] - m[0][1] * m[1][0]) % 26 + 26) % 26;
}

function matInverse2x2(m: number[][]): number[][] {
  const det = matDet2x2(m);
  if (gcd(det, 26) !== 1) throw new Error(`Key matrix determinant (${det}) is not invertible mod 26. Choose a different key.`);
  const detInv = modInverse(det, 26);
  return [
    [(detInv * m[1][1]) % 26, (detInv * (-m[0][1] + 26)) % 26],
    [(detInv * (-m[1][0] + 26)) % 26, (detInv * m[0][0]) % 26],
  ];
}

export function hillEncrypt(plaintext: string, keyMatrix: number[][]): string {
  const n = keyMatrix.length;
  const pt = toUpper(plaintext).replace(/[^A-Z]/g, "");
  const padded = pt + "X".repeat((n - (pt.length % n)) % n);
  let result = "";
  for (let i = 0; i < padded.length; i += n) {
    const block = padded.slice(i, i + n).split("").map(charToNum);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < n; c++) sum += keyMatrix[r][c] * block[c];
      result += numToChar(sum);
    }
  }
  return result;
}

export function hillDecrypt(ciphertext: string, keyMatrix: number[][]): string {
  const n = keyMatrix.length;
  if (n !== 2) throw new Error("Only 2x2 Hill Cipher decryption is supported in this MVP");
  const inv = matInverse2x2(keyMatrix);
  return hillEncrypt(ciphertext, inv);
}

// ============================================================
// 5. ENIGMA CIPHER (simplified 3-rotor simulation)
// ============================================================

// Historical rotor wirings (Enigma I)
const ROTORS = [
  { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" }, // Rotor I
  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" }, // Rotor II
  { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" }, // Rotor III
  { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: "J" }, // Rotor IV
  { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: "Z" }, // Rotor V
];

const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

export interface EnigmaConfig {
  rotors: [number, number, number];       // rotor indices [left, mid, right]
  positions: [string, string, string];    // starting positions A-Z
  rings: [number, number, number];        // ring settings 0-25
  plugboard: string;                      // e.g. "AB CD EF" pairs
}

function parsePlugboard(pb: string): Map<string, string> {
  const map = new Map<string, string>();
  const pairs = pb.toUpperCase().split(/\s+/);
  for (const pair of pairs) {
    if (pair.length === 2) {
      map.set(pair[0], pair[1]);
      map.set(pair[1], pair[0]);
    }
  }
  return map;
}

function enigmaEncryptChar(
  ch: string,
  rotorState: { pos: number; ring: number; wiring: string; notch: string }[],
  plugboard: Map<string, string>
): string {
  // Step rotors
  const midAtNotch = rotorState[1].pos === charToNum(rotorState[1].notch);
  const rightAtNotch = rotorState[2].pos === charToNum(rotorState[2].notch);
  if (midAtNotch) {
    rotorState[0].pos = (rotorState[0].pos + 1) % 26;
    rotorState[1].pos = (rotorState[1].pos + 1) % 26;
  } else if (rightAtNotch) {
    rotorState[1].pos = (rotorState[1].pos + 1) % 26;
  }
  rotorState[2].pos = (rotorState[2].pos + 1) % 26;

  // Plugboard in
  let c = plugboard.get(ch) || ch;
  let idx = charToNum(c);

  // Forward through rotors (right to left)
  for (let i = 2; i >= 0; i--) {
    const r = rotorState[i];
    const shifted = (idx + r.pos - r.ring + 26) % 26;
    const wired = charToNum(r.wiring[shifted]);
    idx = (wired - r.pos + r.ring + 26) % 26;
  }

  // Reflector
  idx = charToNum(REFLECTOR_B[idx]);

  // Backward through rotors (left to right)
  for (let i = 0; i < 3; i++) {
    const r = rotorState[i];
    const shifted = (idx + r.pos - r.ring + 26) % 26;
    const wired = r.wiring.indexOf(ALPHA[shifted]);
    idx = (wired - r.pos + r.ring + 26) % 26;
  }

  // Plugboard out
  c = plugboard.get(ALPHA[idx]) || ALPHA[idx];
  return c;
}

export function enigmaProcess(text: string, config: EnigmaConfig): string {
  const plugboard = parsePlugboard(config.plugboard);
  const rotorState = [0, 1, 2].map((i) => ({
    pos: charToNum(config.positions[i]),
    ring: config.rings[i],
    wiring: ROTORS[config.rotors[i]].wiring,
    notch: ROTORS[config.rotors[i]].notch,
  }));

  const input = toUpper(text).replace(/[^A-Z]/g, "");
  let result = "";
  for (const ch of input) {
    result += enigmaEncryptChar(ch, rotorState, plugboard);
  }
  return result;
}
