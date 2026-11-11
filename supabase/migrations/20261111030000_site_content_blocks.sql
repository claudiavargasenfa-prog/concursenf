-- Conteúdos editáveis para os componentes originais do site e da plataforma.
create table if not exists public.site_content_blocks (
  block_key text primary key,
  page_key text not null check (page_key in ('home','concurso','academicos','global')),
  label text not null,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_content_blocks enable row level security;

drop policy if exists "Public reads site content blocks" on public.site_content_blocks;
create policy "Public reads site content blocks" on public.site_content_blocks
for select using (true);

drop policy if exists "Admins manage site content blocks" on public.site_content_blocks;
create policy "Admins manage site content blocks" on public.site_content_blocks
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

insert into public.site_content_blocks (block_key,page_key,label,content) values
('lp.hero','concurso','Landing page — chamada principal',jsonb_build_object(
  'badge','Desenvolvido por quem vive a enfermagem e domina as bancas há décadas.',
  'title','Domine a Legislação do SUS e da EBSERH',
  'highlight','Blinde sua Mente contra as Pegadinhas da FGV',
  'description','Um método neuroadaptativo com mapas mentais esquematizados dos pontos que realmente caem, criado para quem não tem tempo a perder com PDFs gigantes.',
  'button','Quero ser aprovado na EBSERH',
  'image',''
)),
('lp.proof','concurso','Landing page — benefícios e apresentação',jsonb_build_object(
  'eyebrow','Uma rotina mais organizada',
  'title','Estudar para concurso exige método, constância e bons materiais.',
  'description','O Combo Aprovação foi estruturado para reunir assuntos importantes em uma sequência de consulta e revisão.',
  'pains',jsonb_build_array(
    'Está cansada de estudar por horas e sentir que não consegue absorver nada do conteúdo estudado.',
    'Está procurando um método de estudos que se encaixe na sua rotina e que te permita aprender mais, estudando menos horas por dia.',
    'Quer um conteúdo de fácil entendimento, para não precisar reler a mesma página diversas vezes.'
  ),
  'featureTitle','Conteúdo visual para facilitar a revisão.',
  'featureDescription','Consulte a organização dos temas e identifique os assuntos que fazem sentido para o edital que você está estudando.',
  'mockup',''
)),
('lp.contents','concurso','Landing page — biblioteca e materiais',jsonb_build_object(
  'eyebrow','Biblioteca do Combo',
  'title','Explore as disciplinas e os assuntos',
  'description','Abra cada disciplina para consultar os tópicos que já estão organizados no catálogo.',
  'bonusTitle','Recursos adicionais descritos no catálogo'
)),
('lp.offer','concurso','Landing page — oferta e apresentação',jsonb_build_object(
  'eyebrow','Conheça o material',
  'title','Combo Aprovação',
  'description','Uma proposta de organização de conteúdos para apoiar a preparação de técnicas e enfermeiros em concursos públicos. Consulte as disciplinas, avalie a compatibilidade com seu edital e confirme as condições antes de adquirir.',
  'button','Interesse no Combo Aprovação',
  'authorTitle','Experiência dedicada à enfermagem e à educação.',
  'authorName','Cláudia Vargas',
  'authorRole','Idealização — Enfermeira',
  'authorEmail','contato@academiadaenfermagem.com.br',
  'authorBio',jsonb_build_array(
    'Sou enfermeira e idealizadora deste projeto. Há anos ajudo estudantes e profissionais de enfermagem a estudarem de forma mais leve e objetiva.',
    'Reuni nesses materiais conteúdos em resumos ilustrados e diretos ao ponto, para facilitar a compreensão e a revisão.',
    'Aprovação é resultado de estratégia, constância e preparação.'
  ),
  'authorImage',''
)),
('home.hero','home','Página inicial — apresentação',jsonb_build_object(
  'title','Preparação inteligente para concursos de enfermagem',
  'description','Organize seus estudos com conteúdos esquematizados, trilhas por disciplina e materiais para técnicos e enfermeiros.',
  'button','Conheça a plataforma',
  'image',''
)),
('global.footer','global','Rodapé do site',jsonb_build_object(
  'brand','ConcursEnf',
  'description','Preparação organizada para concursos e formação em enfermagem.',
  'contact','contato@academiadaenfermagem.com.br'
))
on conflict (block_key) do nothing;

create or replace function public.set_site_content_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_blocks_updated_at on public.site_content_blocks;
create trigger site_content_blocks_updated_at before update on public.site_content_blocks
for each row execute function public.set_site_content_updated_at();
