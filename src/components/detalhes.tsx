import Image from "next/image";
import { Timeline, Text } from "@mantine/core";
import { HiEnvelope, HiMiniPhone } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import type { Cartao } from "@/types/cartao";
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
  if (cartao.projetos.length === 0) return null;

  return (
    <section className="w-full max-w-xl">
      <Timeline active={cartao.projetos.length} lineWidth={3} bulletSize={16}>
        {cartao.projetos.map((projeto) => (
          <Timeline.Item key={projeto.titulo} title={projeto.titulo}>
            <Text size="sm" c="dimmed">
              {projeto.descricao}
            </Text>
            {projeto.link && (
              <Text
                component="a"
                href={projeto.link}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                c="var(--card-primary)"
              >
                Ver projeto
              </Text>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </section>
  );
}

export function Galeria({ cartao }: { cartao: Cartao }) {
  if (cartao.galeria.length === 0) return null;

  return (
    <section className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
      {cartao.galeria.map((url) => (
        <Image
          key={url}
          src={url}
          alt=""
          width={200}
          height={200}
          className="h-32 w-full rounded-lg object-cover"
        />
      ))}
    </section>
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
