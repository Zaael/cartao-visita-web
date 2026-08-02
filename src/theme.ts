import { createTheme } from "@mantine/core";

/**
 * Tema base do Mantine, compartilhado por todas as paginas.
 * O tema por cartao (fase 1.6) entra num MantineProvider aninhado,
 * sobrescrevendo as cores em cima deste.
 */
export const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  headings: { fontFamily: "Poppins, sans-serif" },
});
