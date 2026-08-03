/**
 * Iniciais do nome, para quando não há imagem: viram o avatar na frente do
 * cartão e o monograma no verso. Duas letras no máximo — três já viram sopa
 * de letrinhas no círculo.
 */
export function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}
