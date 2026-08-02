import { createClient } from "@supabase/supabase-js";
import { cartaoSchema, paraLinha } from "../src/types/cartao.ts";
import { cartoes } from "../src/data/cartoes.ts";

/**
 * Seed dos cartões. Roda com `npm run seed`.
 *
 * Usa a secret key do Supabase, que ignora RLS por design — por isso este
 * script só roda localmente e a chave nunca vai para o bundle do client.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(
    "Faltam variáveis em .env.local:\n" +
      (url ? "" : "  NEXT_PUBLIC_SUPABASE_URL\n") +
      (secretKey ? "" : "  SUPABASE_SECRET_KEY\n") +
      "\nA secret key está no painel do Supabase em Project Settings > API Keys.\n" +
      "É a chave que ignora RLS — nunca commite e nunca use no client.",
  );
  process.exit(1);
}

// Valida tudo antes de escrever qualquer coisa: melhor abortar com a lista
// completa de problemas do que gravar metade dos cartões.
const linhas = [];
const problemas: string[] = [];

for (const [i, cartao] of cartoes.entries()) {
  const resultado = cartaoSchema.safeParse(cartao);
  if (resultado.success) {
    linhas.push(paraLinha(resultado.data));
  } else {
    const identificador = cartao.slug || `cartão #${i + 1}`;
    for (const issue of resultado.error.issues) {
      problemas.push(`  ${identificador}: ${issue.path.join(".")} — ${issue.message}`);
    }
  }
}

if (problemas.length > 0) {
  console.error(`Validação falhou:\n${problemas.join("\n")}`);
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});

const { data, error } = await supabase
  .from("cartoes")
  .upsert(linhas, { onConflict: "slug" })
  .select("slug, publicado");

if (error) {
  console.error(`Falha ao gravar no Supabase: ${error.message}`);
  process.exit(1);
}

console.log(`${data.length} cartão(ões) gravado(s):`);
for (const linha of data) {
  console.log(`  /${linha.slug}${linha.publicado ? "" : "  (rascunho)"}`);
}
