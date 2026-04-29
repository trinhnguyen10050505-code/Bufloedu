import {
  DiagnosticResultDoc,
  PracticeLevel,
  StudentLevel,
  StudentRecommendation,
} from "@/types";

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

export function getRecommendedPracticeLevels(
  level: StudentLevel
): PracticeLevel[] {
  if (level === "gioi") return ["thonghieu", "vandung"];
  if (level === "kha") return ["thonghieu", "vandung"];
  return ["nhanbiet", "thonghieu"];
}

export function buildStudentRecommendation(params: {
  level: StudentLevel;
  weakLessonIds: string[];
}): StudentRecommendation {
  const { level, weakLessonIds } = params;

  const recommendedLessonIds =
    weakLessonIds.length > 0 ? weakLessonIds.slice(0, 3) : ["lesson-2"];

  const recommendedPracticeLevels = getRecommendedPracticeLevels(level);

  let nextAction = "Tiếp tục học theo lộ trình Bu đang gợi ý.";

  if (level === "trungbinh") {
    nextAction =
      "Ôn lại lý thuyết các bài còn yếu rồi luyện trước ở mức nhận biết và thông hiểu.";
  } else if (level === "kha") {
    nextAction =
      "Luyện thêm câu thông hiểu và vận dụng cơ bản ở các bài còn yếu để nâng mức nhanh hơn.";
  } else {
    nextAction =
      "Tiếp tục làm quick-test và luyện câu vận dụng để duy trì mức học tốt hiện tại.";
  }

  return {
    recommendedLessonIds,
    recommendedPracticeLevels,
    nextAction,
  };
}

export function buildDiagnosticResult(params: {
  studentId: string;
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
  weakLessonIds: string[];
  totalQuestions: number;
}): DiagnosticResultDoc {
  const level = calculateStudentLevel(params);

  const recommendation = buildStudentRecommendation({
    level,
    weakLessonIds: params.weakLessonIds,
  });

  return {
    studentId: params.studentId,
    score: Math.round((params.correctRate / 100) * params.totalQuestions),
    totalQuestions: params.totalQuestions,
    correctRate: params.correctRate,
    hardCorrect: params.hardCorrect,
    completionTime: params.completionTime,
    level,
    weakLessonIds: params.weakLessonIds,
    recommendedLessonIds: recommendation.recommendedLessonIds,
    recommendedPracticeLevels: recommendation.recommendedPracticeLevels,
    nextAction: recommendation.nextAction,
  };
}