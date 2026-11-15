DROP POLICY IF EXISTS "Public reads published exam questions" ON public.exam_questions;

DROP POLICY IF EXISTS "Admins manage exam flashcards" ON public.exam_flashcards;
CREATE POLICY "Admins manage exam flashcards" ON public.exam_flashcards FOR ALL TO authenticated
USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());

CREATE TABLE IF NOT EXISTS public.learning_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug text NOT NULL, name text NOT NULL, slug text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_subjects_exam_name_unique UNIQUE (exam_slug, name),
  CONSTRAINT learning_subjects_exam_slug_unique UNIQUE (exam_slug, slug)
);
CREATE TABLE IF NOT EXISTS public.learning_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.learning_subjects(id) ON DELETE CASCADE,
  name text NOT NULL, slug text NOT NULL, description text,
  sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_topics_subject_name_unique UNIQUE (subject_id, name),
  CONSTRAINT learning_topics_subject_slug_unique UNIQUE (subject_id, slug),
  CONSTRAINT learning_topics_subject_id_unique UNIQUE (subject_id, id)
);
GRANT SELECT ON public.learning_subjects, public.learning_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_subjects, public.learning_topics TO authenticated;
GRANT ALL ON public.learning_subjects, public.learning_topics TO service_role;
ALTER TABLE public.learning_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active learning subjects" ON public.learning_subjects FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage learning subjects" ON public.learning_subjects FOR ALL TO authenticated USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());
CREATE POLICY "Public reads active learning topics" ON public.learning_topics FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage learning topics" ON public.learning_topics FOR ALL TO authenticated USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());

ALTER TABLE public.exam_content_items
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL;
ALTER TABLE public.exam_questions
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL;
ALTER TABLE public.exam_flashcards
  ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS learning_topics_subject_order_idx ON public.learning_topics(subject_id, active, sort_order);
CREATE INDEX IF NOT EXISTS exam_content_learning_topic_idx ON public.exam_content_items(subject_id, topic_id, published);
CREATE INDEX IF NOT EXISTS exam_questions_learning_topic_idx ON public.exam_questions(subject_id, topic_id, published);
CREATE INDEX IF NOT EXISTS exam_flashcards_learning_topic_idx ON public.exam_flashcards(subject_id, topic_id, published);

CREATE TABLE IF NOT EXISTS public.exam_question_attempts (
  user_id uuid NOT NULL,
  question_id uuid NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  selected_option text NOT NULL,
  subject_id uuid REFERENCES public.learning_subjects(id) ON DELETE SET NULL,
  topic_id uuid REFERENCES public.learning_topics(id) ON DELETE SET NULL,
  is_correct boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);
CREATE INDEX IF NOT EXISTS exam_question_attempts_user_topic_idx ON public.exam_question_attempts(user_id, subject_id, topic_id, created_at DESC);
GRANT SELECT ON public.exam_question_attempts TO authenticated;
GRANT ALL ON public.exam_question_attempts TO service_role;
ALTER TABLE public.exam_question_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own question attempts" ON public.exam_question_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.exam_practice_history (
  user_id uuid PRIMARY KEY,
  attempts jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(attempts) = 'array'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.exam_study_plans (
  user_id uuid PRIMARY KEY,
  plan jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(plan) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_practice_history, public.exam_study_plans TO authenticated;
GRANT ALL ON public.exam_practice_history, public.exam_study_plans TO service_role;
ALTER TABLE public.exam_practice_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exam practice history" ON public.exam_practice_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own exam study plan" ON public.exam_study_plans FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL, topic_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','needs_review','mastered')),
  confidence smallint CHECK (confidence BETWEEN 1 AND 5),
  questions_answered integer NOT NULL DEFAULT 0 CHECK (questions_answered >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  last_studied_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_progress_user_topic_unique UNIQUE (user_id, topic_id),
  CONSTRAINT learning_progress_topic_subject_fk FOREIGN KEY (subject_id, topic_id) REFERENCES public.learning_topics(subject_id, id) ON DELETE CASCADE,
  CONSTRAINT learning_progress_correct_lte_answered CHECK (correct_answers <= questions_answered)
);
GRANT SELECT ON public.learning_progress TO authenticated;
GRANT ALL ON public.learning_progress TO service_role;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own learning progress" ON public.learning_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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
CREATE INDEX IF NOT EXISTS study_sessions_user_date_idx ON public.study_sessions(user_id, started_at DESC);
GRANT SELECT, INSERT ON public.study_sessions TO authenticated;
GRANT ALL ON public.study_sessions TO service_role;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own study sessions" ON public.study_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users log own non-question sessions" ON public.study_sessions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND activity_type <> 'question');

