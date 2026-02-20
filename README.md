# CipherLab — Classical Cryptography Suite

Web-based calculator untuk enkripsi dan dekripsi menggunakan algoritma kriptografi klasik.
Dibuat untuk tugas proyek **Kriptografi**.

## Fitur

| Cipher | Tipe | Keterangan |
|--------|------|------------|
| **Vigenere** | Polyalphabetic | Menggunakan keyword untuk shift tiap huruf |
| **Affine** | Monoalphabetic | C = (aP + b) mod 26, a harus coprime dengan 26 |
| **Playfair** | Digraphic | Matriks 5×5, enkripsi sepasang huruf |
| **Hill** | Polygraphic | Berdasarkan aljabar linear / matriks 2×2 |
| **Enigma** | Rotor Machine | Simulasi mesin Enigma WWII (3 rotor + plugboard) |

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Terminal / CRT aesthetic)
- **Database**: Supabase (history log)
- **Hosting**: Vercel

## Cara Menjalankan Lokal

### 1. Clone dan Install

```bash
git clone <repo-url>
cd crypto-classical
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** dan jalankan isi file `supabase-migration.sql`
3. Salin URL dan anon key dari **Settings → API**

### 3. Setup Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Contoh Penggunaan

### Vigenere Cipher
- Plaintext: `HELLO WORLD`
- Key: `SECRET`
- Ciphertext: `ZINCS PVVPH`

### Affine Cipher
- Plaintext: `HELLO`
- a=5, b=8
- Ciphertext: `RCLLA`

### Playfair Cipher
- Plaintext: `HIDE GOLD`
- Key: `PLAYFAIR`
- Ciphertext: `BMNDZBXD`

### Hill Cipher (2x2)
- Plaintext: `ACT`
- Key Matrix: [[6,24],[1,13]]
- Ciphertext: `POH`

### Enigma
- Setting: Rotor I,II,III | Pos A,A,A | Ring 0,0,0
- Plugboard: AZ BY CX
- Input=Output saat setting sama (self-inverse)

## Struktur Project

```
src/
├── app/
│   ├── page.tsx          # Main page dengan tab navigation
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Terminal theme CSS
├── components/
│   ├── CipherLayout.tsx  # Shared layout component
│   ├── VigenereCipher.tsx
│   ├── AffineCipher.tsx
│   ├── PlayfairCipher.tsx
│   ├── HillCipher.tsx
│   ├── EnigmaCipher.tsx
│   └── HistoryPanel.tsx  # Supabase history
└── lib/
    ├── ciphers.ts        # Semua algoritma cipher
    └── supabase.ts       # Supabase client & helpers
```

## Catatan

- Semua algoritma diimplementasikan dari scratch tanpa library kriptografi eksternal
- Non-alphabetic characters (spasi, angka, dll) dipreservasi
- Enigma cipher bersifat self-inverse (enkripsi = dekripsi dengan setting sama)
- Hill cipher saat ini support 2×2 matrix
