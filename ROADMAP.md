# Roadmap — Cartão de Visita Web

> To-do vivo: marque os itens conforme for concluindo. O "porquê" de cada decisão está em `docs/system-design.md` — este arquivo é só o "o quê" e "em que ordem".

## Fase 1 — Migração pra Next.js + Supabase (em andamento)

### 0. Preparação
- [x] Commitar o que já está em progresso no working tree atual (há bastante coisa não commitada: componentes, Docker, Tailwind — confira com `git status` antes de seguir, pra não perder nada)
- [x] Criar a branch `feat/migracao-nextjs` a partir da `main`
- [ ] Criar conta no Supabase e na Cloudflare, se ainda não tiver (os dois são grátis)

### 1.1 Setup do projeto Next.js
- [x] Criar o projeto com `npx create-next-app@latest` (App Router + TypeScript) — Next 16.2.12, na raiz do repo
- [x] Reinstalar `@mantine/core`, `@mantine/hooks`, `@fontsource/inter`, `@fontsource/poppins`, `react-icons`, `ogl` — Mantine veio na **9.5.1**, não na 8.3.18 (major novo; conferir breaking changes ao portar os componentes na 1.4)
- [x] Reconfigurar Tailwind 4 + `postcss-preset-mantine` + `postcss-simple-vars` (o `postcss.config.js` atual serve quase como está) — virou `postcss.config.mjs`, sem `autoprefixer` (o Tailwind 4 já resolve)
- [x] Portar `tailwind.config.js` sem o array `content: [...]` (redundante no Tailwind v4, que detecta automático) — as `fontFamily` foram para o bloco `@theme` do `globals.css` em vez de um config JS, e o arquivo foi apagado; ver "Sobre o CSS" no README
- [x] Portar `src/theme.ts` (tema base do Mantine) e `src/styles/global.css` → `src/app/globals.css`
- [x] Decidir: manter Docker pro dev ou simplificar pra `npm run dev` direto (deixou de ser estritamente necessário sem o Sharp do Gatsby) — **removido**; `Dockerfile`, `docker-compose.yml` e `.dockerignore` apagados
- [x] Definir a ordem das cascade layers entre Mantine e Tailwind (`tw-base → mantine → app-base → tw-components → tw-utilities`), senão o Mantine sobrescreve o `body` do projeto