CREATE TABLE IF NOT EXISTS public.flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  flashcard_id uuid NOT NULL REFERENCES public.exam_flashcards(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  next_review_at timestamptz,
  response_seconds integer CHECK (response_seconds IS NULL OR response_seconds >= 0)
);
CREATE INDEX IF NOT EXISTS flashcard_reviews_user_next_idx ON public.flashcard_reviews(user_id, next_review_at);
GRANT SELECT, INSERT ON public.flashcard_reviews TO authenticated;
GRANT ALL ON public.flashcard_reviews TO service_role;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own flashcard reviews" ON public.flashcard_reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own flashcard reviews" ON public.flashcard_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.review_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL, topic_id uuid NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('content','question','flashcard','simulation')),
  source_id uuid,
  due_at timestamptz NOT NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT review_schedules_user_topic_source_unique UNIQUE (user_id, topic_id, source_type, source_id),
  CONSTRAINT review_schedules_topic_subject_fk FOREIGN KEY (subject_id, topic_id) REFERENCES public.learning_topics(subject_id, id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS review_schedules_user_due_idx ON public.review_schedules(user_id, due_at) WHERE completed_at IS NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_schedules TO authenticated;
GRANT ALL ON public.review_schedules TO service_role;
ALTER TABLE public.review_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own review schedules" ON public.review_schedules FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.exam_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug text NOT NULL, title text NOT NULL, description text,
  audience text NOT NULL DEFAULT 'todos' CHECK (audience IN ('todos','enfermeiro','tecnico','auxiliar')),
  duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.exam_simulation_questions (
  simulation_id uuid NOT NULL REFERENCES public.exam_simulations(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.exam_questions(id) ON DELETE RESTRICT,
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  PRIMARY KEY (simulation_id, question_id),
  CONSTRAINT simulation_question_position_unique UNIQUE (simulation_id, position)
);
CREATE INDEX IF NOT EXISTS simulation_questions_question_idx ON public.exam_simulation_questions(question_id);
CREATE TABLE IF NOT EXISTS public.exam_simulation_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id uuid NOT NULL REFERENCES public.exam_simulations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(answers) = 'object'),
  total_questions integer NOT NULL DEFAULT 0 CHECK (total_questions >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT simulation_attempt_correct_lte_total CHECK (correct_answers <= total_questions)
);
CREATE INDEX IF NOT EXISTS simulation_attempts_user_date_idx ON public.exam_simulation_attempts(user_id, started_at DESC);
GRANT SELECT ON public.exam_simulations, public.exam_simulation_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_simulations, public.exam_simulation_questions TO authenticated;
GRANT SELECT, INSERT ON public.exam_simulation_attempts TO authenticated;
GRANT ALL ON public.exam_simulations, public.exam_simulation_questions, public.exam_simulation_attempts TO service_role;
ALTER TABLE public.exam_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_simulation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_simulation_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published simulations" ON public.exam_simulations FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage simulations" ON public.exam_simulations FOR ALL TO authenticated USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());
CREATE POLICY "Public reads questions in published simulations" ON public.exam_simulation_questions FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.exam_simulations s WHERE s.id = simulation_id AND s.published = true));
CREATE POLICY "Admins manage simulation questions" ON public.exam_simulation_questions FOR ALL TO authenticated USING (public.is_catalog_admin()) WITH CHECK (public.is_catalog_admin());
CREATE POLICY "Users read own simulation attempts" ON public.exam_simulation_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users start own simulation attempts" ON public.exam_simulation_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND total_questions = 0 AND correct_answers = 0 AND answers = '{}'::jsonb AND completed_at IS NULL);

