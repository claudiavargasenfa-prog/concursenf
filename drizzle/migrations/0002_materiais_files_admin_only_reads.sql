DROP POLICY IF EXISTS "Signed-in users read published contest files" ON storage.objects;
CREATE POLICY "Catalog admins read materiais files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'concursenf-materiais' AND public.is_catalog_admin());