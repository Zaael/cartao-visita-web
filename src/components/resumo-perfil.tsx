import Image from "next/image";
import { HiMapPin } from "react-icons/hi2";
import type { Cartao } from "@/types/cartao";
import RedesSociais from "./redes-sociais";

export default function ResumoPerfil({ cartao }: { cartao: Cartao }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar url={cartao.fotoPerfilUrl} nome={cartao.nome} />

      <h1 className="mt-4">{cartao.nome}</h1>
      <h2>{cartao.especialidade}</h2>

      {cartao.tagline && (
        <p className="mt-2 text-sm text-slate-400">{cartao.tagline}</p>
      )}

      {cartao.contato.cidade && (
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-400">
          <HiMapPin aria-hidden />
          {cartao.contato.cidade}
        </p>
      )}

      <div className="mt-6">
        <RedesSociais redes={cartao.redesSociais} nome={cartao.nome} />
      </div>
    </div>
  );
}

function Avatar({ url, nome }: { url?: string; nome: string }) {
  if (!url) {
    // Cartão sem foto ainda é um cartão válido — mostra as iniciais em vez de
    // um espaço vazio ou de uma imagem quebrada.
    const iniciais = nome
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? "")
      .join("");

    return (
      <div
        className="avatar flex items-center justify-center bg-slate-700 text-3xl font-bold"
        role="img"
        aria-label={`Foto de ${nome} não disponível`}
      >
        {iniciais}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={`Foto de ${nome}`}
      width={136}
      height={136}
      className="avatar"
      priority
    />
  );
}