DROP FUNCTION IF EXISTS public.get_published_exam_questions(text);
CREATE FUNCTION public.get_published_exam_questions(p_exam_slug text DEFAULT 'ebserh-hubrasil')
RETURNS TABLE (id uuid, subject_id uuid, topic_id uuid, audience text, subject text, topic text, difficulty text, statement text, options jsonb, reference text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public AS $function$
  SELECT q.id, q.subject_id, q.topic_id, q.audience, q.subject, q.topic, q.difficulty, q.statement,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('id', o.value ->> 'id', 'text', o.value ->> 'text') ORDER BY o.ordinality)
      FROM jsonb_array_elements(CASE WHEN jsonb_typeof(q.options) = 'array' THEN q.options ELSE '[]'::jsonb END) WITH ORDINALITY AS o(value, ordinality)
      WHERE jsonb_typeof(o.value) = 'object' AND o.value ? 'id' AND o.value ? 'text'), '[]'::jsonb),
    q.reference
  FROM public.exam_questions q
  WHERE q.published = true AND q.exam_slug = p_exam_slug AND auth.uid() IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.exam_question_attempts a WHERE a.user_id = auth.uid() AND a.question_id = q.id)
  ORDER BY q.subject, q.topic, q.created_at, q.id;
$function$;
REVOKE ALL ON FUNCTION public.get_published_exam_questions(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_published_exam_questions(text) TO authenticated;

DROP FUNCTION IF EXISTS public.submit_exam_question_answer(uuid, text);
CREATE FUNCTION public.submit_exam_question_answer(p_question_id uuid, p_selected_option text)
RETURNS TABLE (is_correct boolean, correct_option text, explanation text, reference text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_option text := btrim(p_selected_option);
  v_saved text; v_subject uuid; v_topic uuid; v_ok boolean; v_ins integer;
BEGIN
  IF v_user_id IS NULL OR v_option IS NULL OR v_option = '' THEN RETURN; END IF;
  SELECT q.subject_id, q.topic_id, (q.correct_option = v_option) INTO v_subject, v_topic, v_ok
  FROM public.exam_questions q
  WHERE q.id = p_question_id AND q.published = true
    AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(q.options) = 'array' THEN q.options ELSE '[]'::jsonb END) o(value)
                WHERE o.value ->> 'id' = v_option);
  IF NOT FOUND THEN RETURN; END IF;

  INSERT INTO public.exam_question_attempts(user_id, question_id, selected_option, subject_id, topic_id, is_correct)
  VALUES (v_user_id, p_question_id, v_option, v_subject, v_topic, v_ok)
  ON CONFLICT (user_id, question_id) DO NOTHING;
  GET DIAGNOSTICS v_ins = ROW_COUNT;

  IF v_ins = 1 THEN
    INSERT INTO public.study_sessions(user_id, subject_id, topic_id, activity_type, source_id, completed, metadata, completed_at)
    VALUES (v_user_id, v_subject, v_topic, 'question', p_question_id, true, jsonb_build_object('isCorrect', v_ok), now());
    IF v_subject IS NOT NULL AND v_topic IS NOT NULL THEN
      INSERT INTO public.learning_progress(user_id, subject_id, topic_id, status, questions_answered, correct_answers, last_studied_at)
      VALUES (v_user_id, v_subject, v_topic, CASE WHEN v_ok THEN 'in_progress' ELSE 'needs_review' END, 1, CASE WHEN v_ok THEN 1 ELSE 0 END, now())
      ON CONFLICT (user_id, topic_id) DO UPDATE SET
        questions_answered = public.learning_progress.questions_answered + 1,
        correct_answers = public.learning_progress.correct_answers + CASE WHEN v_ok THEN 1 ELSE 0 END,
        status = CASE WHEN NOT v_ok THEN 'needs_review' WHEN public.learning_progress.status = 'not_started' THEN 'in_progress' ELSE public.learning_progress.status END,
        last_studied_at = now(), updated_at = now();
    END IF;
  END IF;

  SELECT a.selected_option INTO v_saved FROM public.exam_question_attempts a WHERE a.user_id = v_user_id AND a.question_id = p_question_id;
  IF v_saved IS DISTINCT FROM v_option THEN RETURN; END IF;

  RETURN QUERY SELECT q.correct_option = v_saved, q.correct_option, q.explanation, q.reference
  FROM public.exam_questions q WHERE q.id = p_question_id AND q.published = true;
END;
$function$;
REVOKE ALL ON FUNCTION public.submit_exam_question_answer(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_exam_question_answer(uuid, text) TO authenticated;