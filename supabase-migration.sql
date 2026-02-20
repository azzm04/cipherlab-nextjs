-- Run this SQL in your Supabase SQL editor to set up the database
-- Go to: https://app.supabase.com -> Your Project -> SQL Editor

-- Create cipher history table
CREATE TABLE IF NOT EXISTS cipher_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  cipher_type TEXT NOT NULL CHECK (cipher_type IN ('vigenere', 'affine', 'playfair', 'hill', 'enigma')),
  operation TEXT NOT NULL CHECK (operation IN ('encrypt', 'decrypt')),
  plaintext TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  key_info TEXT DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE cipher_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for MVP - no auth)
CREATE POLICY "Allow insert for all" ON cipher_history
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read (for MVP - no auth)
CREATE POLICY "Allow select for all" ON cipher_history
  FOR SELECT USING (true);

-- Optional: Add index for faster queries
CREATE INDEX IF NOT EXISTS cipher_history_created_at_idx ON cipher_history (created_at DESC);
