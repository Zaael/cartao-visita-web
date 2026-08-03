import Image from "next/image";
import { HiEnvelope, HiMapPin, HiMiniPhone } from "react-icons/hi2";
import type { IconType } from "react-icons";
import type { Cartao } from "@/types/cartao";
import { iniciais } from "@/lib/iniciais";
import RedesSociais from "./redes-sociais";

/**
 * Verso do cartão — a face "institucional". Menos informação e mais marca que
 * a frente, como num cartão impresso: logo (ou monograma) no centro, nome e
 * cargo em caixa alta espaçada, e o contato reduzido a uma linha.
 *
 * O brilho de fundo, o anel do monograma e o filete vivem no CSS
 * (`.verso*` em globals.css) porque são gradientes derivados das cores do
 * tema, que mudam de cartão para cartão.
 */
export default function CartaoVerso({ cartao }: { cartao: Cartao }) {
  const { contato } = cartao;

  return (
    <div className="verso flex flex-col items-center justify-center gap-6 text-center">
      {cartao.logoUrl ? (
        <Image
          src={cartao.logoUrl}
          alt={`Logo de ${cartao.nome}`}
          width={280}
          height={280}
          className="max-h-28 w-auto object-contain drop-shadow-lg"
        />
      ) : (
        // Sem logo o cartão não pode ficar careca: as iniciais viram monograma.
        <div className="verso-monograma" aria-hidden>
          <span className="font-sans text-3xl font-bold tracking-widest text-white/90">
            {iniciais(cartao.nome)}
          </span>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <p className="font-sans text-2xl font-bold tracking-[0.2em] text-white uppercase">
          {cartao.nome}
        </p>

        <div className="verso-filete">
          <span className="verso-losango" aria-hidden />
        </div>

        <p className="text-xs tracking-[0.3em] text-slate-300 uppercase">
          {cartao.especialidade}
        </p>
      </div>

      {cartao.tagline && (
        <p className="max-w-md text-sm text-slate-400 italic">
          {cartao.tagline}
        </p>
      )}

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
        {contato.email && (
          <ItemContato Icone={HiEnvelope} rotulo="E-mail">
            {contato.email}
          </ItemContato>
        )}
        {contato.telefone && (
          <ItemContato Icone={HiMiniPhone} rotulo="Telefone">
            {contato.telefone}
          </ItemContato>
        )}
        {contato.cidade && (
          <ItemContato Icone={HiMapPin} rotulo="Cidade">
            {contato.cidade}
          </ItemContato>
        )}
      </ul>

      <RedesSociais redes={cartao.redesSociais} nome={cartao.nome} />
    </div>
  );
}

function ItemContato({
  Icone,
  rotulo,
  children,
}: {
  Icone: IconType;
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      {/* O ícone é a única pista visual do que é cada valor, então o rótulo
          precisa existir para quem não o vê. */}
      <Icone className="text-[var(--card-primary)]" aria-hidden />
      <span className="sr-only">{rotulo}:</span>
      {children}
    </li>
  );
}
