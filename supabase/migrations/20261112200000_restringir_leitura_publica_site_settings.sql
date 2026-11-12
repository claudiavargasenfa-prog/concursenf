-- Restringe a leitura pública de site_settings
-- Mantém públicas somente as configurações de tema e marca.
-- Administradores continuam com acesso conforme is_catalog_admin().

DROP POLICY IF EXISTS "Public reads site settings"
ON public.site_settings;

DROP POLICY IF EXISTS "Public reads public site settings"
ON public.site_settings;

CREATE POLICY "Public reads public site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (
  setting_key IN ('theme', 'brand')
);
