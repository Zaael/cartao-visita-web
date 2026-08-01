# System Design — Cartão de Visita Web

> Documento vivo. Revisitar conforme os gatilhos da seção 13 ou ao iniciar uma nova fase da seção 14.

## 1. Escopo e decisões travadas

Mudança de rumo importante: como o projeto ainda tem pouquíssimo código, decidimos ir direto pra arquitetura final (Next.js + Postgres) em vez de passar por um site estático em Gatsby/MDX primeiro. Self-service e assinatura paga não são mais hipóteses distantes — fazem parte do plano confirmado, só sequenciadas em fases.

| Eixo | Decisão |
|---|---|
| Arquitetura | Next.js (App Router) + Postgres via Supabase, desde a Fase 1 |
| Hosting | Cloudflare Workers (via OpenNext), gratuito em todas as fases, sem trava de uso comercial |
| Edição de conteúdo (Fase 1–3) | Script de seed tipado — mesma tabela que o painel vai usar depois |
| Escala alvo (6–12 meses) | Até ~20 cartões |
| Orçamento de infra | Zero |
| Prazo | Sem pressa, projeto paralelo |
| Rumo confirmado | Painel self-service (Fase 4) e assinatura mensal de R$10–15 (Fase 5) |

Não-objetivos da Fase 1 especificamente (não pra sempre, só ainda não): login do prestador, painel de edição, cobrança. A base de dados já nasce pronta pra isso — o que falta é sequenciamento de entrega, não decisão arquitetural.

## 2. O que muda em relação ao esqueleto atual

O projeto hoje é Gatsby 5 + React 18 + TypeScript, Mantine 8, Tailwind 4 (via `postcss-preset-mantine`), Docker pro dev, `ogl` (fundo de partículas), `react-icons`. Uma página única e hardcoded, sem rotas dinâmicas, sem fonte de dados.

**O que se aproveita:** os componentes React (`Cartao`, `ResumoPerfil`, `NavMenu`, `detalhes.tsx`), o design visual, a configuração Tailwind+Mantine (funciona igual em Next.js), o fundo de partículas com `ogl`, as fontes via Fontsource. É trabalho de UI que não se perde — só muda o que alimenta esses componentes com dados e como as rotas são geradas.

**O que é substituído:** tudo que é específico do Gatsby — `gatsby-config.ts`, a camada de dados GraphQL, `gatsby-plugin-image`/`sharp` (viram `next/image`), o modelo de página única. Não existe `gatsby-node.ts` ainda, então não há nada de roteamento dinâmico pra desmontar.

**Bugs da auditoria anterior que se resolvem de graça durante a migração** (porque os componentes são reescritos de qualquer forma): `redesSociais.tsx` vazio mas importado em `detalhes.tsx`, e a implementação duplicada de `RedesSociais` dentro de `resumoPerfil.tsx`. A duplicidade de pastas `component/`/`components/` apontada antes já foi resolvida no working tree atual — conferi de novo e não precisa mais entrar no checklist.

**Docker:** deixa de ser estritamente necessário — o `Dockerfile` atual existe principalmente por causa da compilação nativa do `sharp` pro Gatsby; `next dev` roda liso sem isso. Pode manter por familiaridade com o fluxo atual, ou simplificar pra `npm run dev` direto — decisão de conforto, não técnica.

## 3. Arquitetura de alto nível

Next.js (App Router) como framework full-stack — Server Components consultam o Postgres direto (via Supabase), sem precisar de uma camada de API separada pra esse nível de escala. Supabase fornece Postgres + Auth + Storage no mesmo lugar. Deploy no Cloudflare Workers via `@opennextjs/cloudflare` (adaptador que atingiu 1.0 GA em fevereiro de 2026, compila um build padrão do Next.js 14/15 pra rodar em Workers com suporte a SSR, ISR, middleware e `next/image` sem precisar reescrever a aplicação). (Fonte: opennext.js.org/cloudflare.)

Páginas públicas de cartão usam ISR (regeneração sob demanda via `revalidatePath` quando um cartão é salvo) — continuam rápidas e "quase estáticas" mesmo vindo de banco. O painel (Fase 4) é a parte genuinamente dinâmica, atrás de autenticação.

