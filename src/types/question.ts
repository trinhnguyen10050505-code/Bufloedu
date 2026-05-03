export type QuestionLevel = "nhanbiet" | "thonghieu" | "vandung";
export type StudentTargetLevel = "trungbinh" | "kha" | "gioi";
export type QuestionType = "practice" | "diagnostic" | "quick_test";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  lessonId: string;

  level: QuestionLevel;
  targetLevel: StudentTargetLevel;
  type: QuestionType;
  difficulty: "easy" | "medium" | "hard";

  question: string;
  options: QuestionOption[];
  correctAnswerId: string;
  explanation: string;

  tags: string[];
}