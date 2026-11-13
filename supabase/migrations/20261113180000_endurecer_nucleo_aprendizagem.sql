-- Endurecimento do retorno de alternativas e isolamento do progresso.
CREATE OR REPLACE FUNCTION public.get_published_exam_questions(p_exam_slug text DEFAULT 'ebserh-hubrasil')
RETURNS TABLE (id uuid, subject_id uuid, topic_id uuid, audience text, subject text, topic text, difficulty text, statement text, options jsonb, reference text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public, auth AS $function$
  SELECT q.id, q.subject_id, q.topic_id, q.audience, q.subject, q.topic, q.difficulty, q.statement,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('id', option_item.value ->> 'id', 'text', option_item.value ->> 'text') ORDER BY option_item.ordinality)
      FROM jsonb_array_elements(CASE WHEN jsonb_typeof(q.options) = 'array' THEN q.options ELSE '[]'::jsonb END)
      WITH ORDINALITY AS option_item(value, ordinality)
      WHERE jsonb_typeof(option_item.value) = 'object' AND option_item.value ? 'id' AND option_item.value ? 'text'), '[]'::jsonb),
    q.reference
  FROM public.exam_questions q
  WHERE q.published = true AND q.exam_slug = p_exam_slug AND auth.uid() IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.exam_question_attempts a WHERE a.user_id = auth.uid() AND a.question_id = q.id)
  ORDER BY q.subject, q.topic, q.created_at, q.id;
$function$;
REVOKE ALL ON FUNCTION public.get_published_exam_questions(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_published_exam_questions(text) TO authenticated;
DROP POLICY IF EXISTS "Users manage own learning progress" ON public.learning_progress;
DROP POLICY IF EXISTS "Users read own learning progress" ON public.learning_progress;
CREATE POLICY "Users read own learning progress" ON public.learning_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- Os contadores de questões permanecem atualizados exclusivamente pela RPC de resposta.
