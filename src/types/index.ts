export type StudentLevel = "trungbinh" | "kha" | "gioi";
export type QuestionLevel = "nhanbiet" | "thonghieu" | "vandung";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  theory: string[];
  objectives: string[];
}

export interface Question {
  id: string;
  lessonId: string;
  level: QuestionLevel;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface DiagnosticResult {
  score: number;
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
  level: StudentLevel;
  weakLessons: string[];
}

export interface QueueItem {
  id: string;
  type: "lesson" | "video" | "practice" | "quiz";
  lessonId: string;
  title: string;
  description: string;
  recommendedLevel?: StudentLevel;
}