import { supabase } from "@/integrations/supabase/client";
import type { LearningActivityType } from "./types";

type LearningQueryResult = { data: unknown; error: { message: string } | null };
type LearningQuery = PromiseLike<LearningQueryResult> & {
  select(columns: string): LearningQuery;
  eq(column: string, value: unknown): LearningQuery;
  in(column: string, values: unknown[]): LearningQuery;
  order(column: string, options?: { ascending?: boolean }): LearningQuery;
  insert(values: Record<string, unknown>): LearningQuery;
  upsert(values: Record<string, unknown>, options?: { onConflict?: string }): LearningQuery;
  single(): Promise<LearningQueryResult>;
  maybeSingle(): Promise<LearningQueryResult>;
};
const db = supabase as unknown as { from(table: string): LearningQuery };

export async function recordStudySession(input: {
  activityType: LearningActivityType;
  subjectId?: string | null;
  topicId?: string | null;
  sourceId?: string | null;
  durationSeconds?: number;
  completed?: boolean;
  metadata?: Record<string, unknown>;
}) {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Entre na sua conta para registrar sua atividade.");

  const { data, error } = await db.from("study_sessions").insert({
    user_id: auth.user.id,
    activity_type: input.activityType,
    subject_id: input.subjectId ?? null,
    topic_id: input.topicId ?? null,
    source_id: input.sourceId ?? null,
    duration_seconds: input.durationSeconds ?? 0,
    completed: input.completed ?? false,
    metadata: input.metadata ?? {},
    completed_at: input.completed ? new Date().toISOString() : null,
  }).select("*").single();
  if (error) throw error;
  return data;
}

export async function recordFlashcardReview(input: {
  flashcardId: string;
  rating: number;
  responseSeconds?: number | null;
  nextReviewAt?: string | null;
}) {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Entre na sua conta para registrar sua revisão.");
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("A avaliação da revisão deve estar entre 1 e 5.");
  }

  const { data, error } = await db.from("flashcard_reviews").insert({
    user_id: auth.user.id,
    flashcard_id: input.flashcardId,
    rating: input.rating,
    response_seconds: input.responseSeconds ?? null,
    next_review_at: input.nextReviewAt ?? null,
  }).select("*").single();
  if (error) throw error;
  return data;
}
