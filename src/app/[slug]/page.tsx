import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Cartao from "@/components/cartao";
import FundoParticulas from "@/components/fundo-particulas";
import TemaCartao from "@/components/tema-cartao";
import { buscarCartaoPorSlug, listarCartoesPublicados } from "@/lib/cartoes";

type Props = { params: Promise<{ slug: string }> };

/** Pré-gera no build uma rota para cada cartão publicado. */
export async function generateStaticParams() {
  const cartoes = await listarCartoesPublicados();
  return cartoes.map((cartao) => ({ slug: cartao.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cartao = await buscarCartaoPorSlug(slug);

  if (!cartao) {
    return { title: "Cartão não encontrado" };
  }

  const titulo = `${cartao.nome} — ${cartao.especialidade}`;
  // Cada rota existe para ser compartilhada como link de perfil, então a
  // descrição precisa dizer algo mesmo quando não há tagline.
  const descricao =
    cartao.tagline ?? cartao.sobre?.split("\n\n")[0] ?? cartao.especialidade;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: "profile",
      images: cartao.fotoPerfilUrl ? [cartao.fotoPerfilUrl] : undefined,
    },
    twitter: {
      card: "summary",
      title: titulo,
      description: descricao,
    },
  };
}

export default async function PaginaCartao({ params }: Props) {
  const { slug } = await params;
  const cartao = await buscarCartaoPorSlug(slug);

  if (!cartao) {
    notFound();
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center">
      <FundoParticulas />
      <TemaCartao tema={cartao.tema}>
        <Cartao cartao={cartao} />
      </TemaCartao>
    </main>
  );
}
