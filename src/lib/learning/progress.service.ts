import { supabase } from "@/integrations/supabase/client";
import type { LearningProgress, LearningStatus } from "./types";

const db = supabase as any;

export async function getMyLearningProgress(input: {
  subjectId?: string;
  topicId?: string;
} = {}): Promise<LearningProgress[]> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Entre na sua conta para consultar seu progresso.");

  let query = db.from("learning_progress").select("*").eq("user_id", auth.user.id);
  if (input.subjectId) query = query.eq("subject_id", input.subjectId);
  if (input.topicId) query = query.eq("topic_id", input.topicId);
  const { data, error } = await query.order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LearningProgress[];
}

export async function updateMyTopicProgress(input: {
  subjectId: string;
  topicId: string;
  status?: LearningStatus;
  confidence?: number | null;
  questionsAnswered?: number;
  correctAnswers?: number;
  studiedNow?: boolean;
}) {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Entre na sua conta para atualizar seu progresso.");
  if (input.confidence != null && (!Number.isInteger(input.confidence) || input.confidence < 1 || input.confidence > 5)) {
    throw new Error("O nível de confiança deve estar entre 1 e 5.");
  }

  const { data: current, error: readError } = await db.from("learning_progress")
    .select("*").eq("user_id", auth.user.id).eq("topic_id", input.topicId).maybeSingle();
  if (readError) throw readError;
  const questionsAnswered = input.questionsAnswered ?? current?.questions_answered ?? 0;
  const correctAnswers = input.correctAnswers ?? current?.correct_answers ?? 0;
  if (correctAnswers > questionsAnswered) throw new Error("O total de acertos não pode superar o total de questões respondidas.");

  const payload = {
    user_id: auth.user.id,
    subject_id: input.subjectId,
    topic_id: input.topicId,
    status: input.status ?? current?.status ?? "in_progress",
    confidence: input.confidence === undefined ? current?.confidence ?? null : input.confidence,
    questions_answered: questionsAnswered,
    correct_answers: correctAnswers,
    last_studied_at: input.studiedNow ? new Date().toISOString() : current?.last_studied_at ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await db.from("learning_progress").upsert(payload, { onConflict: "user_id,topic_id" }).select("*").single();
  if (error) throw error;
  return data as LearningProgress;
}
