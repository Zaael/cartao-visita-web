-- Fase 1.2 do ROADMAP — tabelas `cartoes` e `assinaturas`.
-- Base: docs/system-design.md, seção 4.
--
-- Como aplicar: painel do Supabase > SQL Editor > cole e rode.
-- (Precisa de DDL, que nem a publishable key nem a secret key fazem pela API.)
--
-- O script é idempotente: as tabelas já foram criadas manualmente neste projeto,
-- então rodar de novo só acrescenta o que falta e não derruba dado nenhum.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table if not exists cartoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id),      -- null até a Fase 4 existir
  slug text unique not null,
  publicado boolean not null default false,
  nome text not null,
  especialidade text not null,
  tagline text,
  sobre text,
  foto_perfil_url text,
  logo_url text,
  tema jsonb not null default '{}',                 -- { corPrimaria, corSecundaria, fonte }
  contato jsonb not null default '{}',              -- { whatsapp, email, telefone, cidade }
  redes_sociais jsonb not null default '[]',        -- [{ tipo, url }]
  projetos jsonb not null default '[]',             -- [{ titulo, descricao, imagemUrl, link }]
  galeria jsonb not null default '[]',              -- [url, url, ...]
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists assinaturas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) unique,
  provedor_subscription_id text,
  status text not null default 'sem_assinatura',    -- sem_assinatura | ativa | atrasada | cancelada
  periodo_atual_fim timestamptz
);

-- ---------------------------------------------------------------------------
-- RLS — cartoes
-- ---------------------------------------------------------------------------

alter table cartoes enable row level security;

drop policy if exists "Cartão publicado é visível a todos" on cartoes;
create policy "Cartão publicado é visível a todos"
  on cartoes for select using (publicado = true);

drop policy if exists "Dono gerencia o próprio cartão" on cartoes;
create policy "Dono gerencia o próprio cartão"
  on cartoes for all using (auth.uid() = usuario_id);

-- ---------------------------------------------------------------------------
-- RLS — assinaturas
-- ---------------------------------------------------------------------------

-- Isto NÃO estava no system-design, mas é necessário: toda tabela do schema
-- `public` fica exposta pela API do Supabase. Hoje `assinaturas` responde a
-- quem tem só a publishable key — ou seja, a qualquer visitante do site, já que
-- essa chave vai no bundle do browser. Como a tabela ainda está vazia, não
-- vazou nada; a partir da Fase 5 ela guarda status de pagamento por usuário.
--
-- Habilitar RLS sem policy já nega tudo. A policy abaixo libera apenas a leitura
-- do próprio registro. A escrita fica com o webhook de pagamento (Fase 5), que
-- usa a secret key e ignora RLS por design.
alter table assinaturas enable row level security;

drop policy if exists "Dono lê a própria assinatura" on assinaturas;
create policy "Dono lê a própria assinatura"
  on assinaturas for select using (auth.uid() = usuario_id);

-- ---------------------------------------------------------------------------
-- Manutenção de `atualizado_em`
-- ---------------------------------------------------------------------------

-- Sem isto a coluna congela no valor do insert: o seed (e o formulário da
-- Fase 4) teriam que lembrar de setar na mão a cada escrita.
create or replace function set_atualizado_em() returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists cartoes_atualizado_em on cartoes;
create trigger cartoes_atualizado_em
  before update on cartoes
  for each row execute function set_atualizado_em();

-- ---------------------------------------------------------------------------
-- Conferência — rode depois e confirme rls_ativo = true nas duas linhas
-- ---------------------------------------------------------------------------

select
  c.relname as tabela,
  c.relrowsecurity as rls_ativo,
  (select count(*) from pg_policies p
    where p.schemaname = 'public' and p.tablename = c.relname) as qtd_policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('cartoes', 'assinaturas');
