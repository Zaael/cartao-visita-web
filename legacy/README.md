# Páginas do Gatsby ainda não portadas

Sobrou só o que depende da fase 1.5 (roteamento). Os componentes já foram
portados para `src/components/` na fase 1.4 e a pasta `legacy/components/`
foi apagada — o histórico do git guarda o original, se precisar comparar.

Estes arquivos ficam fora de `src/` porque `pages/` na raiz de um projeto Next
seria interpretado como Pages Router e entraria em conflito com o App Router.
`legacy/` está no `exclude` do `tsconfig.json` e no `globalIgnores` do
`eslint.config.mjs`.

| Arquivo | Destino |
| --- | --- |
| `pages/index.tsx` | `src/app/page.tsx` (vitrine) e `src/app/[slug]/page.tsx` (cartão) |
| `pages/404.tsx` | `src/app/not-found.tsx` |

Quando a fase 1.5 fechar, esta pasta some inteira.
