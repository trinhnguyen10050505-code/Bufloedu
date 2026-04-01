import { DiagnosticResult, StudentLevel } from "../types";

export function calculateStudentLevel(params: {
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
}): StudentLevel {
  const { correctRate, hardCorrect, completionTime } = params;

  if (correctRate >= 80 && hardCorrect >= 2 && completionTime <= 900) {
    return "gioi";
  }

  if (correctRate >= 50 && hardCorrect >= 1 && completionTime <= 1200) {
    return "kha";
  }

  return "trungbinh";
}

export function buildDiagnosticResult(params: {
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
  weakLessons: string[];
}): DiagnosticResult {
  const level = calculateStudentLevel(params);

  return {
    score: Math.round(params.correctRate),
    correctRate: params.correctRate,
    hardCorrect: params.hardCorrect,
    completionTime: params.completionTime,
    level,
    weakLessons: params.weakLessons
  };
}