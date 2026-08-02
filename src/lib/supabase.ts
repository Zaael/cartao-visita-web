import { createClient } from "@supabase/supabase-js";

/**
 * Cliente público do Supabase, usado pelos Server Components.
 *
 * Usa a publishable key de propósito: quem garante que só cartão publicado
 * aparece é o RLS, no banco — não o código. A secret key fica restrita ao
 * seed (e, na Fase 5, ao webhook de pagamento).
 *
 * `@supabase/ssr` está instalado mas ainda não é usado: ele serve para a
 * sessão em cookie do Supabase Auth, que só entra na Fase 4.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
      "Copie o .env.example para .env.local e preencha (ver README).",
  );
}

export const supabase = createClient(url, publishableKey, {
  auth: { persistSession: false },
});
