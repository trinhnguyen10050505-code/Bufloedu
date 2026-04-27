export type StudentLevel = "trungbinh" | "kha" | "gioi";

export interface DiagnosticResult {
  score: number;
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
  level: StudentLevel;
  weakLessons: string[];
}

export interface StudentProgressRecord {
  studentId: string;
  lessonId: string;
  activityType: "practice" | "quick_test" | "focus_room" | "diagnostic_test";
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  createdAt?: string;
}

export type QueueItem = {
  id: string;
  type: "lesson" | "video" | "practice" | "quiz";
  lessonId: string;
  title: string;
  description: string;
  recommendedLevel: StudentLevel;
};