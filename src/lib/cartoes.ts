import { supabase } from "./supabase";
import {
  COLUNAS_CARTAO,
  deLinha,
  type Cartao,
  type CartaoRow,
} from "@/types/cartao";

/**
 * Acesso aos cartões. O filtro `publicado = true` é redundante — o RLS já
 * bloqueia no banco — mas deixa a intenção explícita na query e protege caso
 * uma policy mude sem que este código mude junto.
 */

export async function listarCartoesPublicados(): Promise<Cartao[]> {
  const { data, error } = await supabase
    .from("cartoes")
    .select(COLUNAS_CARTAO)
    .eq("publicado", true)
    .order("nome");

  if (error) {
    throw new Error(`Falha ao listar cartões: ${error.message}`);
  }

  return (data as unknown as CartaoRow[]).map(deLinha);
}

export async function buscarCartaoPorSlug(slug: string): Promise<Cartao | null> {
  const { data, error } = await supabase
    .from("cartoes")
    .select(COLUNAS_CARTAO)
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar o cartão "${slug}": ${error.message}`);
  }

  return data ? deLinha(data as unknown as CartaoRow) : null;
}
