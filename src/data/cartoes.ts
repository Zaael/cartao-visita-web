import type { Cartao } from "../types/cartao.ts";

/**
 * Dados dos cartões — "código como fonte de verdade" até o painel da Fase 4.
 * O seed faz upsert por `slug`, então editar aqui e rodar de novo atualiza a linha.
 *
 * Conteúdo migrado do que estava hardcoded em legacy/components/resumoPerfil.tsx
 * e legacy/components/detalhes.tsx.
 */
export const cartoes: Cartao[] = [
  {
    slug: "israel-santos",
    publicado: true,
    nome: "Israel Santos",
    especialidade: "Analista de Desenvolvedor de Software",

    // Habilidades e formação não têm campo próprio no contrato `Cartao`, então
    // vivem aqui como texto. Os níveis vão em número (1–4) para não inventar
    // rótulos que o original não tinha — eram bolinhas preenchidas.
    sobre: [
      "27 anos, masculino, casado.",
      "Habilidades técnicas (nível 1–4): .NET 3, JS 3, SQL 3, WEB/API/MVC 3, GIT 3, Azure DevOps 2, SOLID 2.",
      "Soft skills (nível 1–4): Dedicação 4, Comunicação 4, Inglês 3, Curiosidade 3, Trabalho em Equipe 3, Proatividade 3, CleanCode 2.",
      "Formação: Tecnólogo em Análise e Desenvolvimento de Sistemas — Faculdade Impacta de Tecnologia (2018–2019).",
    ].join("\n\n"),

    // Cores tiradas do gradiente de `.card-border` no globals.css
    // (blue-500 → purple-500).
    tema: {
      corPrimaria: "#3b82f6",
      corSecundaria: "#a855f7",
    },

    contato: {
      email: "zaael.dev@gmail.com",
      telefone: "(11) 97776-3646",
      cidade: "São Paulo - SP",
    },

    redesSociais: [
      { tipo: "linkedin", url: "https://linkedin.com/in/israel-souto" },
      { tipo: "github", url: "https://github.com/israel-souto" },
      { tipo: "instagram", url: "https://instagram.com/israel_souto" },
    ],

    // Vinham da Timeline em detalhes.tsx. As descrições são as originais —
    // valem uma reescrita antes de publicar.
    projetos: [
      { titulo: "Indra", descricao: "Trabalhei na Indra" },
      { titulo: "MPS", descricao: "Trabalhei no MPS" },
      { titulo: "Minsait", descricao: "Trabalhei no Minsait" },
    ],

    galeria: [],

    // Servida de `public/`. Vira URL do Storage na Fase 4.
    fotoPerfilUrl: "/Zael_perfil.jpg",
  },
];
