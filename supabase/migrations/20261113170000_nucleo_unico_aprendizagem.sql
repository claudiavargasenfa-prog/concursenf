-- Núcleo único de aprendizagem: catálogo curricular compartilhado e progresso individual.
-- Migração aditiva: preserva tabelas, conteúdos e registros existentes.

CREATE TABLE IF NOT EXISTS public.learning_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_subjects_exam_name_unique UNIQUE (exam_slug, name),
  CONSTRAINT learning_subjects_exam_slug_unique UNIQUE (exam_slug, slug)
);

CREATE TABLE IF NOT EXISTS public.learning_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.learning_subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_topics_subject_name_unique UNIQUE (subject_id, name),
  CONSTRAINT learning_topics_subject_slug_unique UNIQUE (subject_id, slug),
  CONSTRAINT learning_topics_subject_id_unique UNIQUE (subject_id, id)
);

-- Vínculos opcionais mantêm compatibilidade com cadastros legados.
ALTER TABLE public.exam_content_items
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL;

ALTER TABLE public.exam_questions
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL;

ALTER TABLE public.exam_flashcards
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL;

-- Backfill sem sobrescrever nomes ou excluir registros: cria o catálogo a partir
-- dos valores já existentes nos três módulos.
INSERT INTO public.learning_subjects (exam_slug, name, slug)
SELECT DISTINCT source.exam_slug, source.subject,
       trim(both '-' from regexp_replace(lower(unaccent(source.subject)), '[^a-z0-9]+', '-', 'g'))
FROM (
  SELECT exam_slug, subject FROM public.exam_content_items
  UNION
  SELECT exam_slug, subject FROM public.exam_questions
  UNION
  SELECT exam_slug, subject FROM public.exam_flashcards
) AS source
WHERE nullif(trim(source.subject), '') IS NOT NULL
ON CONFLICT (exam_slug, name) DO NOTHING;

-- Normaliza colisões de slug mantendo o nome original como chave única.
WITH ranked AS (
  SELECT id, exam_slug, slug,
         row_number() OVER (PARTITION BY exam_slug, slug ORDER BY name, id) AS position
  FROM public.learning_subjects
)
UPDATE public.learning_subjects AS target
SET slug = target.slug || '-' || substr(target.id::text, 1, 8)
FROM ranked
WHERE target.id = ranked.id AND ranked.position > 1;

INSERT INTO public.learning_topics (subject_id, name, slug)
SELECT DISTINCT s.id, source.topic,
       trim(both '-' from regexp_replace(lower(unaccent(source.topic)), '[^a-z0-9]+', '-', 'g'))
FROM (
  SELECT exam_slug, subject, topic FROM public.exam_content_items
  UNION
  SELECT exam_slug, subject, topic FROM public.exam_questions
  UNION
  SELECT exam_slug, subject, topic FROM public.exam_flashcards
) AS source
JOIN public.learning_subjects AS s
  ON s.exam_slug = source.exam_slug AND s.name = source.subject
WHERE nullif(trim(source.topic), '') IS NOT NULL
ON CONFLICT (subject_id, name) DO NOTHING;

WITH ranked AS (
  SELECT id, subject_id, slug,
         row_number() OVER (PARTITION BY subject_id, slug ORDER BY name, id) AS position
  FROM public.learning_topics
)
UPDATE public.learning_topics AS target
SET slug = target.slug || '-' || substr(target.id::text, 1, 8)
FROM ranked
WHERE target.id = ranked.id AND ranked.position > 1;

UPDATE public.exam_content_items AS item
SET subject_id = subject.id, topic_id = topic.id
FROM public.learning_subjects AS subject
LEFT JOIN public.learning_topics AS topic ON topic.subject_id = subject.id
WHERE item.subject_id IS NULL
  AND item.exam_slug = subject.exam_slug
  AND item.subject = subject.name
  AND (topic.id IS NULL OR topic.name = item.topic);

