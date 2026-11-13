export type QuestionDifficulty = "Básica" | "Intermediária" | "Avançada";

export type PracticeQuestion = {
  id: string;
  audience?: "todos" | "enfermeiro" | "tecnico" | "auxiliar";
  discipline: string;
  topic: string;
  difficulty: QuestionDifficulty;
  statement: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
  reference: string;
};

// Questões de demonstração removidas do bundle do cliente.
// O banco de questões publicado é carregado por RPC sem gabarito.
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [];

export const QUESTION_DISCIPLINES = ["Todas as disciplinas"];
