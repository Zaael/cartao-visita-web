import { z } from "zod";

/**
 * Contrato de dados do cartão — fonte de verdade para renderização.
 * Hoje é populado pelo script de seed; na Fase 4, pelo formulário do painel
 * escrevendo nas mesmas colunas. A UI não muda entre uma fase e outra.
 *
 * O schema Zod e o tipo TypeScript vivem no mesmo lugar de propósito: o seed
 * valida com o mesmo schema que o resto da app usa como tipo, então os dois
 * não têm como divergir.
 */

export const TIPOS_REDE_SOCIAL = [
  "instagram",
  "linkedin",
  "github",
  "site",
  "outro",
] as const;

const corHex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "use uma cor hex de 6 dígitos, ex: #3b82f6");

/**
 * Imagem: URL absoluta ou caminho a partir da raiz (`/foto.jpg`, servido de
 * `public/`). O caminho relativo existe porque as imagens ainda são arquivos do
 * repo — quando o Storage entrar na Fase 4, viram URL absoluta e o schema
 * continua valendo. Links externos (redes sociais) seguem exigindo URL completa.
 */
const imagem = z.union([
  z.url(),
  z.string().regex(/^\/[^\s]*$/, "use uma URL completa ou um caminho como /foto.jpg"),
]);

export const temaSchema = z.object({
  corPrimaria: corHex,
  corSecundaria: corHex.optional(),
  fonte: z.string().min(1).optional(),
});

export const contatoSchema = z.object({
  whatsapp: z.string().min(1).optional(),
  email: z.email().optional(),
  telefone: z.string().min(1).optional(),
  cidade: z.string().min(1).optional(),
});

export const redeSocialSchema = z.object({
  tipo: z.enum(TIPOS_REDE_SOCIAL),
  url: z.url(),
});

export const projetoSchema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  imagemUrl: imagem.optional(),
  link: z.url().optional(),
});

export const cartaoSchema = z.object({
  // O slug é a URL pública (/<slug>) e a chave única no banco.
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "só minúsculas, números e hífen simples entre palavras",
    ),
  publicado: z.boolean(),
  nome: z.string().min(1),
  especialidade: z.string().min(1),
  tagline: z.string().min(1).optional(),
  sobre: z.string().min(1).optional(),
  fotoPerfilUrl: imagem.optional(),
  logoUrl: imagem.optional(),
  tema: temaSchema,
  contato: contatoSchema,
  redesSociais: z.array(redeSocialSchema),
  projetos: z.array(projetoSchema),
  galeria: z.array(imagem),
});

export type Cartao = z.infer<typeof cartaoSchema>;
export type Tema = z.infer<typeof temaSchema>;
export type Contato = z.infer<typeof contatoSchema>;
export type RedeSocial = z.infer<typeof redeSocialSchema>;
export type Projeto = z.infer<typeof projetoSchema>;

// ---------------------------------------------------------------------------
// Mapeamento entre o contrato (camelCase) e as colunas do Postgres (snake_case)
// ---------------------------------------------------------------------------

/** Linha da tabela `cartoes` como o Postgres devolve. */
export interface CartaoRow {
  slug: string;
  publicado: boolean;
  nome: string;
  especialidade: string;
  tagline: string | null;
  sobre: string | null;
  foto_perfil_url: string | null;
  logo_url: string | null;
  tema: unknown;
  contato: unknown;
  redes_sociais: unknown;
  projetos: unknown;
  galeria: unknown;
}

/** Colunas que o seed e o painel selecionam — mantém a query e o mapper juntos. */
export const COLUNAS_CARTAO =
  "slug, publicado, nome, especialidade, tagline, sobre, foto_perfil_url, logo_url, tema, contato, redes_sociais, projetos, galeria";

export function paraLinha(cartao: Cartao) {
  return {
    slug: cartao.slug,
    publicado: cartao.publicado,
    nome: cartao.nome,
    especialidade: cartao.especialidade,
    tagline: cartao.tagline ?? null,
    sobre: cartao.sobre ?? null,
    foto_perfil_url: cartao.fotoPerfilUrl ?? null,
    logo_url: cartao.logoUrl ?? null,
    tema: cartao.tema,
    contato: cartao.contato,
    redes_sociais: cartao.redesSociais,
    projetos: cartao.projetos,
    galeria: cartao.galeria,
  };
}

/**
 * Converte a linha do banco no contrato, validando de novo.
 * O banco guarda JSONB — nada garante que o conteúdo continua no formato
 * esperado depois de uma edição manual no painel do Supabase.
 */
export function deLinha(row: CartaoRow): Cartao {
  return cartaoSchema.parse({
    slug: row.slug,
    publicado: row.publicado,
    nome: row.nome,
    especialidade: row.especialidade,
    tagline: row.tagline ?? undefined,
    sobre: row.sobre ?? undefined,
    fotoPerfilUrl: row.foto_perfil_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    tema: row.tema,
    contato: row.contato,
    redesSociais: row.redes_sociais,
    projetos: row.projetos,
    galeria: row.galeria,
  });
}
