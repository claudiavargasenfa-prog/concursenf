-- ConcursEnf | Pre-validacao somente leitura da Central de Administracao do Site
-- Execute ANTES de qualquer migration, no SQL Editor do projeto Supabase.
-- Este arquivo contem somente consultas SELECT e nao altera o banco.
-- O objetivo e identificar objetos preexistentes e possiveis conflitos.
--
-- NAO execute a migration nesta etapa. Nao use este resultado isoladamente
-- para decidir que e seguro aplicar SQL: revise as politicas e confirme o runner.
--
-- 1. Estado das tres tabelas.
WITH expected(table_name) AS (
  VALUES ('site_settings'), ('site_sections'), ('site_media')
)
SELECT
  e.table_name,
  (c.oid IS NOT NULL) AS tabela_ja_existe,
  COALESCE(c.relrowsecurity, false) AS rls_habilitado,
  COALESCE(c.relforcerowsecurity, false) AS rls_forcado
FROM expected e
LEFT JOIN pg_class c
  ON c.oid = to_regclass('public.' || e.table_name)
ORDER BY e.table_name;

-- 2. Politicas que ja existem nas tabelas, se existirem.
SELECT
  schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('site_settings', 'site_sections', 'site_media')
ORDER BY tablename, policyname;

-- 3. Privilegios SQL atuais.
SELECT
  table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('site_settings', 'site_sections', 'site_media')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- 4. Funcao administrativa preexistente.
SELECT
  to_regprocedure('public.is_catalog_admin()') AS assinatura_da_funcao,
  CASE WHEN to_regprocedure('public.is_catalog_admin()') IS NULL
       THEN 'AUSENTE' ELSE 'PRESENTE' END AS situacao;

-- 5. Bucket e configuracao atuais.
SELECT id, name, public AS bucket_publico, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'concursenf-site';

-- 6. Politicas de storage que possam colidir ou ampliar acesso.
SELECT
  schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%ConcursEnf site media%'
    OR COALESCE(qual, '') ILIKE '%concursenf-site%'
    OR COALESCE(with_check, '') ILIKE '%concursenf-site%'
  )
ORDER BY policyname;

-- 7. Trigger preexistente.
SELECT
  t.tgname AS trigger_name, t.tgenabled AS trigger_status,
  c.relname AS tabela, p.proname AS funcao
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE n.nspname = 'public'
  AND c.relname = 'site_sections'
  AND t.tgname = 'site_sections_updated_at'
  AND NOT t.tgisinternal;

-- 8. Conta administrativa esperada e claim armazenada.
SELECT
  id, email, raw_app_meta_data ->> 'role' AS app_metadata_role,
  (raw_app_meta_data ->> 'role' = 'catalog_admin') AS role_correta
FROM auth.users
WHERE lower(email) = lower('concursenfe@gmail.com');

-- 9. Migrations registradas nos arquivos do repositorio nao comprovam
-- aplicacao remota. Compare manualmente este diagnostico com o historico
-- de migrations do projeto Supabase, sem apagar ou inserir registros.
