"use client";

import { MantineProvider } from "@mantine/core";
import { theme as temaBase } from "@/theme";
import type { Tema } from "@/types/cartao";

/**
 * Tema por cartão (fase 1.6).
 *
 * Duas camadas, porque são dois consumidores diferentes:
 *
 * 1. `--card-primary` / `--card-secondary` vão inline no wrapper e alimentam
 *    o CSS do projeto (`.card-border`, estado ativo do menu).
 * 2. O `MantineProvider` aninhado reescreve as variáveis de cor primária do
 *    Mantine via `cssVariablesResolver`, para os componentes dele (Timeline)
 *    seguirem a cor do cartão. Provider aninhado não herda do pai, então o
 *    tema base é repassado explicitamente.
 */
export default function TemaCartao({
  tema,
  children,
}: {
  tema: Tema;
  children: React.ReactNode;
}) {
  const primaria = tema.corPrimaria;
  const secundaria = tema.corSecundaria ?? tema.corPrimaria;

  return (
    <MantineProvider
      theme={temaBase}
      defaultColorScheme="dark"
      cssVariablesSelector="[data-tema-cartao]"
      cssVariablesResolver={() => ({
        variables: {
          "--mantine-primary-color-filled": primaria,
          "--mantine-primary-color-filled-hover": primaria,
          "--mantine-primary-color-light": `color-mix(in srgb, ${primaria} 12%, transparent)`,
          "--mantine-primary-color-light-hover": `color-mix(in srgb, ${primaria} 20%, transparent)`,
          "--mantine-primary-color-light-color": primaria,
        },
        light: {},
        dark: {},
      })}
    >
      {/* `w-full` porque este div é só um portador de variáveis e não deveria
          interferir no layout: como item de um flex, sem isso ele encolhe até
          o conteúdo e o `max-width` do cartão nunca chega a valer. */}
      <div
        data-tema-cartao
        className="w-full"
        style={
          {
            "--card-primary": primaria,
            "--card-secondary": secundaria,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </MantineProvider>
  );
}
