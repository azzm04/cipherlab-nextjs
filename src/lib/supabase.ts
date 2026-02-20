import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CipherHistory = {
  id: string;
  created_at: string;
  cipher_type: string;
  operation: "encrypt" | "decrypt";
  plaintext: string;
  ciphertext: string;
  key_info: string;
};

export async function saveHistory(entry: Omit<CipherHistory, "id" | "created_at">) {
  try {
    const { data, error } = await supabase
      .from("cipher_history")
      .insert([entry])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("Supabase not configured, history not saved:", e);
    return null;
  }
}

export async function getHistory(limit = 20): Promise<CipherHistory[]> {
  try {
    const { data, error } = await supabase
      .from("cipher_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Supabase not configured:", e);
    return [];
  }
}
