import { supabase } from "@/integrations/supabase/client";

type ReviewQueryResult = { data: unknown; error: { message: string } | null };
type ReviewQuery = PromiseLike<ReviewQueryResult> & {
  select(columns: string): ReviewQuery;
  eq(column: string, value: unknown): ReviewQuery;
  lte(column: string, value: unknown): ReviewQuery;
  is(column: string, value: null | boolean): ReviewQuery;
  order(column: string, options?: { ascending?: boolean }): ReviewQuery;
  insert(values: Record<string, unknown>): ReviewQuery;
  update(values: Record<string, unknown>): ReviewQuery;
  single(): Promise<ReviewQueryResult>;
};
const db = supabase as unknown as { from(table: string): ReviewQuery };

export type ReviewSchedule = {
  id: string;
  subject_id: string;
  topic_id: string;
  source_type: "content" | "question" | "flashcard" | "simulation";
  source_id: string | null;
  due_at: string;
  completed_at: string | null;
};

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Entre na sua conta para acessar suas revisões.");
  return data.user;
}

export async function getMyDueReviews(): Promise<ReviewSchedule[]> {
  const user = await requireUser();
  const { data, error } = await db.from("review_schedules").select("*")
    .eq("user_id", user.id).is("completed_at", null)
    .lte("due_at", new Date().toISOString()).order("due_at");
  if (error) throw error;
  return (data ?? []) as ReviewSchedule[];
}

export async function scheduleTopicReview(input: {
  subjectId: string;
  topicId: string;
  sourceType: ReviewSchedule["source_type"];
  sourceId?: string | null;
  dueAt: string;
}) {
  const user = await requireUser();
  if (!Number.isFinite(Date.parse(input.dueAt))) throw new Error("Informe uma data válida para a revisão.");
  const { data, error } = await db.from("review_schedules").insert({
    user_id: user.id,
    subject_id: input.subjectId,
    topic_id: input.topicId,
    source_type: input.sourceType,
    source_id: input.sourceId ?? null,
    due_at: input.dueAt,
  }).select("*").single();
  if (error) throw error;
  return data as ReviewSchedule;
}

export async function completeTopicReview(reviewId: string) {
  const user = await requireUser();
  const { data, error } = await db.from("review_schedules")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", reviewId).eq("user_id", user.id)
    .select("*").single();
  if (error) throw error;
  return data as ReviewSchedule;
}
