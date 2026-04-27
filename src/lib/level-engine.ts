import { DiagnosticResult, StudentLevel } from "../types";

type CalculateStudentLevelParams = {
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
};

type BuildDiagnosticResultParams = CalculateStudentLevelParams & {
  weakLessons: string[];
};

function normalizeCorrectRate(correctRate: number): number {
  if (Number.isNaN(correctRate) || !Number.isFinite(correctRate)) return 0;
  return Math.max(0, Math.min(100, correctRate));
}

function normalizeNonNegativeNumber(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

/**
 * Tính mức độ học sinh dựa trên:
 * - tỉ lệ đúng
 * - số câu khó đúng
 * - thời gian hoàn thành
 *
 * Chỉ trả về level hệ thống:
 * trungbinh | kha | gioi
 */
export function calculateStudentLevel(
  params: CalculateStudentLevelParams
): StudentLevel {
  const correctRate = normalizeCorrectRate(params.correctRate);
  const hardCorrect = normalizeNonNegativeNumber(params.hardCorrect);
  const completionTime = normalizeNonNegativeNumber(params.completionTime);

  if (correctRate >= 80 && hardCorrect >= 2 && completionTime <= 900) {
    return "gioi";
  }

  if (correctRate >= 50 && hardCorrect >= 1 && completionTime <= 1200) {
    return "kha";
  }

  return "trungbinh";
}

/**
 * Tạo kết quả bài test chẩn đoán hoàn chỉnh.
 */
export function buildDiagnosticResult(
  params: BuildDiagnosticResultParams
): DiagnosticResult {
  const correctRate = normalizeCorrectRate(params.correctRate);
  const hardCorrect = normalizeNonNegativeNumber(params.hardCorrect);
  const completionTime = normalizeNonNegativeNumber(params.completionTime);

  const level = calculateStudentLevel({
    correctRate,
    hardCorrect,
    completionTime,
  });

  return {
    score: Math.round(correctRate),
    correctRate,
    hardCorrect,
    completionTime,
    level,
    weakLessons: Array.from(new Set(params.weakLessons)),
  };
}