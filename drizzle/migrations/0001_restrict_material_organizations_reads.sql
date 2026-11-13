DROP POLICY IF EXISTS "Public reads material organizations" ON public.material_organizations;
CREATE POLICY "Public reads organizations of published contests" ON public.material_organizations
FOR SELECT TO public
USING (
  public.is_catalog_admin()
  OR EXISTS (SELECT 1 FROM public.material_contests c WHERE c.organization_id = material_organizations.id AND c.published = true)
);