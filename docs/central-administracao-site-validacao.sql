-- ConcursEnf | Validacao POS-APLICACAO (somente leitura) da Central de Administracao do Site
-- Este arquivo NAO cria, altera ou remove objetos.
-- Execute somente DEPOIS da aplicacao autorizada da migration.
-- Execute no SQL Editor do projeto Supabase, com permissao para consultar os catalogos.
-- Cada bloco retorna diagnosticos para conferir o estado final.
--
-- IMPORTANTE:
-- 1. Nao execute aqui a migration 0004 nem qualquer arquivo de supabase/migrations.
-- 2. Antes de aplicar qualquer migration, confirme qual runner e a fonte oficial.
-- 3. A existencia isolada de um objeto nao comprova que a migration foi aplicada integralmente.
-- 4. A conta administrativa esperada e concursenfe@gmail.com, com role catalog_admin
--    em raw_app_meta_data (app_metadata no JWT).
--
-- CRITERIOS ESPERADOS:
-- - As tres tabelas devem existir e ter RLS habilitado.
-- - is_catalog_admin() deve existir e retornar true para a sessao da administradora autenticada.
-- - site_settings deve permitir leitura publica somente de theme e brand.
-- - site_sections deve permitir leitura publica somente de registros ativos.
-- - site_media deve permitir leitura publica somente de registros publicados.
-- - O bucket concursenf-site deve existir como PRIVADO, limite 104857600 bytes.
-- - Deve existir o trigger site_sections_updated_at.
-- - Devem existir os registros iniciais theme e brand.
--
-- ============================================================
-- BLOCO A - IDENTIFICACAO DA CONTA ADMINISTRATIVA
-- ============================================================
SELECT
  id,
  email,
  raw_app_meta_data ->> 'role' AS app_metadata_role,
  (raw_app_meta_data ->> 'role' = 'catalog_admin') AS role_correta
FROM auth.users
WHERE lower(email) = lower('concursenfe@gmail.com');

-- ============================================================
-- BLOCO B - EXISTENCIA DAS TABELAS E STATUS DE RLS
-- ============================================================
WITH expected(table_name) AS (
  VALUES ('site_settings'), ('site_sections'), ('site_media')
)
SELECT
  e.table_name,
  (c.oid IS NOT NULL) AS tabela_existe,
  COALESCE(c.relrowsecurity, false) AS rls_habilitado,
  COALESCE(c.relforcerowsecurity, false) AS rls_forcado
FROM expected e
LEFT JOIN pg_class c
  ON c.oid = to_regclass('public.' || e.table_name)
ORDER BY e.table_name;

-- ============================================================
-- BLOCO C - POLITICAS RLS DAS TABELAS DO SITE
-- Inspecione TODAS as politicas, inclusive nomes inesperados ou antigas.
-- Uma politica permissiva adicional pode ampliar o acesso efetivo.
-- ============================================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('site_settings', 'site_sections', 'site_media')
ORDER BY tablename, policyname;

-- ============================================================
-- BLOCO D - PRIVILEGIOS SQL NAS TABELAS
-- RLS e GRANT sao camadas diferentes; ambas precisam estar corretas.
-- ============================================================
SELECT
  table_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('site_settings', 'site_sections', 'site_media')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- ============================================================
-- BLOCO E - FUNCAO ADMINISTRATIVA E SUA DEFINICAO
-- A funcao deve existir antes que as politicas administrativas sejam usadas.
-- ============================================================
SELECT
  to_regprocedure('public.is_catalog_admin()') AS assinatura_da_funcao,
  CASE
    WHEN to_regprocedure('public.is_catalog_admin()') IS NULL THEN 'AUSENTE'
    ELSE 'PRESENTE'
  END AS situacao;

SELECT
  p.oid::regprocedure AS funcao,
  pg_get_functiondef(p.oid) AS definicao
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'is_catalog_admin';

-- Resultado funcional no contexto SQL atual. ATENCAO: no SQL Editor, o contexto
-- normalmente e postgres e nao reproduz o JWT da administradora; portanto este
-- resultado NAO comprova a autorizacao de concursenfe@gmail.com. A validacao real
-- deve ser feita depois, entrando no app com essa conta e abrindo /admin.
SELECT public.is_catalog_admin() AS sessao_atual_e_admin;

-- ============================================================
-- BLOCO F - BUCKET E POLITICAS DE STORAGE
-- ============================================================
SELECT
  id,
  name,
  public AS bucket_publico,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'concursenf-site';

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%ConcursEnf site media%'
    OR COALESCE(qual, '') ILIKE '%concursenf-site%'
    OR COALESCE(with_check, '') ILIKE '%concursenf-site%'
  )
ORDER BY policyname;

-- ============================================================
-- BLOCO G - TRIGGER DE ATUALIZACAO
-- ============================================================
SELECT
  t.tgname AS trigger_name,
  t.tgenabled AS trigger_status,
  c.relname AS tabela,
  p.proname AS funcao
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE n.nspname = 'public'
  AND c.relname = 'site_sections'
  AND t.tgname = 'site_sections_updated_at'
  AND NOT t.tgisinternal;

-- ============================================================
-- BLOCO H - REGISTROS INICIAIS DE TEMA E MARCA
-- ============================================================
SELECT
  setting_key,
  setting_value,
  description,
  updated_at
FROM public.site_settings
WHERE setting_key IN ('theme', 'brand')
ORDER BY setting_key;

-- ============================================================
-- BLOCO I - COLUNAS ESPERADAS (DIAGNOSTICO)
-- ============================================================
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('site_settings', 'site_sections', 'site_media')
ORDER BY table_name, ordinal_position;
