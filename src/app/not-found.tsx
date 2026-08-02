import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1>Cartão não encontrado</h1>
      <h2>Esse endereço não existe ou o cartão não está publicado</h2>
      <Link
        href="/"
        className="mt-4 rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        Ver todos os cartões
      </Link>
    </main>
  );
}
