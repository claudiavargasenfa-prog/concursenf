export type ProfessionalRole = "todos" | "enfermeiro" | "tecnico" | "auxiliar";
export type LearningActivityType = "content" | "question" | "flashcard" | "simulation" | "review";
export type LearningStatus = "not_started" | "in_progress" | "needs_review" | "mastered";

export type LearningSubject = {
  id: string;
  exam_slug: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
};

export type LearningTopic = {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  active: boolean;
};

export type LearningContent = {
  id: string;
  exam_slug: string;
  audience: ProfessionalRole;
  subject: string;
  topic: string;
  subject_id: string | null;
  topic_id: string | null;
  title: string;
  summary: string | null;
  body: string | null;
  content_type: "texto" | "mapa_mental" | "pdf" | "audio" | "video" | "link";
  resource_url: string | null;
  storage_path: string | null;
  published: boolean;
};

export type LearningProgress = {
  id: string;
  user_id: string;
  subject_id: string;
  topic_id: string;
  status: LearningStatus;
  confidence: number | null;
  questions_answered: number;
  correct_answers: number;
  last_studied_at: string | null;
  updated_at: string;
};

export type LearningCatalog = {
  subjects: LearningSubject[];
  topics: LearningTopic[];
};
