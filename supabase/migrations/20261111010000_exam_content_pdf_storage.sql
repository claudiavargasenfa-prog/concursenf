-- Permite anexar PDFs diretamente aos conteúdos da trilha EBSERH / HU Brasil.
alter table public.exam_content_items add column if not exists storage_path text;

alter table public.exam_content_items drop constraint if exists exam_content_resource_check;
alter table public.exam_content_items add constraint exam_content_resource_check check (
  (content_type = 'pdf' and (resource_url is not null or storage_path is not null))
  or (content_type in ('audio','video','link') and resource_url is not null)
  or content_type in ('texto','mapa_mental')
);

drop policy if exists "Public can read published contest files" on storage.objects;
create policy "Public can read published contest files" on storage.objects for select using (
  bucket_id = 'concursenf-materiais'
  and (
    public.is_catalog_admin()
    or exists (
      select 1 from public.material_documents d
      where d.storage_path = storage.objects.name and d.published = true
    )
    or exists (
      select 1 from public.exam_content_items c
      where c.storage_path = storage.objects.name and c.published = true
    )
  )
);