UPDATE public.exam_questions AS item
SET subject_id = subject.id, topic_id = topic.id
FROM public.learning_subjects AS subject
LEFT JOIN public.learning_topics AS topic ON topic.subject_id = subject.id
WHERE item.subject_id IS NULL
  AND item.exam_slug = subject.exam_slug
  AND item.subject = subject.name
  AND (topic.id IS NULL OR topic.name = item.topic);

UPDATE public.exam_flashcards AS item
SET subject_id = subject.id, topic_id = topic.id
FROM public.learning_subjects AS subject
LEFT JOIN public.learning_topics AS topic ON topic.subject_id = subject.id
WHERE item.subject_id IS NULL
  AND item.exam_slug = subject.exam_slug
  AND item.subject = subject.name
  AND (topic.id IS NULL OR topic.name = item.topic);

CREATE INDEX IF NOT EXISTS learning_topics_subject_order_idx
  ON public.learning_topics(subject_id, active, sort_order);
CREATE INDEX IF NOT EXISTS exam_content_learning_topic_idx
  ON public.exam_content_items(subject_id, topic_id, published);
CREATE INDEX IF NOT EXISTS exam_questions_learning_topic_idx
  ON public.exam_questions(subject_id, topic_id, published);
CREATE INDEX IF NOT EXISTS exam_flashcards_learning_topic_idx
  ON public.exam_flashcards(subject_id, topic_id, published);

