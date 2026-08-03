"use client";

import { useState } from "react";
import Image from "next/image";
import {
  HiChevronLeft,
  HiChevronRight,
  HiEnvelope,
  HiMiniPhone,
  HiPhoto,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import type { Cartao, Projeto } from "@/types/cartao";
import ModalCartao from "./modal-cartao";
import RedesSociais from "./redes-sociais";

export function Sobre({ cartao }: { cartao: Cartao }) {
  if (!cartao.sobre) return null;

  // `sobre` é texto livre com parágrafos separados por linha em branco —
  // é onde habilidades e formação passaram a viver.
  const paragrafos = cartao.sobre.split(/\n{2,}/).filter(Boolean);

  return (
    <section className="max-w-xl space-y-4 leading-relaxed text-slate-300">
      {paragrafos.map((paragrafo, i) => (
        <p key={i}>{paragrafo}</p>
      ))}
    </section>
  );
}

export function Projetos({ cartao }: { cartao: Cartao }) {
  // `aberto` e `selecionado` são dois estados de propósito: ao fechar, o modal
  // ainda anima a saída, e zerar o projeto junto esvaziaria o conteúdo antes
  // de ele sumir da tela. Por isso o projeto só é descartado no fim da
  // animação, via `aoSairDaTela`.
  const [selecionado, setSelecionado] = useState<Projeto | null>(null);
  const [aberto, setAberto] = useState(false);

  if (cartao.projetos.length === 0) return null;

  return (
    <>
      <section className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
        {cartao.projetos.map((projeto) => (
          <button
            key={projeto.titulo}
            type="button"
            onClick={() => {
              setSelecionado(projeto);
              setAberto(true);
            }}
            className="card-mini"
          >
            <span className="font-sans text-sm font-bold text-white">
              {projeto.titulo}
            </span>
            {/* Só a chamada: o texto inteiro está no modal. */}
            <span className="line-clamp-2 text-xs leading-relaxed text-slate-400">
              {projeto.descricao}
            </span>
          </button>
        ))}
      </section>

      <ModalCartao
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        aoSairDaTela={() => setSelecionado(null)}
        tema={cartao.tema}
        titulo={selecionado?.titulo ?? ""}
      >
        {selecionado && (
          <div className="space-y-4">
            {selecionado.imagemUrl && (
              <Image
                src={selecionado.imagemUrl}
                alt=""
                width={960}
                height={420}
                className="max-h-64 w-full rounded-lg object-cover"
              />
            )}

            <p className="leading-relaxed text-slate-300">
              {selecionado.descricao}
            </p>

            {selecionado.link && (
              <a
                href={selecionado.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-[var(--card-primary)] hover:underline"
              >
                Ver projeto
              </a>
            )}
          </div>
        )}
      </ModalCartao>
    </>
  );
}

export function Galeria({ cartao }: { cartao: Cartao }) {
  const fotos = cartao.galeria;
  const [indice, setIndice] = useState(0);
  const [aberto, setAberto] = useState(false);

  // A aba existe mesmo sem foto (é assim que ela some da vista quando ninguém
  // subiu nada), então o vazio precisa dizer o que está acontecendo.
  if (fotos.length === 0) {
    return (
      <section className="flex flex-col items-center gap-3 text-center text-slate-400">
        <HiPhoto size={44} className="opacity-40" aria-hidden />
        <p className="text-sm">Nenhuma foto na galeria ainda.</p>
      </section>
    );
  }

  const irPara = (proximo: number) =>
    setIndice((proximo + fotos.length) % fotos.length);

  return (
    <>
      <section className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
        {fotos.map((url, i) => (
          // Índice na key porque nada impede a mesma URL de aparecer duas
          // vezes na galeria, e aí duas keys iguais quebrariam a lista.
          <button
            key={`${i}-${url}`}
            type="button"
            onClick={() => {
              setIndice(i);
              setAberto(true);
            }}
            aria-label={`Abrir foto ${i + 1} de ${fotos.length}`}
            className="card-mini p-1"
          >
            <Image
              src={url}
              alt=""
              width={200}
              height={200}
              className="h-28 w-full rounded object-cover"
            />
          </button>
        ))}
      </section>

      <ModalCartao
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        tema={cartao.tema}
        titulo={`Foto ${indice + 1} de ${fotos.length}`}
      >
        <div className="flex h-full items-center gap-2">
          {fotos.length > 1 && (
            <SetaFoto
              rotulo="Foto anterior"
              Icone={HiChevronLeft}
              onClick={() => irPara(indice - 1)}
            />
          )}

          {/* `h-full` é o que segura a foto: sem altura definida aqui, este
              div cresce com o conteúdo (é item de um flex-row centralizado) e
              o `max-h-full` da imagem não tem contra o que resolver. */}
          <div className="flex h-full min-w-0 flex-1 items-center justify-center">
            <Image
              src={fotos[indice]}
              alt={`Foto ${indice + 1} da galeria de ${cartao.nome}`}
              width={1200}
              height={800}
              className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
            />
          </div>

          {fotos.length > 1 && (
            <SetaFoto
              rotulo="Próxima foto"
              Icone={HiChevronRight}
              onClick={() => irPara(indice + 1)}
            />
          )}
        </div>
      </ModalCartao>
    </>
  );
}

function SetaFoto({
  rotulo,
  Icone,
  onClick,
}: {
  rotulo: string;
  Icone: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="shrink-0 cursor-pointer rounded-full border border-slate-600 p-2 text-slate-300 transition-colors hover:border-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--card-primary)]"
    >
      <Icone size={20} aria-hidden />
    </button>
  );
}

export function Contatos({ cartao }: { cartao: Cartao }) {
  const { contato } = cartao;

  return (
    <section className="flex flex-col items-center gap-4">
      <RedesSociais redes={cartao.redesSociais} nome={cartao.nome} />

      <ul className="space-y-2 text-sm text-slate-300">
        {contato.email && (
          <LinhaContato Icone={HiEnvelope} rotulo="E-mail">
            <a href={`mailto:${contato.email}`} className="hover:text-white">
              {contato.email}
            </a>
          </LinhaContato>
        )}
        {contato.telefone && (
          <LinhaContato Icone={HiMiniPhone} rotulo="Telefone">
            <a
              href={`tel:${contato.telefone.replace(/\D/g, "")}`}
              className="hover:text-white"
            >
              {contato.telefone}
            </a>
          </LinhaContato>
        )}
        {contato.whatsapp && (
          <LinhaContato Icone={FaWhatsapp} rotulo="WhatsApp">
            <a
              href={`https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {contato.whatsapp}
            </a>
          </LinhaContato>
        )}
      </ul>
    </section>
  );
}

function LinhaContato({
  Icone,
  rotulo,
  children,
}: {
  Icone: React.ComponentType<{ "aria-hidden"?: boolean }>;
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icone aria-hidden />
      <span className="sr-only">{rotulo}:</span>
      {children}
    </li>
  );
}