Princípio que se mantém do design anterior: o contrato `Cartao` (seção 4) é a fonte de verdade pra renderização. Hoje ele é populado por um script de seed; na Fase 4, pelo mesmo formulário do painel escrevendo nas mesmas colunas. A UI não muda entre uma fase e outra.

## 4. Modelo de dados

Postgres via Supabase, desde a Fase 1:

```sql
create table cartoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id),      -- null até a Fase 4 existir
  slug text unique not null,
  publicado boolean not null default false,
  nome text not null,
  especialidade text not null,
  tagline text,
  sobre text,
  foto_perfil_url text,
  logo_url text,
  tema jsonb not null default '{}',                -- { corPrimaria, corSecundaria, fonte }
  contato jsonb not null default '{}',              -- { whatsapp, email, telefone, cidade }
  redes_sociais jsonb not null default '[]',        -- [{ tipo, url }]
  projetos jsonb not null default '[]',             -- [{ titulo, descricao, imagemUrl, link }]
  galeria jsonb not null default '[]',               -- [url, url, ...]
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) unique,
  provedor_subscription_id text,
  status text not null default 'sem_assinatura',    -- sem_assinatura | ativa | atrasada | cancelada
  periodo_atual_fim timestamptz
);

alter table cartoes enable row level security;
create policy "Cartão publicado é visível a todos" on cartoes for select using (publicado = true);
create policy "Dono gerencia o próprio cartão" on cartoes for all using (auth.uid() = usuario_id);
```

Campos compostos (`tema`, `contato`, `redes_sociais`, `projetos`, `galeria`) ficam em JSONB em vez de tabelas normalizadas — mantém o schema simples na escala de ~20 cartões. Revisitar (seção 13) se um dia precisar filtrar/buscar por dentro de `projetos` ou `galeria` com frequência.

RLS garante, no nível do banco, que um cartão só é visível publicamente se `publicado = true`, e só o dono edita o próprio — vale mesmo antes de existir painel, porque protege contra escrita indevida assim que houver mais de um `usuario_id` real.

Contrato TypeScript (o que os componentes React consomem — estável entre seed script e painel):

```typescript
// src/types/cartao.ts
export interface Cartao {
  slug: string;
  publicado: boolean;
  nome: string;
  especialidade: string;
  tagline?: string;
  sobre?: string;
  fotoPerfilUrl?: string;
  logoUrl?: string;
  tema: { corPrimaria: string; corSecundaria?: string; fonte?: string };
  contato: { whatsapp?: string; email?: string; telefone?: string; cidade?: string };
  redesSociais: { tipo: "instagram" | "linkedin" | "github" | "site" | "outro"; url: string }[];
  projetos: { titulo: string; descricao: string; imagemUrl?: string; link?: string }[];
  galeria: string[];
}
```

## 5. Roteamento e páginas (Next.js App Router)

```
app/
├── page.tsx                  # "/" — vitrine com os cartões publicados
├── [slug]/
│   ├── page.tsx               # rota pública do cartão
│   └── opengraph-image.tsx    # OG image dinâmica (opcional)
├── sitemap.ts
└── robots.ts
```

`app/[slug]/page.tsx` usa `generateStaticParams()` pra pré-gerar os slugs publicados no build, e `generateMetadata()` pra meta tags/OG dinâmicas a partir dos dados do cartão (nome, tagline, foto) — importante porque cada rota é feita pra ser compartilhada como link de perfil, igual LinkedIn/Instagram, conforme a ideia original.

`/` (a URL principal) lista os cartões `publicado = true` — a vitrine digital da caixinha de cartões de visita, igual desenhado antes.

## 6. Estrutura da página do cartão e tema

Mantendo a metáfora física, dentro de uma única rota `/slug`:

**Frente**: `ResumoPerfil` (foto, nome, especialidade) + `NavMenu` como âncoras/abas — não sub-rotas — alternando entre Sobre / Projetos / Galeria / Contato dentro da mesma página.

**Verso**: logo do prestador e, opcionalmente, um botão "salvar contato" gerando um `.vcf` no client.

**Flip**: transição 3D via `transform-style: preserve-3d` + `rotateY`, disparada por um `<button aria-label="Virar cartão">` real — acessível via teclado.

