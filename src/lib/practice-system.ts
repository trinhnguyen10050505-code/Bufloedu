import {
  PracticeMode,
  PracticeQuestion,
  PracticeResult,
  QuestionLevel,
  StudentLevel,
} from "@/types/practice-final";
import { practiceBank } from "@/data/practice-bank.generated";
import { mapAccuracyToStudentLevel } from "@/lib/Bu-level";

export function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function uniqueQuestions(items: PracticeQuestion[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export function getQuestionLevelsForStudent(level: StudentLevel): QuestionLevel[] {
  if (level === "gioi") return ["thonghieu", "vandung"];
  if (level === "kha") return ["nhanbiet", "thonghieu", "vandung"];
  return ["nhanbiet", "thonghieu"];
}

function getAdaptiveLevelMix(level: StudentLevel) {
  if (level === "gioi") {
    return {
      nhanbiet: 1,
      thonghieu: 4,
      vandung: 7,
    };
  }

  if (level === "kha") {
    return {
      nhanbiet: 3,
      thonghieu: 5,
      vandung: 4,
    };
  }

  return {
    nhanbiet: 5,
    thonghieu: 5,
    vandung: 2,
  };
}

function removeRecent(pool: PracticeQuestion[], recentQuestionIds: string[]) {
  const filtered = pool.filter((q) => !recentQuestionIds.includes(q.id));
  return filtered.length >= 6 ? filtered : pool;
}

function pickBalanced(pool: PracticeQuestion[], level: StudentLevel, limit: number) {
  const mix = getAdaptiveLevelMix(level);

  const easy = shuffle(pool.filter((q) => q.level === "nhanbiet"));
  const medium = shuffle(pool.filter((q) => q.level === "thonghieu"));
  const hard = shuffle(pool.filter((q) => q.level === "vandung"));

  const selected = uniqueQuestions([
    ...easy.slice(0, mix.nhanbiet),
    ...medium.slice(0, mix.thonghieu),
    ...hard.slice(0, mix.vandung),
  ]);

  if (selected.length >= Math.min(limit, 6)) {
    return shuffle(selected).slice(0, limit);
  }

  return shuffle(uniqueQuestions([...selected, ...pool])).slice(0, limit);
}

export function getQuestionsByLesson(lessonId: string) {
  return practiceBank.filter((question) => question.lessonId === lessonId);
}

export function getLessonStats(lessonId: string) {
  const questions = getQuestionsByLesson(lessonId);

  return {
    total: questions.length,
    nhanbiet: questions.filter((q) => q.level === "nhanbiet").length,
    thonghieu: questions.filter((q) => q.level === "thonghieu").length,
    vandung: questions.filter((q) => q.level === "vandung").length,
  };
}

export function buildPracticeSet(params: {
  mode: PracticeMode;
  studentLevel: StudentLevel;
  lessonId?: string;
  weakLessonIds?: string[];
  recommendedLessonIds?: string[];
  recentQuestionIds?: string[];
  limit?: number;
}) {
  const {
    mode,
    studentLevel,
    lessonId,
    weakLessonIds = [],
    recommendedLessonIds = [],
    recentQuestionIds = [],
    limit = 12,
  } = params;

  let pool: PracticeQuestion[] = [];

  /**
   * 1. Bu đề xuất:
   * KHÔNG phụ thuộc bài đang chọn.
   * Ưu tiên:
   * - bài yếu
   * - bài được đề xuất
   * - mức hiện tại của học sinh
   */
  if (mode === "recommended") {
    const targetLessonIds =
      weakLessonIds.length > 0
        ? weakLessonIds
        : recommendedLessonIds.length > 0
        ? recommendedLessonIds
        : [];

    const allowedLevels = getQuestionLevelsForStudent(studentLevel);

    if (targetLessonIds.length > 0) {
      pool = practiceBank.filter(
        (q) =>
          targetLessonIds.includes(q.lessonId) &&
          allowedLevels.includes(q.level)
      );
    } else {
      pool = practiceBank.filter((q) => allowedLevels.includes(q.level));
    }

    pool = removeRecent(pool, recentQuestionIds);
    return pickBalanced(pool, studentLevel, limit);
  }

  /**
   * 2. Luyện theo bài:
   * CHỈ lấy đúng bài đang chọn.
   * Đây là chế độ duy nhất phụ thuộc select bài học.
   */
  if (mode === "by_lesson") {
    pool = lessonId
      ? practiceBank.filter((q) => q.lessonId === lessonId)
      : [...practiceBank];

    pool = removeRecent(pool, recentQuestionIds);
    return shuffle(uniqueQuestions(pool)).slice(0, limit);
  }

  /**
   * 3. Luyện theo mức:
   * KHÔNG phụ thuộc bài đang chọn.
   * Lấy toàn ngân hàng câu hỏi theo mức học hiện tại.
   */
  if (mode === "by_level") {
    const allowedLevels = getQuestionLevelsForStudent(studentLevel);

    pool = practiceBank.filter((q) => allowedLevels.includes(q.level));
    pool = removeRecent(pool, recentQuestionIds);

    return pickBalanced(pool, studentLevel, limit);
  }

  /**
   * 4. Ôn phần yếu:
   * KHÔNG phụ thuộc bài đang chọn.
   * Chỉ lấy bài học sinh từng sai.
   */
  if (mode === "weak_part") {
    if (weakLessonIds.length > 0) {
      pool = practiceBank.filter((q) => weakLessonIds.includes(q.lessonId));
    } else {
      const allowedLevels = getQuestionLevelsForStudent(studentLevel);
      pool = practiceBank.filter((q) => allowedLevels.includes(q.level));
    }

    pool = removeRecent(pool, recentQuestionIds);
    return pickBalanced(pool, studentLevel, limit);
  }

  return shuffle(practiceBank).slice(0, limit);
}

export function buildQuickTestSet(lessonId: string): PracticeQuestion[] {
  const pool = practiceBank.filter((question) => question.lessonId === lessonId);

  const easy = shuffle(pool.filter((q) => q.level === "nhanbiet")).slice(0, 3);
  const medium = shuffle(pool.filter((q) => q.level === "thonghieu")).slice(0, 4);
  const hard = shuffle(pool.filter((q) => q.level === "vandung")).slice(0, 3);

  const mixed = uniqueQuestions([...easy, ...medium, ...hard]);

  if (mixed.length >= 5) return shuffle(mixed).slice(0, 10);

  return shuffle(pool).slice(0, 10);
}

export function buildDiagnosticSet(startLessonOrder: number): PracticeQuestion[] {
  const beforeLessons = practiceBank.filter(
    (question) => question.lessonOrder < startLessonOrder
  );

  const source =
    beforeLessons.length >= 10
      ? beforeLessons
      : practiceBank.filter((question) => question.lessonOrder <= startLessonOrder);

  const easy = shuffle(source.filter((q) => q.level === "nhanbiet")).slice(0, 4);
  const medium = shuffle(source.filter((q) => q.level === "thonghieu")).slice(0, 4);
  const hard = shuffle(source.filter((q) => q.level === "vandung")).slice(0, 4);

  return shuffle(uniqueQuestions([...easy, ...medium, ...hard])).slice(0, 12);
}

export function calculateResult(
  questions: PracticeQuestion[],
  answers: Record<string, string>
): PracticeResult {
  let score = 0;

  const answerDetails = questions.map((question) => {
    const selectedOptionId = answers[question.id] || "";
    const isCorrect = selectedOptionId === question.correctOptionId;

    if (isCorrect) score += 1;

    return {
      questionId: question.id,
      lessonId: question.lessonId,
      level: question.level,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect,
    };
  });

  const totalQuestions = questions.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const weakLessonIds = Array.from(
    new Set(
      answerDetails
        .filter((item) => !item.isCorrect)
        .map((item) => item.lessonId)
    )
  );

  return {
    score,
    totalQuestions,
    accuracy,
    level: mapAccuracyToStudentLevel(accuracy),
    questionIds: questions.map((question) => question.id),
    answerDetails,
    weakLessonIds,
  };
}