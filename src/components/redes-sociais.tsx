import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaGlobe,
  FaLink,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import type { RedeSocial } from "@/types/cartao";

const ICONES: Record<RedeSocial["tipo"], { Icone: IconType; rotulo: string }> = {
  linkedin: { Icone: FaLinkedin, rotulo: "LinkedIn" },
  github: { Icone: FaGithub, rotulo: "GitHub" },
  instagram: { Icone: FaInstagram, rotulo: "Instagram" },
  site: { Icone: FaGlobe, rotulo: "Site" },
  outro: { Icone: FaLink, rotulo: "Link" },
};

export default function RedesSociais({
  redes,
  nome,
}: {
  redes: RedeSocial[];
  nome: string;
}) {
  if (redes.length === 0) return null;

  return (
    <ul className="redes-sociais">
      {redes.map((rede) => {
        const { Icone, rotulo } = ICONES[rede.tipo];
        return (
          <li key={`${rede.tipo}-${rede.url}`}>
            <a
              href={rede.url}
              target="_blank"
              rel="me noopener noreferrer"
              // Sem isto o link é só um ícone: leitor de tela anuncia a URL crua.
              aria-label={`${rotulo} de ${nome} (abre em nova aba)`}
              className="block text-slate-300 transition-colors hover:text-white"
            >
              <Icone size={24} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