-- Histórico estruturado de estudo e revisão por aluno e assunto.
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.learning_subjects(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.learning_topics(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','needs_review','mastered')),
  confidence smallint CHECK (confidence BETWEEN 1 AND 5),
  questions_answered integer NOT NULL DEFAULT 0 CHECK (questions_answered >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  last_studied_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_progress_user_topic_unique UNIQUE (user_id, topic_id),
  CONSTRAINT learning_progress_correct_lte_answered CHECK (correct_answers <= questions_answered)
);
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own learning progress" ON public.learning_progress;
CREATE POLICY "Users manage own learning progress"
ON public.learning_progress FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('content','question','flashcard','simulation','review')),
  source_id uuid,
  duration_seconds integer NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  completed boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS study_sessions_user_date_idx
  ON public.study_sessions(user_id, started_at DESC);
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own study sessions" ON public.study_sessions;
CREATE POLICY "Users manage own study sessions"
ON public.study_sessions FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id uuid NOT NULL REFERENCES public.exam_flashcards(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  next_review_at timestamptz,
  response_seconds integer CHECK (response_seconds IS NULL OR response_seconds >= 0)
);
CREATE INDEX IF NOT EXISTS flashcard_reviews_user_next_idx
  ON public.flashcard_reviews(user_id, next_review_at);
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own flashcard reviews" ON public.flashcard_reviews;
CREATE POLICY "Users manage own flashcard reviews"
ON public.flashcard_reviews FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.review_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.learning_subjects(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.learning_topics(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (source_type IN ('content','question','flashcard','simulation')),
  source_id uuid,
  due_at timestamptz NOT NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT review_schedules_user_topic_source_unique UNIQUE (user_id, topic_id, source_type, source_id)
);
CREATE INDEX IF NOT EXISTS review_schedules_user_due_idx
  ON public.review_schedules(user_id, due_at) WHERE completed_at IS NULL;
ALTER TABLE public.review_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own review schedules" ON public.review_schedules;
CREATE POLICY "Users manage own review schedules"
ON public.review_schedules FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- A tentativa já existente é reaproveitada, agora com classificação curricular.
ALTER TABLE public.exam_question_attempts
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_correct boolean;

UPDATE public.exam_question_attempts AS attempt
SET subject_id = question.subject_id,
    topic_id = question.topic_id,
    is_correct = (question.correct_option = attempt.selected_option)
FROM public.exam_questions AS question
WHERE question.id = attempt.question_id
  AND (attempt.subject_id IS NULL OR attempt.topic_id IS NULL OR attempt.is_correct IS NULL);

CREATE INDEX IF NOT EXISTS exam_question_attempts_user_topic_idx
  ON public.exam_question_attempts(user_id, subject_id, topic_id, created_at DESC);

-- Simulados ficam preparados para reutilizar questões e o mesmo catálogo curricular.
CREATE TABLE IF NOT EXISTS public.exam_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug text NOT NULL,
  title text NOT NULL,
  description text,
  audience text NOT NULL DEFAULT 'todos'
    CHECK (audience IN ('todos','enfermeiro','tecnico','auxiliar')),
  duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  question_ids uuid[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.exam_simulation_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id uuid NOT NULL REFERENCES public.exam_simulations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(answers) = 'object'),
  total_questions integer NOT NULL DEFAULT 0 CHECK (total_questions >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT simulation_attempt_correct_lte_total CHECK (correct_answers <= total_questions)
);
CREATE INDEX IF NOT EXISTS simulation_attempts_user_date_idx
  ON public.exam_simulation_attempts(user_id, started_at DESC);

ALTER TABLE public.exam_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_simulation_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reads published simulations" ON public.exam_simulations;
CREATE POLICY "Public reads published simulations"
ON public.exam_simulations FOR SELECT TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "Admins manage simulations" ON public.exam_simulations;
CREATE POLICY "Admins manage simulations"
ON public.exam_simulations FOR ALL TO authenticated
USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());
DROP POLICY IF EXISTS "Users manage own simulation attempts" ON public.exam_simulation_attempts;
CREATE POLICY "Users manage own simulation attempts"
ON public.exam_simulation_attempts FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Catálogo é público apenas para leitura; administração permanece restrita.
ALTER TABLE public.learning_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reads active learning subjects" ON public.learning_subjects;
CREATE POLICY "Public reads active learning subjects"
ON public.learning_subjects FOR SELECT TO anon, authenticated USING (active = true);
DROP POLICY IF EXISTS "Admins manage learning subjects" ON public.learning_subjects;
CREATE POLICY "Admins manage learning subjects"
ON public.learning_subjects FOR ALL TO authenticated
USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());
DROP POLICY IF EXISTS "Public reads active learning topics" ON public.learning_topics;
CREATE POLICY "Public reads active learning topics"
ON public.learning_topics FOR SELECT TO anon, authenticated USING (active = true);
DROP POLICY IF EXISTS "Admins manage learning topics" ON public.learning_topics;
CREATE POLICY "Admins manage learning topics"
ON public.learning_topics FOR ALL TO authenticated
USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());

-- A RPC mantém a correção no servidor e registra o vínculo curricular.
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
    SELECT 1 FROM public.exam_questions q
    WHERE q.id = p_question_id AND q.published = true
      AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(q.options) option_item(value)
        WHERE option_item.value ->> 'id' = btrim(p_selected_option)
      )
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.exam_question_attempts(
    user_id, question_id, selected_option, subject_id, topic_id, is_correct
  )
  SELECT v_user_id, q.id, btrim(p_selected_option), q.subject_id, q.topic_id,
         (q.correct_option = btrim(p_selected_option))
  FROM public.exam_questions q
  WHERE q.id = p_question_id AND q.published = true
  ON CONFLICT (user_id, question_id) DO NOTHING;

  SELECT a.selected_option INTO v_saved_option
  FROM public.exam_question_attempts a
  WHERE a.user_id = v_user_id AND a.question_id = p_question_id;

  IF v_saved_option IS DISTINCT FROM btrim(p_selected_option) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT q.correct_option = v_saved_option, q.correct_option, q.explanation, q.reference
  FROM public.exam_questions q
  WHERE q.id = p_question_id AND q.published = true;
END;
$function$;

REVOKE ALL ON FUNCTION public.submit_exam_question_answer(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_exam_question_answer(uuid, text) TO authenticated;