**Tema por cartão**: o Server Component de `app/[slug]/page.tsx` já tem o `tema` do cartão (veio da mesma query ao Postgres). O layout injeta CSS custom properties (`--card-primary`, `--card-secondary`) na raiz da página e envolve o conteúdo num `MantineProvider` aninhado com esse tema — mesmo mecanismo confirmado antes (provider aninhado não herda do pai, aceita `cssVariablesResolver`), só que agora a leitura do tema vem de uma query, não de `pageContext` do Gatsby.

## 7. Conteúdo e autenticação

**Fase 1–3 — script de seed**: `scripts/seed.ts`, um script Node tipado que faz upsert direto no Supabase usando a *service role key* (chave de admin do Supabase — bypassa RLS por design, por isso só roda em ambiente confiável/local, nunca no client). Os dados partem de objetos TypeScript no próprio repo — mesmo espírito de "código como fonte" que você escolheu originalmente, só que gravando em banco em vez de arquivo MDX. Validação com Zod antes do upsert, reaproveitando o mesmo schema do contrato `Cartao`.

**Fase 4 — painel self-service**: rota autenticada (`/painel`) via Supabase Auth (magic link — sem senha pra esquecer, bom pro público-alvo). O formulário edita as mesmas colunas que o seed script grava. Upload de foto/logo/galeria vai direto pro Supabase Storage. Nenhuma mudança de schema nesse momento — só um segundo "escritor" além do seed script.

## 8. Cobrança recorrente (Fase 5)

Pesquisei as opções mais realistas pro público (MEI/autônomos brasileiros) e ticket baixo (R$10–15/mês):

- **Asaas** — nativo brasileiro, feito pra cobrança recorrente. Lançou em janeiro de 2026 o Pix Automático (débito recorrente via Pix), com taxa de 0,22%–0,35% direto ou 0,28%–0,99% via PSP como o próprio Asaas — bem mais eficiente que taxa fixa num ticket de R$10–15. PIX avulso cobra R$0,99–1,99 por cobrança paga; cartão recorrente cobra 2,99% + R$0,49. Vale configurar a recorrência via Pix Automático especificamente, não cobrança avulsa.
- **Stripe** — ótima DX, mas hoje não tem PIX recorrente nativo (só avulso/manual); cobrança automática mensal ficaria dependente de cartão de crédito, o que pode excluir parte do público que prefere Pix.
- **Mercado Pago** — outra opção brasileira confiável com assinaturas recorrentes; vale cotar taxas atuais junto do Asaas antes de decidir.

Recomendação de partida: **Asaas**, pelo Pix Automático encaixar no ticket baixo e no público que provavelmente prefere Pix a cartão.

**Estado da assinatura → estado do cartão**, via webhook do provedor escolhido: pagamento confirmado → `assinaturas.status = 'ativa'` → cartão elegível pra ficar `publicado`. Atraso → `'atrasada'`, com período de carência antes de despublicar (não tirar do ar na primeira falha). Cancelamento → despublica, mas mantém os dados (permite reativar sem perder o cartão).

## 9. Ferramentas extras recomendadas

- `@supabase/supabase-js` + `@supabase/ssr` — cliente Supabase adaptado pra Server Components do Next.js.
- `zod` — validação do seed script e, depois, do formulário do painel.
- `next/image` configurado com `images.remotePatterns` apontando pro domínio do Supabase Storage.
- `sitemap.ts` / `robots.ts` / `generateMetadata` nativos do Next.js — dispensam plugins externos de SEO.
- `scripts/seed.ts` — o "CMS" da Fase 1–3, versionado no Git.
- Cloudflare Web Analytics — gratuito, sem cookies.
- Playwright (a partir de ~10 cartões) — smoke test visitando cada rota gerada.
- Wrangler CLI — deploy e preview local do build adaptado pelo OpenNext.

## 10. Deploy e infraestrutura

**Cloudflare Workers** via `@opennextjs/cloudflare`: compila o build padrão do Next.js pra rodar em Workers, com Wrangler cuidando de deploy e preview local. Free tier: 100 mil requisições/dia — bastante folga pra ~20 cartões — e, diferente da Vercel, sem cláusula de proibição de uso comercial no plano gratuito, então continua servindo de graça mesmo depois que a Fase 5 (cobrança) entrar no ar.

