import { supabase } from "@/integrations/supabase/client";
import type { LearningCatalog, LearningContent, LearningSubject, LearningTopic, ProfessionalRole } from "./types";

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

export async function getLearningCatalog(examSlug = "ebserh-hubrasil"): Promise<LearningCatalog> {
  const { data: subjects, error: subjectsError } = await db.from("learning_subjects")
    .select("id,exam_slug,name,slug,sort_order,active")
    .eq("exam_slug", examSlug).eq("active", true).order("sort_order").order("name");
  if (subjectsError) throw subjectsError;
  const subjectRows = (subjects ?? []) as LearningSubject[];
  const subjectIds = subjectRows.map((subject) => subject.id);
  if (!subjectIds.length) return { subjects: subjectRows, topics: [] };
  const { data: topics, error: topicsError } = await db.from("learning_topics")
    .select("id,subject_id,name,slug,description,sort_order,active")
    .in("subject_id", subjectIds).eq("active", true).order("sort_order").order("name");
  if (topicsError) throw topicsError;
  return {
    subjects: subjectRows,
    topics: (topics ?? []) as LearningTopic[],
  };
}


function makeSlug(value: string): string {
  const base = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return `${base}-${hash.toString(16).slice(0, 6)}`;
}

export async function ensureLearningTopic(input: {
  examSlug?: string;
  subjectName: string;
  topicName: string;
}): Promise<{ subjectId: string; topicId: string }> {
  const examSlug = input.examSlug ?? "ebserh-hubrasil";
  const subjectName = input.subjectName.trim();
  const topicName = input.topicName.trim();
  if (!subjectName || !topicName) throw new Error("Informe a disciplina e o assunto.");

  const { data: subjectData, error: subjectError } = await db.from("learning_subjects")
    .upsert({ exam_slug: examSlug, name: subjectName, slug: makeSlug(subjectName), active: true }, { onConflict: "exam_slug,name" })
    .select("id").single();
  if (subjectError) throw subjectError;
  const subject = subjectData as { id: string };

  const { data: topicData, error: topicError } = await db.from("learning_topics")
    .upsert({ subject_id: subject.id, name: topicName, slug: makeSlug(topicName), active: true }, { onConflict: "subject_id,name" })
    .select("id").single();
  if (topicError) throw topicError;
  const topic = topicData as { id: string };
  return { subjectId: subject.id, topicId: topic.id };
}

export async function getLearningContents(input: {
  examSlug?: string;
  audience?: ProfessionalRole;
  subjectId?: string;
  topicId?: string;
} = {}): Promise<LearningContent[]> {
  let query = db.from("exam_content_items")
    .select("id,exam_slug,audience,subject,topic,subject_id,topic_id,title,summary,body,content_type,resource_url,storage_path,published")
    .eq("published", true)
    .eq("exam_slug", input.examSlug ?? "ebserh-hubrasil");
  if (input.audience && input.audience !== "todos") {
    query = query.in("audience", ["todos", input.audience]);
  }
  if (input.subjectId) query = query.eq("subject_id", input.subjectId);
  if (input.topicId) query = query.eq("topic_id", input.topicId);
  const { data, error } = await query.order("sort_order").order("created_at");
  if (error) throw error;
  return (data ?? []) as LearningContent[];
}
