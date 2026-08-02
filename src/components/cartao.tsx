"use client";

import { useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import type { Cartao as CartaoType } from "@/types/cartao";
import NavMenu, { SECOES, type Secao } from "./nav-menu";
import ResumoPerfil from "./resumo-perfil";
import CartaoVerso from "./cartao-verso";
import { Sobre, Projetos, Galeria, Contatos } from "./detalhes";

/** Só entram no menu as seções que têm conteúdo neste cartão. */
function secoesDisponiveis(cartao: CartaoType): Secao[] {
  const tem: Record<Secao, boolean> = {
    sobre: Boolean(cartao.sobre),
    projetos: cartao.projetos.length > 0,
    galeria: cartao.galeria.length > 0,
    contato: true,
  };
  return SECOES.filter((secao) => tem[secao]);
}

export default function Cartao({ cartao }: { cartao: CartaoType }) {
  const secoes = secoesDisponiveis(cartao);
  const [ativa, setAtiva] = useState<Secao>(secoes[0]);
  const [virado, setVirado] = useState(false);

  return (
    <div className="w-full max-w-5xl perspective-[1600px]">
      <div
        className={`relative transition-transform duration-700 transform-3d ${
          virado ? "rotate-y-180" : ""
        }`}
      >
        {/* Frente */}
        <div className="backface-hidden" inert={virado}>
          <div className="card-border">
            <div className="card flex min-h-[26rem] w-full flex-col md:flex-row">
              <aside className="border-gray-700 pb-4 md:border-r md:pr-6 md:pb-0">
                <ResumoPerfil cartao={cartao} />
              </aside>

              <div className="flex flex-1 flex-col">
                <header className="p-4">
                  <NavMenu
                    secoes={secoes}
                    ativa={ativa}
                    onSelecionar={setAtiva}
                  />
                </header>

                <main className="flex flex-1 items-center justify-center overflow-y-auto p-4">
                  {ativa === "sobre" && <Sobre cartao={cartao} />}
                  {ativa === "projetos" && <Projetos cartao={cartao} />}
                  {ativa === "galeria" && <Galeria cartao={cartao} />}
                  {ativa === "contato" && <Contatos cartao={cartao} />}
                </main>
              </div>
            </div>
          </div>
        </div>

        {/* Verso — ocupa o mesmo espaço, girado 180° */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180"
          inert={!virado}
        >
          <div className="card-border h-full">
            <div className="card h-full">
              <CartaoVerso cartao={cartao} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <BotaoVirar virado={virado} onClick={() => setVirado((v) => !v)} />
      </div>
    </div>
  );
}

function BotaoVirar({
  virado,
  onClick,
}: {
  virado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={virado}
      aria-label={virado ? "Ver a frente do cartão" : "Virar cartão"}
      className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--card-primary)]"
    >
      <HiArrowPath aria-hidden />
      {virado ? "Ver a frente" : "Virar cartão"}
    </button>
  );
}
