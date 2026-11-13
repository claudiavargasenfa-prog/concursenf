-- Protege o gabarito das questões contra leitura direta pelo cliente.
-- A listagem pública retorna somente enunciado e alternativas.
-- A correção é consultada separadamente após o envio da alternativa escolhida.

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
    q.options,
    q.reference
  FROM public.exam_questions AS q
  WHERE q.published = true
    AND q.exam_slug = p_exam_slug
  ORDER BY q.subject, q.topic, q.created_at, q.id;
$function$;

CREATE OR REPLACE FUNCTION public.submit_exam_question_answer(
  p_question_id uuid,
  p_selected_option text
)
RETURNS TABLE (
  is_correct boolean,
  correct_option text,
  explanation text,
  reference text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
  SELECT
    q.correct_option = btrim(p_selected_option),
    q.correct_option,
    q.explanation,
    q.reference
  FROM public.exam_questions AS q
  WHERE q.id = p_question_id
    AND q.published = true
    AND p_selected_option IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM jsonb_array_elements(q.options) AS option_item(value)
      WHERE option_item.value ->> 'id' = btrim(p_selected_option)
    );
$function$;

REVOKE ALL ON FUNCTION public.get_published_exam_questions(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_exam_question_answer(uuid, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_published_exam_questions(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_exam_question_answer(uuid, text) TO anon, authenticated;
