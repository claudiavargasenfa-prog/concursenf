DROP POLICY IF EXISTS "Public can read published contest files" ON storage.objects;
CREATE POLICY "Signed-in users read published contest files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'concursenf-materiais' AND (select auth.uid()) IS NOT NULL AND (
    public.is_catalog_admin()
    OR EXISTS (SELECT 1 FROM public.material_documents d WHERE d.storage_path = objects.name AND d.published = true)
    OR EXISTS (SELECT 1 FROM public.exam_content_items c WHERE c.storage_path = objects.name AND c.published = true)
  )
);