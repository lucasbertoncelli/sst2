import { createClient } from "@supabase/supabase-js"

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_SUPABASE_URL não está definida.")
}
if (!supabaseAnonKey) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida.")
}

// Criação do cliente Supabase para ser usado no lado do cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
