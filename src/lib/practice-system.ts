import {
  PracticeMode,
  PracticeQuestion,
  PracticeResult,
  QuestionLevel,
  StudentLevel,
} from "@/types/practice-final";
import { practiceBank } from "@/data/practice-bank.generated";
import { mapAccuracyToStudentLevel } from "@/lib/Bu-level";

export function getQuestionLevelsForStudent(level: StudentLevel): QuestionLevel[] {
  if (level === "gioi") return ["thonghieu", "vandung"];
  if (level === "kha") return ["nhanbiet", "thonghieu", "vandung"];
  return ["nhanbiet", "thonghieu"];
}

export function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
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
  recentQuestionIds?: string[];
  limit?: number;
}) {
  const {
    mode,
    studentLevel,
    lessonId,
    weakLessonIds = [],
    recentQuestionIds = [],
    limit = 10,
  } = params;

  let pool = [...practiceBank];
  const allowedLevels = getQuestionLevelsForStudent(studentLevel);

  if (mode === "by_lesson" && lessonId) {
    pool = pool.filter((question) => question.lessonId === lessonId);
  }

  if (mode === "by_level") {
    pool = pool.filter((question) => allowedLevels.includes(question.level));

    if (lessonId) {
      pool = pool.filter((question) => question.lessonId === lessonId);
    }
  }

  if (mode === "weak_part") {
    const targetLessons =
      weakLessonIds.length > 0 ? weakLessonIds : lessonId ? [lessonId] : [];

    if (targetLessons.length > 0) {
      pool = pool.filter((question) => targetLessons.includes(question.lessonId));
    }
  }

  if (mode === "recommended") {
    const targetLessons =
      weakLessonIds.length > 0 ? weakLessonIds : lessonId ? [lessonId] : [];

    if (targetLessons.length > 0) {
      pool = pool.filter((question) => targetLessons.includes(question.lessonId));
    }

    pool = pool.filter((question) => allowedLevels.includes(question.level));
  }

  const nonRepeated = pool.filter(
    (question) => !recentQuestionIds.includes(question.id)
  );

  const finalPool = nonRepeated.length >= Math.min(limit, 5) ? nonRepeated : pool;

  return shuffle(finalPool).slice(0, limit);
}

export function buildQuickTestSet(lessonId: string): PracticeQuestion[] {
  const pool = practiceBank.filter((question) => question.lessonId === lessonId);

  const nhanbiet = shuffle(pool.filter((q) => q.level === "nhanbiet")).slice(0, 3);
  const thonghieu = shuffle(pool.filter((q) => q.level === "thonghieu")).slice(0, 4);
  const vandung = shuffle(pool.filter((q) => q.level === "vandung")).slice(0, 3);

  const mixed = shuffle([...nhanbiet, ...thonghieu, ...vandung]);

  if (mixed.length >= 5) return mixed.slice(0, 10);

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

  const nhanbiet = shuffle(source.filter((q) => q.level === "nhanbiet")).slice(0, 4);
  const thonghieu = shuffle(source.filter((q) => q.level === "thonghieu")).slice(0, 4);
  const vandung = shuffle(source.filter((q) => q.level === "vandung")).slice(0, 4);

  return shuffle([...nhanbiet, ...thonghieu, ...vandung]).slice(0, 12);
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