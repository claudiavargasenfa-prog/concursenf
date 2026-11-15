import { supabase } from "@/integrations/supabase/client";
import type { LearningProgress } from "./types";

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

// O progresso por assunto é atualizado exclusivamente pelo servidor ao corrigir cada questão.
