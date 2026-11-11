-- Central de Administração do ConcursEnf: aparência, páginas, seções e biblioteca de mídia.
-- O acesso de escrita é restrito à claim app_metadata.role = 'catalog_admin'.

create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value jsonb not null default '{}'::jsonb,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null check (page_key in ('home','concurso','academicos','global')),
  section_key text not null,
  title text not null,
  subtitle text,
  body text,
  media_url text,
  media_type text not null default 'none' check (media_type in ('none','image','audio','video','youtube')),
  button_label text,
  button_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists site_sections_page_order_idx on public.site_sections(page_key, is_active, sort_order);

create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_type text not null check (media_type in ('image','audio','video','youtube')),
  storage_path text,
  external_url text,
  mime_type text,
  file_size bigint,
  alt_text text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint site_media_source_check check (
    (media_type = 'youtube' and external_url is not null)
    or (media_type <> 'youtube' and (storage_path is not null or external_url is not null))
  )
);

alter table public.site_settings enable row level security;
alter table public.site_sections enable row level security;
alter table public.site_media enable row level security;

drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads active site sections" on public.site_sections;
create policy "Public reads active site sections" on public.site_sections for select using (is_active);
drop policy if exists "Admins manage site sections" on public.site_sections;
create policy "Admins manage site sections" on public.site_sections for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "Public reads published site media" on public.site_media;
create policy "Public reads published site media" on public.site_media for select using (published);
drop policy if exists "Admins manage site media" on public.site_media;
create policy "Admins manage site media" on public.site_media for all to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'concursenf-site',
  'concursenf-site',
  false,
  104857600,
  array['image/jpeg','image/png','image/webp','image/gif','audio/mpeg','audio/mp4','audio/wav','audio/ogg','video/mp4','video/webm']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 104857600,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads published ConcursEnf site media" on storage.objects;
create policy "Public reads published ConcursEnf site media" on storage.objects for select using (
  bucket_id = 'concursenf-site'
  and (
    public.is_catalog_admin()
    or exists (
      select 1 from public.site_media m
      where m.storage_path = storage.objects.name and m.published = true
    )
  )
);

drop policy if exists "Admins upload ConcursEnf site media" on storage.objects;
create policy "Admins upload ConcursEnf site media" on storage.objects for insert to authenticated
with check (bucket_id = 'concursenf-site' and public.is_catalog_admin());

drop policy if exists "Admins update ConcursEnf site media" on storage.objects;
create policy "Admins update ConcursEnf site media" on storage.objects for update to authenticated
using (bucket_id = 'concursenf-site' and public.is_catalog_admin())
with check (bucket_id = 'concursenf-site' and public.is_catalog_admin());

drop policy if exists "Admins delete ConcursEnf site media" on storage.objects;
create policy "Admins delete ConcursEnf site media" on storage.objects for delete to authenticated
using (bucket_id = 'concursenf-site' and public.is_catalog_admin());

create or replace function public.set_site_cms_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_sections_updated_at on public.site_sections;
create trigger site_sections_updated_at before update on public.site_sections
for each row execute function public.set_site_cms_updated_at();

insert into public.site_settings (setting_key, setting_value, description)
values
  ('theme', '{"primary":"#0798AE","background":"#F7FAFC","foreground":"#17242B","accent":"#DDF3F5"}'::jsonb, 'Cores principais da identidade visual'),
  ('brand', '{"name":"ConcursEnf","tagline":"Preparação em enfermagem"}'::jsonb, 'Nome e assinatura da marca')
on conflict (setting_key) do nothing;
