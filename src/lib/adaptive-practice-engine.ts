import { questionBank } from "@/data/practice-bank.generated";
import { lessonsContent } from "@/data/lessons-content";
import { StudentLevel } from "@/types";

export type PracticeMode =
  | "recommended"
  | "weak_lessons"
  | "by_lesson"
  | "quick_review";

export type PracticeQuestionLevel = "nhanbiet" | "thonghieu" | "vandung";

export type NormalizedPracticeQuestion = {
  id: string;
  lessonId: string;
  level: PracticeQuestionLevel;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctOptionId: string;
  correctText: string;
  explanation?: string;
};

export type PracticeSessionConfig = {
  studentLevel: StudentLevel;
  mode: PracticeMode;
  selectedLessonId?: string;
  weakLessonIds?: string[];
  recommendedLessonIds?: string[];
  recentlyAnsweredQuestionIds?: string[];
  limit?: number;
};

export type PracticeSessionResult = {
  title: string;
  subtitle: string;
  lessonIds: string[];
  targetLevels: PracticeQuestionLevel[];
  questions: NormalizedPracticeQuestion[];
  emptyReason?: string;
};

function normalizeOption(option: any, index: number) {
  if (typeof option === "string") {
    return {
      id: String.fromCharCode(65 + index),
      text: option,
    };
  }

  return {
    id: option.id || String.fromCharCode(65 + index),
    text: option.text || option.label || option.value || String(option),
  };
}

export function normalizeQuestion(raw: any): NormalizedPracticeQuestion {
  const options = (raw.options || []).map(normalizeOption);

  const correctText =
    raw.correctAnswer ||
    raw.correctText ||
    options.find((option: any) => option.id === raw.correctAnswerId)?.text ||
    "";

  const correctOption =
    options.find((option: any) => option.id === raw.correctAnswerId) ||
    options.find((option: any) => option.text === correctText) ||
    options[0];

  return {
    id: raw.id,
    lessonId: raw.lessonId,
    level: raw.level,
    question: raw.question,
    options,
    correctOptionId: correctOption?.id || "A",
    correctText: correctOption?.text || correctText,
    explanation: raw.explanation || "",
  };
}

function shuffle<T>(items: T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

export function getPracticeLevelsByStudentLevel(
  level: StudentLevel
): PracticeQuestionLevel[] {
  if (level === "gioi") return ["thonghieu", "vandung"];
  if (level === "kha") return ["thonghieu", "vandung"];
  return ["nhanbiet", "thonghieu"];
}

export function getLessonTitleById(lessonId: string) {
  const lesson = lessonsContent[lessonId as keyof typeof lessonsContent];
  return lesson?.title || lessonId;
}

function uniqueLessonIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

export function buildPracticeSession(
  config: PracticeSessionConfig
): PracticeSessionResult {
  const {
    studentLevel,
    mode,
    selectedLessonId,
    weakLessonIds = [],
    recommendedLessonIds = [],
    recentlyAnsweredQuestionIds = [],
    limit = 10,
  } = config;

  const targetLevels = getPracticeLevelsByStudentLevel(studentLevel);

  let lessonIds: string[] = [];
  let title = "Luyện tập thông minh cùng Bu";
  let subtitle =
    "Bu sẽ trộn câu hỏi theo mức hiện tại và ưu tiên phần em cần củng cố.";

  if (mode === "recommended") {
    lessonIds = uniqueLessonIds(
      recommendedLessonIds.length > 0
        ? recommendedLessonIds
        : weakLessonIds.length > 0
        ? weakLessonIds
        : ["lesson-2"]
    );
    title = "Bộ luyện tập Bu gợi ý";
    subtitle =
      "Bu chọn bài dựa trên kết quả test, tiến độ gần đây và mức học hiện tại.";
  }

  if (mode === "weak_lessons") {
    lessonIds = uniqueLessonIds(weakLessonIds.length > 0 ? weakLessonIds : ["lesson-2"]);
    title = "Ôn lại phần còn yếu";
    subtitle =
      "Bu ưu tiên những bài có kết quả thấp hoặc được phát hiện yếu sau test.";
  }

  if (mode === "by_lesson") {
    lessonIds = [selectedLessonId || "lesson-2"];
    title = `Luyện theo bài: ${getLessonTitleById(lessonIds[0])}`;
    subtitle = "Bu trộn câu hỏi trong bài này để em không bị học vẹt theo thứ tự.";
  }

  if (mode === "quick_review") {
    lessonIds = uniqueLessonIds(
      weakLessonIds.length > 0
        ? weakLessonIds.slice(0, 2)
        : recommendedLessonIds.length > 0
        ? recommendedLessonIds.slice(0, 2)
        : ["lesson-2"]
    );
    title = "Ôn nhanh 5 câu";
    subtitle = "Một vòng kiểm tra ngắn để Bu xem em còn nhớ bài không.";
  }

  const normalizedPool = questionBank
    .map(normalizeQuestion)
    .filter((question) => lessonIds.includes(question.lessonId))
    .filter((question) =>
      mode === "quick_review" ? true : targetLevels.includes(question.level)
    );

  const notRecentlyAnswered = normalizedPool.filter(
    (question) => !recentlyAnsweredQuestionIds.includes(question.id)
  );

  const mainPool =
    notRecentlyAnswered.length >= Math.min(limit, 5)
      ? notRecentlyAnswered
      : normalizedPool;

  const questions = shuffle(mainPool).slice(
    0,
    mode === "quick_review" ? Math.min(5, limit) : limit
  );

  return {
    title,
    subtitle,
    lessonIds,
    targetLevels,
    questions,
    emptyReason:
      questions.length === 0
        ? "Bu chưa tìm thấy câu hỏi phù hợp cho cấu hình luyện tập này."
        : undefined,
  };
}

export function calculatePracticeResult(
  questions: NormalizedPracticeQuestion[],
  answers: Record<string, string>
) {
  let correct = 0;

  const answerDetails = questions.map((question) => {
    const selectedOptionId = answers[question.id] || "";
    const isCorrect = selectedOptionId === question.correctOptionId;

    if (isCorrect) correct += 1;

    return {
      questionId: question.id,
      lessonId: question.lessonId,
      level: question.level,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect,
    };
  });

  const total = questions.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    score: correct,
    totalQuestions: total,
    accuracy,
    answerDetails,
    questionIds: questions.map((question) => question.id),
  };
}

export function mapAccuracyToStudentLevel(accuracy: number): StudentLevel {
  if (accuracy >= 80) return "gioi";
  if (accuracy >= 50) return "kha";
  return "trungbinh";
}