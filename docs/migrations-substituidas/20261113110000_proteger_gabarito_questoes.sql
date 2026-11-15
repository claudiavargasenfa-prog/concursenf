-- Protege o gabarito das questões contra leitura direta pelo cliente.
-- A listagem pública retorna somente enunciado e alternativas.
-- A RPC de correção será criada na migration seguinte, junto com o registro protegido da tentativa.

DROP POLICY IF EXISTS "Public reads published exam questions"
ON public.exam_questions;

CREATE OR REPLACE FUNCTION public.get_published_exam_questions(
  p_exam_slug text DEFAULT 'ebserh-hubrasil'
)
RETURNS TABLE (
  id uuid,
  audience text,
  subject text,
  topic text,
  difficulty text,
  statement text,
  options jsonb,
  reference text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT
    q.id,
    q.audience,
    q.subject,
    q.topic,
    q.difficulty,
    q.statement,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('id', option_item.value ->> 'id', 'text', option_item.value ->> 'text') ORDER BY option_item.ordinality)
      FROM jsonb_array_elements(CASE WHEN jsonb_typeof(q.options) = 'array' THEN q.options ELSE '[]'::jsonb END)
      WITH ORDINALITY AS option_item(value, ordinality)
      WHERE jsonb_typeof(option_item.value) = 'object' AND option_item.value ? 'id' AND option_item.value ? 'text'), '[]'::jsonb),
    q.reference
  FROM public.exam_questions AS q
  WHERE q.published = true
    AND q.exam_slug = p_exam_slug
    AND auth.uid() IS NOT NULL
  ORDER BY q.subject, q.topic, q.created_at, q.id;
$function$;



REVOKE ALL ON FUNCTION public.get_published_exam_questions(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_published_exam_questions(text) TO authenticated;
