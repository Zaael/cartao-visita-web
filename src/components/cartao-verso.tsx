import Image from "next/image";
import type { Cartao } from "@/types/cartao";
import RedesSociais from "./redes-sociais";

/**
 * Verso do cartão — a cara "institucional": logo, nome e o essencial de
 * contato. Mantém a metáfora do cartão físico, que também é mais vazio atrás.
 */
export default function CartaoVerso({ cartao }: { cartao: Cartao }) {
  const { contato } = cartao;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      {cartao.logoUrl ? (
        <Image
          src={cartao.logoUrl}
          alt={`Logo de ${cartao.nome}`}
          width={160}
          height={160}
          className="max-h-24 w-auto object-contain"
        />
      ) : (
        <h1>{cartao.nome}</h1>
      )}

      <p className="text-sm tracking-widest text-slate-400 uppercase">
        {cartao.especialidade}
      </p>

      {cartao.tagline && (
        <p className="max-w-md text-slate-300">{cartao.tagline}</p>
      )}

      <div className="mt-2 space-y-1 text-sm text-slate-300">
        {contato.email && <p>{contato.email}</p>}
        {contato.telefone && <p>{contato.telefone}</p>}
        {contato.cidade && <p className="text-slate-400">{contato.cidade}</p>}
      </div>

      <RedesSociais redes={cartao.redesSociais} nome={cartao.nome} />
    </div>
  );
}
