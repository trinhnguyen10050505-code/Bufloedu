import { StudentLevel } from "./user";

export interface DiagnosticResult {
  id?: string;
  studentId: string;
  score: number;
  accuracy: number;
  hardQuestionCorrectCount: number;
  completionTimeInSeconds: number;
  detectedWeaknesses: string[];
  assignedLevel: StudentLevel;
  recommendedPath: string[];
  createdAt?: string;
}