import { HiHome, HiIdentification, HiMiniPhone, HiPhoto } from "react-icons/hi2";
import type { IconType } from "react-icons";

export const SECOES = ["sobre", "projetos", "galeria", "contato"] as const;
export type Secao = (typeof SECOES)[number];

export const ROTULOS: Record<Secao, { Icone: IconType; texto: string }> = {
  sobre: { Icone: HiHome, texto: "Sobre" },
  projetos: { Icone: HiIdentification, texto: "Projetos" },
  galeria: { Icone: HiPhoto, texto: "Galeria" },
  contato: { Icone: HiMiniPhone, texto: "Contato" },
};

export default function NavMenu({
  secoes,
  ativa,
  onSelecionar,
}: {
  secoes: Secao[];
  ativa: Secao;
  onSelecionar: (secao: Secao) => void;
}) {
  return (
    <nav className="nav-menu" aria-label="Seções do cartão">
      <ul className="lista-menu">
        {secoes.map((secao) => {
          const { Icone, texto } = ROTULOS[secao];
          const selecionada = secao === ativa;
          return (
            <li key={secao}>
              {/* Era <a href="#"> — um botão de verdade porque isto troca
                  conteúdo na mesma página, não navega. */}
              <button
                type="button"
                onClick={() => onSelecionar(secao)}
                aria-current={selecionada ? "true" : undefined}
                title={texto}
                className={`flex cursor-pointer flex-col items-center gap-1 border-b-2 px-2 pb-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--card-primary)] ${
                  selecionada
                    ? "border-[var(--card-primary)] text-[var(--card-primary)]"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Icone size={24} aria-hidden />
                <span>{texto}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
