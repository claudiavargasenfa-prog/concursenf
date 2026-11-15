-- Central de Administração do ConcursEnf.
-- Mirror versionado da migration Supabase 20261111020000, com grants explícitos
-- e leitura pública limitada às configurações de tema e marca.
-- A execução no banco remoto deve ocorrer somente após revisão e autorização.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_site_cms_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.site_settings (
  setting_key text PRIMARY KEY,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL CHECK (page_key IN ('home','concurso','academicos','global')),
  section_key text NOT NULL,
  title text NOT NULL,
  subtitle text,
  body text,
  media_url text,
  media_type text NOT NULL DEFAULT 'none' CHECK (media_type IN ('none','image','audio','video','youtube')),
  button_label text,
  button_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.site_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_type text NOT NULL CHECK (media_type IN ('image','audio','video','youtube')),
  storage_path text,
  external_url text,
  mime_type text,
  file_size bigint,
  alt_text text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT site_media_source_check CHECK (
    (media_type = 'youtube' AND external_url IS NOT NULL)
    OR (media_type <> 'youtube' AND (storage_path IS NOT NULL OR external_url IS NOT NULL))
  )
);

CREATE INDEX IF NOT EXISTS site_sections_page_order_idx
  ON public.site_sections(page_key, is_active, sort_order);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.site_settings, public.site_sections, public.site_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings, public.site_sections, public.site_media TO authenticated;
GRANT ALL ON public.site_settings, public.site_sections, public.site_media TO service_role;

DROP POLICY IF EXISTS "Public reads site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public reads public site settings" ON public.site_settings;
CREATE POLICY "Public reads public site settings"
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (setting_key IN ('theme', 'brand'));

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.is_catalog_admin())
  WITH CHECK (public.is_catalog_admin());

DROP POLICY IF EXISTS "Public reads active site sections" ON public.site_sections;
CREATE POLICY "Public reads active site sections"
  ON public.site_sections FOR SELECT TO anon, authenticated
  USING (is_active);

DROP POLICY IF EXISTS "Admins manage site sections" ON public.site_sections;
CREATE POLICY "Admins manage site sections"
  ON public.site_sections FOR ALL TO authenticated
  USING (public.is_catalog_admin())
  WITH CHECK (public.is_catalog_admin());

DROP POLICY IF EXISTS "Public reads published site media" ON public.site_media;
CREATE POLICY "Public reads published site media"
  ON public.site_media FOR SELECT TO anon, authenticated
  USING (published);

DROP POLICY IF EXISTS "Admins manage site media" ON public.site_media;
CREATE POLICY "Admins manage site media"
  ON public.site_media FOR ALL TO authenticated
  USING (public.is_catalog_admin())
  WITH CHECK (public.is_catalog_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'concursenf-site',
  'concursenf-site',
  false,
  104857600,
  ARRAY[
    'image/jpeg','image/png','image/webp','image/gif',
    'audio/mpeg','audio/mp4','audio/wav','audio/ogg',
    'video/mp4','video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 104857600,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public reads published ConcursEnf site media" ON storage.objects;
CREATE POLICY "Public reads published ConcursEnf site media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'concursenf-site'
    AND (
      public.is_catalog_admin()
      OR EXISTS (
        SELECT 1
        FROM public.site_media m
        WHERE m.storage_path = storage.objects.name
          AND m.published = true
      )
    )
  );

DROP POLICY IF EXISTS "Admins upload ConcursEnf site media" ON storage.objects;
CREATE POLICY "Admins upload ConcursEnf site media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'concursenf-site' AND public.is_catalog_admin());

DROP POLICY IF EXISTS "Admins update ConcursEnf site media" ON storage.objects;
CREATE POLICY "Admins update ConcursEnf site media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'concursenf-site' AND public.is_catalog_admin())
  WITH CHECK (bucket_id = 'concursenf-site' AND public.is_catalog_admin());

DROP POLICY IF EXISTS "Admins delete ConcursEnf site media" ON storage.objects;
CREATE POLICY "Admins delete ConcursEnf site media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'concursenf-site' AND public.is_catalog_admin());

DROP TRIGGER IF EXISTS site_sections_updated_at ON public.site_sections;
CREATE TRIGGER site_sections_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_site_cms_updated_at();

INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES
  ('theme', '{"primary":"#0798AE","background":"#F7FAFC","foreground":"#17242B","accent":"#DDF3F5"}'::jsonb, 'Cores principais da identidade visual'),
  ('brand', '{"name":"ConcursEnf","tagline":"Preparação em enfermagem"}'::jsonb, 'Nome e assinatura da marca')
ON CONFLICT (setting_key) DO NOTHING;
