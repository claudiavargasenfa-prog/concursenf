-- Reforça as permissões administrativas de flashcards.
-- Mantém leitura pública apenas dos itens publicados.
DROP POLICY IF EXISTS "Admins manage exam flashcards" ON public.exam_flashcards;
CREATE POLICY "Admins manage exam flashcards"
ON public.exam_flashcards
FOR ALL
TO authenticated
USING (public.is_catalog_admin())
WITH CHECK (public.is_catalog_admin());

DROP POLICY IF EXISTS "Public reads published exam flashcards" ON public.exam_flashcards;
CREATE POLICY "Public reads published exam flashcards"
ON public.exam_flashcards
FOR SELECT
TO anon, authenticated
USING (published = true);

-- Um único envio de resposta por aluno e questão impede tentativa sequencial
-- de alternativas para descobrir o gabarito por chamadas repetidas à API.
CREATE TABLE IF NOT EXISTS public.exam_question_attempts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  selected_option text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);
ALTER TABLE public.exam_question_attempts ENABLE ROW LEVEL SECURITY;

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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_saved_option text;
BEGIN
  IF v_user_id IS NULL OR p_selected_option IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.exam_questions q
    WHERE q.id = p_question_id
      AND q.published = true
      AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(q.options) option_item(value)
        WHERE option_item.value ->> 'id' = btrim(p_selected_option)
      )
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.exam_question_attempts(user_id, question_id, selected_option)
  VALUES (v_user_id, p_question_id, btrim(p_selected_option))
  ON CONFLICT (user_id, question_id) DO NOTHING;

  SELECT a.selected_option
  INTO v_saved_option
  FROM public.exam_question_attempts a
  WHERE a.user_id = v_user_id
    AND a.question_id = p_question_id;

  -- Repetições da mesma alternativa podem recuperar a correção após falha de rede.
  -- Uma alternativa diferente não recebe o gabarito.
  IF v_saved_option IS DISTINCT FROM btrim(p_selected_option) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    q.correct_option = v_saved_option,
    q.correct_option,
    q.explanation,
    q.reference
  FROM public.exam_questions q
  WHERE q.id = p_question_id
    AND q.published = true;
END;
$function$;

REVOKE ALL ON FUNCTION public.submit_exam_question_answer(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_exam_question_answer(uuid, text) TO authenticated;

-- Histórico de questões e plano de estudos sincronizados por conta.
CREATE TABLE IF NOT EXISTS public.exam_practice_history (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  attempts jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(attempts) = 'array'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_practice_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own exam practice history" ON public.exam_practice_history;
CREATE POLICY "Users manage own exam practice history"
ON public.exam_practice_history
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.exam_study_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(plan) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_study_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own exam study plan" ON public.exam_study_plans;
CREATE POLICY "Users manage own exam study plan"
ON public.exam_study_plans
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
