import { supabase } from "@/integrations/supabase/client";
import type { LearningCatalog, LearningContent, LearningSubject, LearningTopic, ProfessionalRole } from "./types";

const db = supabase as any;

export async function getLearningCatalog(examSlug = "ebserh-hubrasil"): Promise<LearningCatalog> {
  const [subjectsResult, topicsResult] = await Promise.all([
    db.from("learning_subjects").select("id,exam_slug,name,slug,sort_order,active")
      .eq("exam_slug", examSlug).eq("active", true).order("sort_order").order("name"),
    db.from("learning_topics").select("id,subject_id,name,slug,description,sort_order,active")
      .eq("active", true).order("sort_order").order("name"),
  ]);
  if (subjectsResult.error) throw subjectsResult.error;
  if (topicsResult.error) throw topicsResult.error;
  return {
    subjects: (subjectsResult.data ?? []) as LearningSubject[],
    topics: (topicsResult.data ?? []) as LearningTopic[],
  };
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