**Domínio**: como o hosting já é Cloudflare, colocar um domínio próprio depois é a integração mais direta possível — DNS e hosting no mesmo lugar. Subdomínio `*.workers.dev` grátis serve pra começar; domínio próprio (~R$40–60/ano) é o único custo real do projeto, fora do orçamento de infra.

**Supabase**: free tier cobre Postgres + Auth + Storage nessa escala. Atenção: projetos gratuitos pausam depois de 7 dias sem atividade (dados ficam salvos, só precisa reativar no painel do Supabase com um clique) — dado o ritmo "sem pressa", isso vai acontecer de vez em quando.

## 11. Escala e confiabilidade

Com ~20 cartões, ISR mantém as páginas públicas rápidas mesmo vindo de banco — a maior parte do tráfego nem toca o Postgres, serve do cache do Workers. Cold start de Workers está na casa de poucos milissegundos, então SSR nas rotas que precisam ser dinâmicas (o painel, futuramente) também fica rápido. Validação de dados no seed script (Zod) evita que um cartão mal formatado quebre em produção. Backup: o free tier do Supabase não tem point-in-time recovery — o próprio `scripts/seed.ts`, versionado no Git, já funciona como uma cópia reproduzível do conteúdo da Fase 1–3; vale considerar um export periódico do banco assim que o painel (Fase 4) passar a ser a fonte principal de edições.

## 12. Trade-offs explícitos

**Ir direto pra Next.js + Postgres vs. começar simples em Gatsby + MDX** — escolhido: ir direto. Quase não havia código existente pra "proteger", e a plataforma paga já é destino confirmado, não hipótese — isso evita uma migração de framework inteira mais tarde. Contra: mais peças em movimento desde o dia 1 (banco, RLS, adaptador de deploy) pra quem só queria ver o próprio cartão no ar rápido.

**Cloudflare Workers vs. Vercel** — escolhido Cloudflare pelo custo zero permanente e ausência de trava de uso comercial (a Vercel proíbe integração de cobrança no plano Hobby gratuito). Contra: a integração da Vercel com Next.js é nativa (é a empresa por trás do framework); o adaptador OpenNext, embora tenha chegado a 1.0 GA em fevereiro de 2026, ainda é mais novo que essa integração.

**JSONB vs. tabelas normalizadas** para tema/contato/projetos/galeria — escolhido JSONB pra manter o schema simples na escala de ~20 cartões. Revisitar se precisar filtrar/buscar com frequência por dentro desses campos.

## 13. Quando revisitar

- **Seed script virou gargalo** (edições demoram demais pra ir pro ar) → é justamente o sinal de que a Fase 4 (painel) já deveria ter começado.
- **JSONB não aguenta mais** (precisa buscar/filtrar por projetos ou tags com frequência) → normalizar essas colunas em tabelas próprias — o contrato `Cartao` não muda, só a query que o popula.
- **Galeria cresce muito** (muitas imagens, muitos cartões) → Supabase Storage já resolve isso desde o início (diferente do approach antigo em Git), mas vale revisitar o plano pago do Supabase se o volume ultrapassar o free tier.
- **Algum recurso do Next.js não for bem suportado pelo Workers** (caso raro, dado que o OpenNext já é GA) → reavaliar Vercel Pro como alternativa pontual.

## 14. Roadmap sugerido

1. **Fase 1** — base: projeto Next.js + Supabase (schema, RLS), portar os componentes visuais do esqueleto atual corrigindo os bugs da auditoria (seção 2), contrato `Cartao`, rotas `/` e `/[slug]`, script de seed com o cartão do Zael, deploy no Cloudflare Workers.
2. **Fase 2** — SEO (sitemap/robots/OG dinâmico), tema por cartão funcionando de ponta a ponta, implementar o verso do cartão.
3. **Fase 3** — cadastrar 2–3 cartões de teste via seed (amigos/conhecidos), crescer até a faixa de ~20, analytics, ajuste fino visual.
4. **Fase 4** — Supabase Auth + painel de edição self-service + upload via Storage. Cartões continuam gratuitos — o objetivo é validar a UX de edição antes de cobrar por ela.
5. **Fase 5** — cobrança recorrente (Asaas), webhook de status, período de carência, tela de assinatura. Só depois disso o cadastro público abre de verdade.
