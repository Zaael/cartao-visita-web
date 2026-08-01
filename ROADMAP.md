# Roadmap — Cartão de Visita Web

> To-do vivo: marque os itens conforme for concluindo. O "porquê" de cada decisão está em `docs/system-design.md` — este arquivo é só o "o quê" e "em que ordem".

## Fase 1 — Migração pra Next.js + Supabase (em andamento)

### 0. Preparação
- [ ] Commitar o que já está em progresso no working tree atual (há bastante coisa não commitada: componentes, Docker, Tailwind — confira com `git status` antes de seguir, pra não perder nada)
- [ ] Criar a branch `feat/migracao-nextjs` a partir da `main`
- [ ] Criar conta no Supabase e na Cloudflare, se ainda não tiver (os dois são grátis)

### 1.1 Setup do projeto Next.js
- [ ] Criar o projeto com `npx create-next-app@latest` (App Router + TypeScript)
- [ ] Reinstalar `@mantine/core`, `@mantine/hooks`, `@fontsource/inter`, `@fontsource/poppins`, `react-icons`, `ogl`
- [ ] Reconfigurar Tailwind 4 + `postcss-preset-mantine` + `postcss-simple-vars` (o `postcss.config.js` atual serve quase como está)
- [ ] Portar `tailwind.config.js` sem o array `content: [...]` (redundante no Tailwind v4, que detecta automático)
- [ ] Portar `src/theme.ts` (tema base do Mantine) e `src/styles/global.css`
- [ ] Decidir: manter Docker pro dev ou simplificar pra `npm run dev` direto (deixou de ser estritamente necessário sem o Sharp do Gatsby)

### 1.2 Banco (Supabase)
- [ ] Criar o projeto novo no Supabase
- [ ] Rodar o SQL das tabelas `cartoes` e `assinaturas` (`docs/system-design.md`, seção 4)
- [ ] Ativar RLS e aplicar as duas policies
- [ ] Guardar `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` em `.env.local`
- [ ] Confirmar que `.env.local` está no `.gitignore` — a service role key não pode vazar pro repo
- [ ] Instalar `@supabase/supabase-js` e `@supabase/ssr`

### 1.3 Contrato de dados e seed
- [ ] Criar `src/types/cartao.ts` com a interface `Cartao`
- [ ] Criar `scripts/seed.ts` com validação Zod
- [ ] Preencher o seed com os dados reais do seu cartão, substituindo o conteúdo hoje hardcoded em `resumoPerfil.tsx`/`detalhes.tsx`
- [ ] Rodar o seed e conferir a linha criada no painel do Supabase

### 1.4 Portar os componentes visuais
- [ ] Portar `Particles.tsx`/`Particles.css` (fundo com `ogl`) — já vivem em `src/components/`+`src/styles/`, só migrar o import
- [ ] Portar `ResumoPerfil`, `NavMenu`, `Cartao` — trocar dados hardcoded por props vindas do `Cartao`
- [ ] Corrigir `redesSociais.tsx`: implementar de verdade e remover a versão duplicada dentro de `resumoPerfil.tsx`
- [ ] Implementar `CartaoBackView` (verso) — hoje o arquivo está vazio
- [ ] Trocar `StaticImage`/`gatsby-plugin-image` por `next/image`

### 1.5 Roteamento
- [ ] Criar `app/page.tsx` (vitrine com os cartões publicados)
- [ ] Criar `app/[slug]/page.tsx` com `generateStaticParams` + `generateMetadata`
- [ ] Escrever a query ao Supabase dentro do Server Component
- [ ] Testar localmente: seu cartão respondendo em `/<seu-slug>`

### 1.6 Tema por cartão
- [ ] Ler o `tema` do cartão no Server Component e injetar `--card-primary`/`--card-secondary` na raiz da página
- [ ] Trocar as cores fixas de `.card`/`.card-border` em `global.css` por `var(--card-primary)` etc.
- [ ] Envolver o conteúdo num `MantineProvider` aninhado com esse tema

### 1.7 Deploy
- [ ] Instalar `@opennextjs/cloudflare` e o Wrangler CLI
- [ ] Configurar `wrangler.toml`
- [ ] Rodar o build/preview local do adaptador e conferir se abre igual ao `next dev`
- [ ] Conectar o repo à Cloudflare (deploy automático a cada push) ou fazer o primeiro deploy manual
- [ ] Confirmar o cartão no ar no subdomínio `*.workers.dev`

### 1.8 Fechar a migração
- [ ] Apagar o que sobrou específico do Gatsby (`gatsby-config.ts`, `gatsby-browser.tsx`, `gatsby-ssr.tsx`, `.cache/`)
- [ ] Atualizar o `README.md` com as novas instruções de setup (Next.js + Supabase, não mais Gatsby/Docker como pré-requisito)
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
