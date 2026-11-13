-- Remove da lista as questões que o aluno já respondeu.
-- A função permanece sem retornar gabarito ou explicação na listagem.
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
    q.options,
    q.reference
  FROM public.exam_questions AS q
  WHERE q.published = true
    AND q.exam_slug = p_exam_slug
    AND (
      auth.uid() IS NULL
      OR NOT EXISTS (
        SELECT 1
        FROM public.exam_question_attempts AS a
        WHERE a.user_id = auth.uid()
          AND a.question_id = q.id
      )
    )
  ORDER BY q.subject, q.topic, q.created_at, q.id;
$function$;

REVOKE ALL ON FUNCTION public.get_published_exam_questions(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_published_exam_questions(text) TO authenticated;
