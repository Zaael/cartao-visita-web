# 🪪 Cartão de Visita Web

> Um currículo diferente — inspirado nos clássicos cartõezinhos físicos de serviços, agora na versão web.

---

## 💡 Sobre o Projeto

O **Cartão de Visita Web** resgata a nostalgia dos cartõezinhos físicos que
eram comuns antigamente — aqueles que você recebia de eletricistas, encanadores,
dentistas — e traz essa experiência para a web.

Em vez de um currículo tradicional e genérico, cada pessoa ganha uma página
própria em `/<slug>`, com informações profissionais apresentadas de forma
compacta, direta e visualmente marcante — como um cartão de visita de verdade.

O plano completo (banco, temas por cartão, painel self-service e assinatura)
está em [`docs/system-design.md`](docs/system-design.md); a ordem de execução,
em [`ROADMAP.md`](ROADMAP.md).

---

## 🛠️ Tecnologias

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Compiler)
- [React 19](https://react.dev/)
- [Supabase](https://supabase.com/) — Postgres, Auth e Storage
- [Mantine 9](https://mantine.dev/) — biblioteca de componentes
- [Tailwind CSS 4](https://tailwindcss.com/) — utilities, via `postcss-preset-mantine`
- [Fontsource](https://fontsource.org/) — Inter e Poppins auto-hospedadas
- [ogl](https://github.com/oframe/ogl) — fundo de partículas em WebGL
- [Cloudflare Workers](https://workers.cloudflare.com/) via [OpenNext](https://opennext.js.org/cloudflare) — hospedagem

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- Uma conta no [Supabase](https://supabase.com/) (plano gratuito)

> Docker deixou de ser necessário: ele existia por causa da compilação nativa do
> `sharp` no Gatsby. Com o Next.js, `npm run dev` roda direto.

### Subindo o projeto

```bash
npm install
```

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com as credenciais do seu projeto Supabase
(Project Settings → API). O `.env.local` é ignorado pelo git — a
`SUPABASE_SERVICE_ROLE_KEY` ignora o RLS e nunca pode ir para o repositório.

```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).

### Outros comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Valida `src/data/cartoes.ts` e grava no Supabase |
| `npm run cf:preview` | Build do adaptador + roda no runtime do Cloudflare (workerd) |
| `npm run cf:deploy` | Build do adaptador + deploy (exige `npx wrangler login`) |

---

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── app/            # App Router — layout, "/", "/[slug]", not-found
│   ├── components/     # Componentes do cartão
│   ├── data/           # Dados dos cartões (entrada do seed)
│   ├── lib/            # Cliente do Supabase e acesso aos cartões
│   ├── types/          # Contrato `Cartao` (schema Zod + tipo)
│   └── theme.ts        # Tema base do Mantine
├── scripts/seed.ts     # Grava os cartões no Supabase
├── supabase/migrations/ # SQL das tabelas e das policies de RLS
├── public/             # Imagens servidas direto
├── legacy/             # Páginas do Gatsby ainda não portadas
├── docs/               # System design
├── ROADMAP.md
└── postcss.config.mjs  # Tailwind + postcss-preset-mantine + simple-vars
```

### Como os dados chegam na tela

`src/data/cartoes.ts` → `npm run seed` (valida com Zod, grava no Postgres) →
Server Component consulta via `src/lib/cartoes.ts` → componentes recebem um
objeto `Cartao` por props. Na Fase 4 o painel escreve nas mesmas colunas que o
seed, e nada a jusante muda.

O RLS é que garante que só cartão com `publicado = true` aparece — por isso a
app usa a publishable key, não a secret.

### Tema por cartão

A coluna `tema` vira `--card-primary` / `--card-secondary` num wrapper por
página (`src/components/tema-cartao.tsx`), que também repassa essas cores ao
Mantine por `cssVariablesResolver`. Os valores padrão ficam em `:root`, no
`globals.css` — evite `var(--card-primary, #fallback)` dentro de classe
arbitrária do Tailwind, porque a vírgula e o `#` quebram a geração da regra.

### Sobre o CSS

`src/app/globals.css` declara a ordem das cascade layers, e essa ordem importa:

```
tw-base → mantine → app-base → tw-components → tw-utilities
```

O preflight do Tailwind vem **antes** do Mantine (para não zerar o que ele
define), enquanto os estilos do projeto e as utilities vêm **depois** (para
conseguirem sobrescrever os componentes). Ao adicionar CSS novo, coloque-o na
layer correta — fora de qualquer layer, ele ganha de tudo.

As fontes são importadas peso a peso (o `index.css` do Fontsource traz só o
400). Ao usar um peso novo, adicione o import correspondente em `globals.css`.

---

## 📄 Licença

Este projeto é de uso pessoal. Sinta-se à vontade para se inspirar. 🙂