### 1.2 Banco (Supabase)
- [x] Criar o projeto novo no Supabase
- [x] Rodar o SQL das tabelas `cartoes` e `assinaturas` (`docs/system-design.md`, seção 4) — as duas existem com as colunas da seção 4
- [ ] Ativar RLS e aplicar as duas policies — **`assinaturas` está sem RLS**, respondendo a quem tem só a publishable key (que vai no bundle do browser). Rodar [`supabase/migrations/0001_cartoes_assinaturas.sql`](supabase/migrations/0001_cartoes_assinaturas.sql) no SQL Editor; ele é idempotente e termina com uma query de conferência
- [x] Guardar as chaves em `.env.local` — nomes novos do Supabase (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY`), não mais anon/service_role; espelhados em `.env.example`
- [x] Confirmar que `.env.local` está no `.gitignore` — a service role key não pode vazar pro repo
- [x] Instalar `@supabase/supabase-js` e `@supabase/ssr`

### 1.3 Contrato de dados e seed
- [x] Criar `src/types/cartao.ts` com a interface `Cartao` — schema Zod + `type Cartao = z.infer<...>` (uma fonte só, sem risco de divergir) e os mappers camelCase ↔ snake_case
- [x] Criar `scripts/seed.ts` com validação Zod — roda com `npm run seed` (Node 24 executa TS direto, sem `tsx`); dados em `scripts/cartoes.ts`
- [x] Preencher o seed com os dados reais do seu cartão, substituindo o conteúdo hoje hardcoded em `resumoPerfil.tsx`/`detalhes.tsx` — habilidades e formação viraram texto em `sobre`, conforme decidido
- [x] Rodar o seed e conferir a linha criada no painel do Supabase — `/israel-santos` gravado e publicado, `usuario_id` null (esperado até a Fase 4)
- [ ] **Rodar `npm run seed` de novo** — a 1.4 acrescentou `fotoPerfilUrl` aos dados, então a linha no banco está defasada em relação a `src/data/cartoes.ts`

### 1.4 Portar os componentes visuais

> Concluída. Tudo vive em `src/components/`, com nomes normalizados em kebab-case. `legacy/components/` foi apagada.

- [x] Portar `Particles.tsx`/`Particles.css` (fundo com `ogl`) — virou `particles.tsx` com `"use client"` e tipagem real (o original tinha vários `any` implícitos que quebram sob `strict`). O `Particles.css` tinha 3 propriedades e virou classe Tailwind no próprio componente
- [x] Portar `ResumoPerfil`, `NavMenu`, `Cartao` — trocar dados hardcoded por props vindas do `Cartao`
- [x] Corrigir `redesSociais.tsx`: implementar de verdade e remover a versão duplicada dentro de `resumoPerfil.tsx` — agora é dirigido pelo array `redesSociais`, com `aria-label` por link
- [x] Implementar `CartaoBackView` (verso) — virou `cartao-verso.tsx`; o flip usa `preserve-3d` + `rotateY`, disparado por um `<button>` real, e a face escondida recebe `inert`
- [x] Trocar `StaticImage`/`gatsby-plugin-image` por `next/image` — a foto saiu de `src/images/` para `public/` e virou dado (`fotoPerfilUrl`), em vez de import hardcoded dentro do componente
- [x] Implementar a troca de seções do `NavMenu` — os 4 ícones eram `<a href="#">` sem efeito e `<Contatos />` estava comentado, ou seja, inacessível. Só aparecem as seções que têm conteúdo (Galeria some quando vazia)

### 1.5 Roteamento

- [x] Criar `app/page.tsx` (vitrine com os cartões publicados) — cada prévia usa as cores do próprio cartão
- [x] Criar `app/[slug]/page.tsx` com `generateStaticParams` + `generateMetadata` — `params` é `Promise` no Next 16, precisa de `await`
- [x] Escrever a query ao Supabase dentro do Server Component — `src/lib/cartoes.ts`, com a publishable key (quem filtra é o RLS)
- [x] Testar localmente: seu cartão respondendo em `/<seu-slug>` — `/` 200, `/israel-santos` 200 e pré-gerado no build, `/nao-existe` 404
- [x] Portar o 404 do Gatsby para `src/app/not-found.tsx` — reescrito em pt-BR (o original era o template padrão do Gatsby, em inglês)
- [x] Definir `metadataBase` — sem isso o Next resolve as imagens de OG contra `localhost`; vem de `NEXT_PUBLIC_SITE_URL`

### 1.6 Tema por cartão
- [x] Ler o `tema` do cartão no Server Component e injetar `--card-primary`/`--card-secondary` na raiz da página — em `src/components/tema-cartao.tsx`
- [x] Trocar as cores fixas de `.card`/`.card-border` em `global.css` por `var(--card-primary)` etc. — o fundo do `.card` sai de um `color-mix` da cor primária; os defaults ficam em `:root`, não como fallback dentro de cada `var()` (valor arbitrário do Tailwind com vírgula e `#` não gera regra que case)
- [x] Envolver o conteúdo num `MantineProvider` aninhado com esse tema — via `cssVariablesResolver`, sobrescrevendo `--mantine-primary-color-*`; assim a Timeline segue a cor do cartão sem precisar gerar uma paleta de 10 tons

### 1.7 Deploy
- [x] Instalar `@opennextjs/cloudflare` e o Wrangler CLI — 1.20.2 / 4.118.0; o adaptador exige `next >=16.2.11` e temos 16.2.12
- [x] Configurar `wrangler.toml` — virou `wrangler.jsonc` (formato atual). Sem R2: o template do adaptador liga o cache incremental em R2, que exige criar bucket e só faz sentido com ISR (Fase 4)
- [x] Rodar o build/preview local do adaptador e conferir se abre igual ao `next dev` — `npm run cf:preview` sobe o workerd; `/` 200, `/israel-santos` 200, `/nao-existe` 404 e a foto servida como asset estático
- [ ] Conectar o repo à Cloudflare (deploy automático a cada push) ou fazer o primeiro deploy manual — **precisa da sua conta**; `npx wrangler login` e depois `npm run cf:deploy`
- [ ] Definir as variáveis do Supabase no Worker (`npx wrangler secret put ...`) — rotas pré-geradas não precisam, mas um slug criado depois do build é renderizado sob demanda
- [ ] Preencher `NEXT_PUBLIC_SITE_URL` com a URL real, senão as imagens de OG apontam para `localhost`
- [ ] Confirmar o cartão no ar no subdomínio `*.workers.dev` — o nome do Worker está como `cartao-visita-web` no `wrangler.jsonc`, e é ele que define o subdomínio

### 1.8 Fechar a migração
- [x] Apagar o que sobrou específico do Gatsby (`gatsby-config.ts`, `gatsby-browser.tsx`, `gatsby-ssr.tsx`, `.cache/`) — mais `public/` (build antigo), `src/gatsby-types.d.ts`, `src/images/icon.png` (logo do Gatsby) e o `tsconfig.json`/`package.json` antigos
- [x] Atualizar o `README.md` com as novas instruções de setup (Next.js + Supabase, não mais Gatsby/Docker como pré-requisito)
- [ ] Abrir PR da branch `feat/migracao-nextjs` pra `main` e revisar o diff inteiro antes de mergear

## Fase 2 — SEO, tema completo, verso do cartão

- [ ] `sitemap.ts` e `robots.ts`
- [ ] OG image dinâmica por cartão (`opengraph-image.tsx`)
- [ ] Conferir o tema por cartão de ponta a ponta
- [ ] Flip do verso acessível por teclado (`aria-label`, foco visível)

## Fase 3 — Crescer até ~20 cartões

- [ ] Cadastrar 2–3 cartões de teste via seed (amigos/conhecidos)
- [ ] Configurar Cloudflare Web Analytics
- [ ] Ajustes finos de tema/visual com dados reais de mais de um cartão

## Fase 4 — Painel self-service

- [ ] Configurar Supabase Auth (magic link)
- [ ] Rota `/painel` autenticada
- [ ] Formulário de edição escrevendo nas mesmas colunas que o seed usa hoje
- [ ] Upload de foto/logo/galeria via Supabase Storage

## Fase 5 — Cobrança recorrente

- [ ] Criar conta no Asaas e configurar Pix Automático
- [ ] Endpoint de webhook de status de pagamento
- [ ] Lógica de período de carência antes de despublicar
- [ ] Tela de assinatura/upgrade
- [ ] Abrir cadastro público de verdade
