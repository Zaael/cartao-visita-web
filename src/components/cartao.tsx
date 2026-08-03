"use client";

import { useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import type { Cartao as CartaoType } from "@/types/cartao";
import NavMenu, { SECOES, type Secao } from "./nav-menu";
import ResumoPerfil from "./resumo-perfil";
import CartaoVerso from "./cartao-verso";
import { Sobre, Projetos, Galeria, Contatos } from "./detalhes";

/**
 * Só entram no menu as seções que têm conteúdo neste cartão — exceto galeria e
 * contato, que aparecem sempre: a galeria é o lugar onde as fotos vão entrar,
 * então esconder a aba vazia esconde também que ela existe.
 */
function secoesDisponiveis(cartao: CartaoType): Secao[] {
  const tem: Record<Secao, boolean> = {
    sobre: Boolean(cartao.sobre),
    projetos: cartao.projetos.length > 0,
    galeria: true,
    contato: true,
  };
  return SECOES.filter((secao) => tem[secao]);
}

export default function Cartao({ cartao }: { cartao: CartaoType }) {
  const secoes = secoesDisponiveis(cartao);
  const [ativa, setAtiva] = useState<Secao>(secoes[0]);
  const [virado, setVirado] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[var(--card-largura)] perspective-[1600px]">
      <div
        className={`relative transition-transform duration-700 transform-3d ${
          virado ? "rotate-y-180" : ""
        }`}
      >
        {/* Frente */}
        <div className="backface-hidden" inert={virado}>
          <div className="card-border">
            {/* Altura fixa: trocar de aba não pode mudar o tamanho do cartão.
                O painel do perfil não encolhe e o conteúdo rola por dentro —
                daí o `min-h-0` na coluna, sem o qual o flex ignora o overflow
                e estica o cartão de volta. */}
            <div className="card flex h-[var(--card-altura)] w-full flex-col md:flex-row">
              <aside className="shrink-0 border-gray-700 pb-4 md:w-72 md:overflow-y-auto md:border-r md:pr-6 md:pb-0">
                <ResumoPerfil cartao={cartao} />
              </aside>

              <div className="flex min-h-0 flex-1 flex-col">
                <header className="shrink-0 p-4">
                  <NavMenu
                    secoes={secoes}
                    ativa={ativa}
                    onSelecionar={setAtiva}
                  />
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto p-4">
                  {/* `min-h-full` + `m-auto` centraliza quando sobra espaço e
                      deixa rolar quando falta. `items-center` sozinho cortaria
                      o topo do conteúdo alto. */}
                  <div className="flex min-h-full items-center justify-center">
                    {ativa === "sobre" && <Sobre cartao={cartao} />}
                    {ativa === "projetos" && <Projetos cartao={cartao} />}
                    {ativa === "galeria" && <Galeria cartao={cartao} />}
                    {ativa === "contato" && <Contatos cartao={cartao} />}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>

        {/* Verso — ocupa o mesmo espaço, girado 180°.
            `p-0` porque o próprio verso controla o respiro: o brilho de fundo
            precisa sangrar até a borda do cartão. */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180"
          inert={!virado}
        >
          <div className="card-border h-full">
            <div className="card h-full overflow-hidden p-0">
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
