"use client";

import { Modal } from "@mantine/core";
import type { Tema } from "@/types/cartao";

/**
 * Modal com as medidas e a cara do cartão — usado pela aba Projetos e pela
 * Galeria, que abrem conteúdo "por cima" sem tirar o visitante do cartão.
 *
 * Duas coisas aqui não são óbvias:
 *
 * 1. O modal do Mantine renderiza num Portal, no fim do <body>. Isso o coloca
 *    fora da árvore de <TemaCartao>, então ele perderia tanto
 *    `--card-primary` (herdada) quanto as variáveis do Mantine (escopadas em
 *    `[data-tema-cartao]`). Por isso o atributo e as duas cores são
 *    reaplicados aqui na raiz do modal.
 *
 * 2. O tamanho não vem da prop `size` do Mantine: ela monta
 *    `var(--modal-size-<valor>)`, que só funciona com os presets (`md`, `lg`).
 *    Alimentamos direto as variáveis que o CSS dele lê, com as mesmas do
 *    cartão — assim "do tamanho do cartão" continua verdade se o cartão mudar.
 */
export default function ModalCartao({
  aberto,
  aoFechar,
  aoSairDaTela,
  tema,
  titulo,
  children,
}: {
  aberto: boolean;
  aoFechar: () => void;
  /** Chamado quando a animação de saída termina — ver nota em <Projetos>. */
  aoSairDaTela?: () => void;
  tema: Tema;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Modal.Root
      opened={aberto}
      onClose={aoFechar}
      onExitTransitionEnd={aoSairDaTela}
      centered
      data-tema-cartao
      style={
        {
          "--card-primary": tema.corPrimaria,
          "--card-secondary": tema.corSecundaria ?? tema.corPrimaria,
          "--modal-size": "var(--card-largura)",
          "--modal-content-height": "var(--card-altura)",
        } as React.CSSProperties
      }
    >
      <Modal.Overlay backgroundOpacity={0.7} blur={6} />

      {/* `classNames` e não `className`: <Modal.Content> desenha dois
          elementos ('content' e 'inner'), e `className` cai nos dois — o
          gradiente da borda acabava pintando o wrapper de tela inteira.
          `overflow-hidden` aqui porque o Mantine deixa `overflow-y: auto` no
          content, o que cortaria a borda por dentro; quem rola é o Body. */}
      <Modal.Content
        classNames={{ content: "card-border overflow-hidden bg-transparent" }}
      >
        <div className="card flex h-full flex-col p-0">
          <Modal.Header className="shrink-0 bg-transparent px-5 pt-4 pb-3">
            {/* `not-italic` porque o Modal.Title sai como <h2> e cai na regra
                global de h2 (fina e itálica), que é feita para o subtítulo do
                perfil, não para um cabeçalho de diálogo. */}
            <Modal.Title className="font-sans font-bold text-white not-italic">
              {titulo}
            </Modal.Title>
            <Modal.CloseButton aria-label="Fechar" />
          </Modal.Header>

          <Modal.Body className="min-h-0 flex-1 overflow-y-auto px-5 pt-0 pb-5">
            {children}
          </Modal.Body>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
