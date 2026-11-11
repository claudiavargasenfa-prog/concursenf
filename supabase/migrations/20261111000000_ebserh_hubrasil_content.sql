-- Estrutura de conteúdo para concursos EBSERH / HU Brasil.
-- A publicação é controlada por administradores com app_metadata.role = 'catalog_admin'.

create table if not exists public.exam_content_items (
  id uuid primary key default gen_random_uuid(),
  exam_slug text not null default 'ebserh-hubrasil' check (exam_slug in ('ebserh-hubrasil')),
  audience text not null default 'todos' check (audience in ('todos','enfermeiro','tecnico','auxiliar')),
  subject text not null,
  topic text not null,
  content_type text not null check (content_type in ('texto','mapa_mental','pdf','audio','video','link')),
  title text not null,
  summary text,
  body text,
  resource_url text,
  source_reference text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exam_content_resource_check check (
    (content_type in ('pdf','audio','video','link') and resource_url is not null)
    or content_type in ('texto','mapa_mental')
  )
);

create table if not exists public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_slug text not null default 'ebserh-hubrasil' check (exam_slug in ('ebserh-hubrasil')),
  audience text not null default 'todos' check (audience in ('todos','enfermeiro','tecnico','auxiliar')),
  subject text not null,
  topic text not null,
  difficulty text not null default 'Intermediária' check (difficulty in ('Básica','Intermediária','Avançada')),
  statement text not null,
  options jsonb not null,
  correct_option text not null,
  explanation text not null,
  reference text,
  source_board text,
  source_year integer,
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exam_questions_options_array check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) >= 2)
);

create table if not exists public.exam_flashcards (
  id uuid primary key default gen_random_uuid(),
  exam_slug text not null default 'ebserh-hubrasil' check (exam_slug in ('ebserh-hubrasil')),
  audience text not null default 'todos' check (audience in ('todos','enfermeiro','tecnico','auxiliar')),
  subject text not null,
  topic text not null,
  front text not null,
  back text not null,
  source_reference text,
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exam_content_public_idx on public.exam_content_items(exam_slug, published, subject, sort_order);
create index if not exists exam_questions_public_idx on public.exam_questions(exam_slug, published, subject, topic);
create index if not exists exam_flashcards_public_idx on public.exam_flashcards(exam_slug, published, subject, topic);

alter table public.exam_content_items enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_flashcards enable row level security;

drop policy if exists "Public reads published exam content" on public.exam_content_items;
create policy "Public reads published exam content" on public.exam_content_items for select using (published);
drop policy if exists "Admins manage exam content" on public.exam_content_items;
create policy "Admins manage exam content" on public.exam_content_items for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads published exam questions" on public.exam_questions;
create policy "Public reads published exam questions" on public.exam_questions for select using (published);
drop policy if exists "Admins manage exam questions" on public.exam_questions;
create policy "Admins manage exam questions" on public.exam_questions for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads published exam flashcards" on public.exam_flashcards;
create policy "Public reads published exam flashcards" on public.exam_flashcards for select using (published);
drop policy if exists "Admins manage exam flashcards" on public.exam_flashcards for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

create or replace function public.set_exam_content_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists exam_content_items_updated_at on public.exam_content_items;
create trigger exam_content_items_updated_at before update on public.exam_content_items
for each row execute function public.set_exam_content_updated_at();
drop trigger if exists exam_questions_updated_at on public.exam_questions;
create trigger exam_questions_updated_at before update on public.exam_questions
for each row execute function public.set_exam_content_updated_at();
drop trigger if exists exam_flashcards_updated_at on public.exam_flashcards;
create trigger exam_flashcards_updated_at before update on public.exam_flashcards
for each row execute function public.set_exam_content_updated_at();
