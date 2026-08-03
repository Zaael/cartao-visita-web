import type { Cartao } from "../types/cartao.ts";

/**
 * Dados dos cartões — "código como fonte de verdade" até o painel da Fase 4.
 * O seed faz upsert por `slug`, então editar aqui e rodar de novo atualiza a linha.
 *
 * Conteúdo alinhado ao currículo de 2026-08 ("Curriculo - Israel Santos.pdf").
 * A estrutura veio da migração de legacy/components/{resumoPerfil,detalhes}.tsx.
 */
export const cartoes: Cartao[] = [
  {
    slug: "israel-santos",
    publicado: true,
    nome: "Israel Santos",
    especialidade: "Desenvolvedor Fullstack Sênior",
    tagline: "Sistemas corporativos de alta carga de dados, do requisito à entrega.",

    // Habilidades, formação e idiomas não têm campo próprio no contrato
    // `Cartao`, então vivem aqui como texto — um parágrafo por bloco do
    // currículo, na mesma ordem em que aparecem lá.
    sobre: [
      "Desenvolvedor fullstack sênior com 8 anos de experiência em sistemas corporativos de alta carga de dados. Atuo com papel consultivo — do levantamento de requisitos junto ao cliente até a entrega, testes e documentação, incluindo visitas presenciais para entender regras de negócio e cultura de cada empresa.",
      "Trajetória construída na Indra Company, MPS Informática e Minsait, sempre aplicando Clean Code, SOLID e boas práticas de performance em sistemas com grande volume de dados.",
      "Habilidades técnicas: .NET, C#, JavaScript, SQL, Web/API/MVC, Git, Azure DevOps, SOLID, Clean Code e Scrum.",
      "Competências comportamentais: proatividade, curiosidade, comunicação, dedicação e trabalho em equipe.",
      "Formação: Tecnólogo em Análise e Desenvolvimento de Sistemas — Faculdade Impacta de Tecnologia (2018–2019).",
      "Idiomas: português nativo, inglês intermediário e espanhol básico.",
    ].join("\n\n"),

    // Cores tiradas do gradiente de `.card-border` no globals.css
    // (blue-500 → purple-500).
    tema: {
      corPrimaria: "#3b82f6",
      corSecundaria: "#a855f7",
    },

    contato: {
      email: "israelsouto.s@gmail.com",
      telefone: "(11) 97776-3646",
      cidade: "São Paulo - SP",
    },

    redesSociais: [
      { tipo: "linkedin", url: "https://linkedin.com/in/israel-souto" },
      { tipo: "github", url: "https://github.com/israel-souto" },
      { tipo: "instagram", url: "https://instagram.com/israel_souto" },
    ],

    // Renderizados como Timeline em detalhes.tsx. É a experiência profissional
    // do currículo, do mais recente para o mais antigo; o período abre a
    // descrição porque o título da Timeline é uma linha só.
    projetos: [
      {
        titulo: "WiseTech — Fullstack Developer Sênior",
        descricao:
          "Mar/2026 – Atual · Levantamento e definição de requisitos junto ao cliente, implementação de melhorias e correções, testes e documentação. Visitas presenciais para entender regras de negócio, cultura da empresa e dores do dia a dia, atuando como ponte entre a necessidade de negócio e a solução técnica.",
      },
      {
        titulo: "Minsait (Indra Company) — Analista de Sistemas Pleno",
        descricao:
          "Out/2023 – Jan/2026 · Retorno à Indra em papel mais técnico, aplicando inovações em projetos já conhecidos. Apoio na definição de práticas, tecnologias e metodologias para novos projetos, além do desenvolvimento e manutenção de sistemas web corporativos e fluxos de aprovação (workflow).",
      },
      {
        titulo: "MPS Informática — Analista de Sistemas Júnior",
        descricao:
          "Mar/2022 – Ago/2023 · Criação e manutenção de sistemas internos do cliente em .NET C#, com Scrum e Azure DevOps. Análise de requisitos e definição da melhor abordagem técnica, com práticas de clean code e foco em alta performance para sistemas com grande carga de dados.",
      },
      {
        titulo: "Indra Company — Trainee / Analista de Sistemas Jr",
        descricao:
          "Fev/2019 – Fev/2022 · Prestação de serviços para a Editora Moderna: criação, manutenção e suporte a sistemas web. Desenvolvimento e manutenção de fluxos de aprovação (workflow) e scripts de relatórios e cargas de dados, em projetos conduzidos com Scrum.",
      },
    ],

    galeria: [],

    // Servida de `public/`. Vira URL do Storage na Fase 4.
    fotoPerfilUrl: "/Zael_perfil.jpg",
  },
];
