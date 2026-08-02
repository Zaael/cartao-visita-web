import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FundoParticulas from "@/components/fundo-particulas";
import { listarCartoesPublicados } from "@/lib/cartoes";
import type { Cartao } from "@/types/cartao";

export const metadata: Metadata = {
  title: "Cartão de Visita",
  description: "A caixinha de cartões de visita, na versão web.",
};

export default async function Vitrine() {
  const cartoes = await listarCartoesPublicados();

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-10 py-12">
      <FundoParticulas />

      <header className="text-center">
        <h1>Cartões</h1>
        <h2>A caixinha de cartões de visita, na versão web</h2>
      </header>

      {cartoes.length === 0 ? (
        <p className="text-slate-400">Nenhum cartão publicado ainda.</p>
      ) : (
        <ul className="grid w-full max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {cartoes.map((cartao) => (
            <li key={cartao.slug}>
              <Previa cartao={cartao} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function Previa({ cartao }: { cartao: Cartao }) {
  return (
    <Link
      href={`/${cartao.slug}`}
      // Cada prévia usa as cores do próprio cartão, então a vitrine já mostra
      // que os cartões são visualmente distintos entre si.
      style={
        {
          "--card-primary": cartao.tema.corPrimaria,
          "--card-secondary": cartao.tema.corSecundaria ?? cartao.tema.corPrimaria,
        } as React.CSSProperties
      }
      className="card-border block transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--card-primary)]"
    >
      <div className="card flex h-full flex-col items-center gap-2 py-6 text-center">
        {cartao.fotoPerfilUrl ? (
          <Image
            src={cartao.fotoPerfilUrl}
            alt=""
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-slate-700" />
        )}

        <span className="font-sans text-lg font-bold">{cartao.nome}</span>
        <span className="text-sm text-slate-400">{cartao.especialidade}</span>
        {cartao.contato.cidade && (
          <span className="text-xs text-slate-500">{cartao.contato.cidade}</span>
        )}
      </div>
    </Link>
  );
}
