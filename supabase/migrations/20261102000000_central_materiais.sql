-- Central de Editais e Materiais de Apoio
-- Apply only after reviewing the project Supabase environment and assigning the catalog_admin claim.
create extension if not exists pgcrypto;

create or replace function public.is_catalog_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'catalog_admin';
$$;

create table if not exists public.material_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text not null default 'layers',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.material_categories (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.material_areas(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(area_id, slug)
);

create table if not exists public.organizing_boards (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  acronym text,
  website_url text,
  scope text not null default 'national' check (scope in ('national','regional','institutional','mixed')),
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.material_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  acronym text,
  state char(2),
  municipality text,
  official_url text,
  created_at timestamptz not null default now(),
  unique(name, state, municipality)
);

create table if not exists public.material_contests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year integer,
  area_id uuid not null references public.material_areas(id),
  category_id uuid references public.material_categories(id),
  board_id uuid references public.organizing_boards(id),
  organization_id uuid references public.material_organizations(id),
  state char(2),
  municipality text,
  official_url text,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.material_documents (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references public.material_contests(id) on delete cascade,
  title text not null,
  description text,
  document_type text not null check (document_type in ('edital','retificacao','apostila','prova','gabarito','legislacao','comunicado','outro')),
  storage_path text,
  source_url text,
  file_name text,
  mime_type text,
  file_size bigint,
  rights_status text not null check (rights_status in ('official_public','public_domain','licensed','authorized')),
  published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists material_contests_area_idx on public.material_contests(area_id, published);
create index if not exists material_contests_board_idx on public.material_contests(board_id);
create index if not exists material_contests_location_idx on public.material_contests(state, municipality);
create index if not exists material_documents_contest_idx on public.material_documents(contest_id, published);

alter table public.material_areas enable row level security;
alter table public.material_categories enable row level security;
alter table public.organizing_boards enable row level security;
alter table public.material_organizations enable row level security;
alter table public.material_contests enable row level security;
alter table public.material_documents enable row level security;

drop policy if exists "Public reads active material areas" on public.material_areas;
create policy "Public reads active material areas" on public.material_areas for select using (active);
drop policy if exists "Admins manage material areas" on public.material_areas;
create policy "Admins manage material areas" on public.material_areas for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads active material categories" on public.material_categories;
create policy "Public reads active material categories" on public.material_categories for select using (active);
drop policy if exists "Admins manage material categories" on public.material_categories;
create policy "Admins manage material categories" on public.material_categories for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads active organizing boards" on public.organizing_boards;
create policy "Public reads active organizing boards" on public.organizing_boards for select using (active);
drop policy if exists "Admins manage organizing boards" on public.organizing_boards;
create policy "Admins manage organizing boards" on public.organizing_boards for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads material organizations" on public.material_organizations;
create policy "Public reads material organizations" on public.material_organizations for select using (true);
drop policy if exists "Admins manage material organizations" on public.material_organizations;
create policy "Admins manage material organizations" on public.material_organizations for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads published contests" on public.material_contests;
create policy "Public reads published contests" on public.material_contests for select using (published);
drop policy if exists "Admins manage material contests" on public.material_contests;
create policy "Admins manage material contests" on public.material_contests for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads published documents" on public.material_documents;
create policy "Public reads published documents" on public.material_documents for select using (published);
drop policy if exists "Admins manage material documents" on public.material_documents;
create policy "Admins manage material documents" on public.material_documents for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('concursenf-materiais', 'concursenf-materiais', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

drop policy if exists "Public can read published contest files" on storage.objects;
create policy "Public can read published contest files" on storage.objects for select using (bucket_id = 'concursenf-materiais');
drop policy if exists "Catalog admins upload contest files" on storage.objects;
create policy "Catalog admins upload contest files" on storage.objects for insert to authenticated with check (bucket_id = 'concursenf-materiais' and public.is_catalog_admin());
drop policy if exists "Catalog admins update contest files" on storage.objects;
create policy "Catalog admins update contest files" on storage.objects for update to authenticated using (bucket_id = 'concursenf-materiais' and public.is_catalog_admin()) with check (bucket_id = 'concursenf-materiais' and public.is_catalog_admin());
drop policy if exists "Catalog admins delete contest files" on storage.objects;
create policy "Catalog admins delete contest files" on storage.objects for delete to authenticated using (bucket_id = 'concursenf-materiais' and public.is_catalog_admin());

insert into public.material_areas (name, slug, description, icon, sort_order) values
('Enfermagem','enfermagem','Concursos para enfermeiros, técnicos e auxiliares de enfermagem.','stethoscope',1),
('Medicina','medicina','Concursos médicos e especialidades.','activity',2),
('Odontologia','odontologia','Concursos para cirurgiões-dentistas e especialidades.','smile',3),
('Farmácia','farmacia','Concursos para farmacêuticos e técnicos.','pill',4),
('Fisioterapia','fisioterapia','Concursos para fisioterapeutas.','accessibility',5),
('Psicologia','psicologia','Concursos para psicólogos.','brain',6),
('Serviço Social','servico-social','Concursos para assistentes sociais.','users',7),
('Educação','educacao','Concursos para professores, pedagogos e equipes educacionais.','graduation-cap',8),
('Direito e Jurídica','direito-juridica','Carreiras jurídicas e apoio judiciário.','scale',9),
('Administração','administracao','Carreiras administrativas e de gestão.','briefcase-business',10),
('Tecnologia da Informação','tecnologia-informacao','Carreiras de tecnologia, sistemas e suporte.','monitor',11),
('Engenharia e Arquitetura','engenharia-arquitetura','Carreiras de engenharia, arquitetura e áreas técnicas.','drafting-compass',12),
('Segurança Pública','seguranca-publica','Polícias, bombeiros e guardas municipais.','shield',13),
('Área Fiscal e Controle','fiscal-controle','Auditoria, fiscalização e controle.','calculator',14),
('Nutrição','nutricao','Concursos para nutricionistas.','apple',15),
('Biomedicina','biomedicina','Concursos para biomédicos.','microscope',16)
on conflict (slug) do nothing;

insert into public.material_categories (area_id, name, slug, sort_order)
select a.id, c.name, c.slug, c.sort_order
from public.material_areas a
cross join (values ('Enfermeiro','enfermeiro',1),('Técnico de Enfermagem','tecnico-enfermagem',2),('Auxiliar de Enfermagem','auxiliar-enfermagem',3)) as c(name,slug,sort_order)
where a.slug = 'enfermagem'
on conflict (area_id, slug) do nothing;

insert into public.organizing_boards (name, acronym, scope) values
('Fundação Getulio Vargas','FGV','national'),
('Centro Brasileiro de Pesquisa em Avaliação e Seleção e de Promoção de Eventos','Cebraspe','national'),
('Instituto AOCP','AOCP','national'),
('Instituto Brasileiro de Formação e Capacitação','IBFC','national'),
('Instituto Quadrix','Quadrix','national'),
('Fundação Vunesp','Vunesp','regional'),
('Fundação de Desenvolvimento da Pesquisa','Fundep','regional'),
('Instituto Brasileiro de Gestão e Pesquisa','IBGP','regional'),
('Instituto IBDO','IBDO','regional'),
('Instituto de Desenvolvimento Educacional, Cultural e Assistencial Nacional','IDECAN','national'),
('Fundação La Salle','La Salle','regional'),
('Fundação Universidade Empresa de Tecnologia e Ciências','Fundatec','regional'),
('Fundação de Apoio da Universidade Federal do Rio Grande do Sul','Faurgs','institutional'),
('Instituto UniFil','UniFil','regional'),
('Fundação de Apoio à Pesquisa, ao Ensino e à Cultura','Fapec','regional'),
('Instituto de Apoio à Universidade de Pernambuco','Iaupe','regional'),
('Instituto de Desenvolvimento Institucional Brasileiro','IDIB','national'),
('Instituto Avalia','Avalia','national'),
('Instituto Brasileiro de Administração Municipal','IBAM','regional'),
('Instituto Consulplan','Consulplan','national'),
('Instituto Consulpam','Consulpam','regional'),
('Instituto de Apoio ao Desenvolvimento da Universidade Estadual de Pernambuco','IAUPE','regional'),
('Instituto de Desenvolvimento e Capacitação','IDECAP','regional'),
('Fundação Cesgranrio','Cesgranrio','national'),
('Fundação Carlos Chagas','FCC','national'),
('Instituto de Desenvolvimento e Capacitação','IDECAP','regional'),
('Instituto de Seleção e Tecnologia','Selecon','regional'),
('Fundação de Amparo e Desenvolvimento da Pesquisa','Fadesp','regional'),
('Comissão Permanente de Concursos','Copese/UFPI','institutional'),
('Comissão Permanente do Vestibular','Comperve/UFRN','institutional'),
('Instituto Verbena/UFG','Verbena','institutional'),
('Instituto de Desenvolvimento Educacional e Cultural','IDEC','regional'),
('Instituto Mais','Instituto Mais','regional'),
('Instituto Nosso Rumo','Nosso Rumo','regional'),
('Objetiva Concursos','Objetiva','regional'),
('Legalle Concursos','Legalle','regional'),
('Avança SP','Avança SP','regional'),
('Consesp','Consesp','regional')
on conflict (name) do nothing;
