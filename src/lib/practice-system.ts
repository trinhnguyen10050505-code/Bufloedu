import {
  PracticeMode,
  PracticeQuestion,
  PracticeResult,
  QuestionLevel,
  StudentLevel,
} from "@/types/practice-final";

import { practiceBank } from "@/data/practice-bank.generated";
import { mapAccuracyToStudentLevel } from "@/lib/Bu-level";

const LEVEL_ORDER: Record<QuestionLevel, number> = {
  nhanbiet: 1,
  thonghieu: 2,
  vandung: 3,
};

export function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [copy[index], copy[randomIndex]] = [
      copy[randomIndex],
      copy[index],
    ];
  }

  return copy;
}

function uniqueQuestions(items: PracticeQuestion[]) {
  return Array.from(
    new Map(items.map((item) => [item.id, item])).values()
  );
}

function sortByPedagogy(
  a: PracticeQuestion,
  b: PracticeQuestion
) {
  return LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
}

export function getQuestionLevelsForStudent(
  level: StudentLevel
): QuestionLevel[] {
  if (level === "gioi") {
    return [
      "nhanbiet",
      "thonghieu",
      "vandung",
    ];
  }

  if (level === "kha") {
    return ["nhanbiet", "thonghieu", "vandung"];
  }

  return ["nhanbiet", "thonghieu"];
}

function getAdaptiveDistribution(level: StudentLevel) {
  /**
   * Bu Chăm chỉ:
   * ưu tiên nền tảng
   */
  if (level === "trungbinh") {
    return {
      nhanbiet: 7,
      thonghieu: 4,
      vandung: 1,
    };
  }

  /**
   * Bu Vững vàng:
   * cân bằng
   */
  if (level === "kha") {
    return {
      nhanbiet: 5,
      thonghieu: 5,
      vandung: 2,
    };
  }

  /**
   * Bu Thông thái:
   * nâng cao
   */
  return {
    nhanbiet: 3,
    thonghieu: 4,
    vandung: 5,
  };
}

function removeRecent(
  pool: PracticeQuestion[],
  recentQuestionIds: string[]
) {
  const filtered = pool.filter(
    (q) => !recentQuestionIds.includes(q.id)
  );

  return filtered.length >= 6 ? filtered : pool;
}

function buildStructuredSet({
  pool,
  studentLevel,
  limit,
}: {
  pool: PracticeQuestion[];
  studentLevel: StudentLevel;
  limit: number;
}) {
  const distribution = getAdaptiveDistribution(studentLevel);

  const nhanbiet = shuffle(
    pool.filter((q) => q.level === "nhanbiet")
  ).slice(0, distribution.nhanbiet);

  const thonghieu = shuffle(
    pool.filter((q) => q.level === "thonghieu")
  ).slice(0, distribution.thonghieu);

  const vandung = shuffle(
    pool.filter((q) => q.level === "vandung")
  ).slice(0, distribution.vandung);

  const merged = uniqueQuestions([
    ...nhanbiet,
    ...thonghieu,
    ...vandung,
  ]);

  /**
   * fallback nếu thiếu câu
   */
  const filled =
    merged.length >= limit
      ? merged
      : uniqueQuestions([
          ...merged,
          ...shuffle(pool),
        ]).slice(0, limit);

  /**
   * CỰC KỲ QUAN TRỌNG:
   * KHÔNG random thứ tự cuối
   * mà sắp từ NB -> TH -> VD
   */
  return filled.sort(sortByPedagogy);
}

export function getQuestionsByLesson(
  lessonId: string
) {
  return practiceBank.filter(
    (question) => question.lessonId === lessonId
  );
}

export function getLessonStats(
  lessonId: string
) {
  const questions = getQuestionsByLesson(lessonId);

  return {
    total: questions.length,

    nhanbiet: questions.filter(
      (q) => q.level === "nhanbiet"
    ).length,

    thonghieu: questions.filter(
      (q) => q.level === "thonghieu"
    ).length,

    vandung: questions.filter(
      (q) => q.level === "vandung"
    ).length,
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
   * 1. BU ĐỀ XUẤT
   */
  if (mode === "recommended") {
    const targetLessonIds =
      weakLessonIds.length > 0
        ? weakLessonIds
        : recommendedLessonIds.length > 0
        ? recommendedLessonIds
        : [];

    const allowedLevels =
      getQuestionLevelsForStudent(studentLevel);

    if (targetLessonIds.length > 0) {
      pool = practiceBank.filter(
        (q) =>
          targetLessonIds.includes(q.lessonId) &&
          allowedLevels.includes(q.level)
      );
    } else {
      pool = practiceBank.filter((q) =>
        allowedLevels.includes(q.level)
      );
    }

    pool = removeRecent(pool, recentQuestionIds);

    return buildStructuredSet({
      pool,
      studentLevel,
      limit,
    });
  }

  /**
   * 2. LUYỆN THEO BÀI
   */
  if (mode === "by_lesson") {
    pool = lessonId
      ? practiceBank.filter(
          (q) => q.lessonId === lessonId
        )
      : [...practiceBank];

    pool = removeRecent(pool, recentQuestionIds);

    return buildStructuredSet({
      pool,
      studentLevel,
      limit,
    });
  }

  /**
   * 3. LUYỆN THEO MỨC
   */
  if (mode === "by_level") {
    const allowedLevels =
      getQuestionLevelsForStudent(studentLevel);

    pool = practiceBank.filter((q) =>
      allowedLevels.includes(q.level)
    );

    pool = removeRecent(pool, recentQuestionIds);

    return buildStructuredSet({
      pool,
      studentLevel,
      limit,
    });
  }

  /**
   * 4. ÔN PHẦN YẾU
   */
  if (mode === "weak_part") {
    if (weakLessonIds.length > 0) {
      pool = practiceBank.filter((q) =>
        weakLessonIds.includes(q.lessonId)
      );
    } else {
      const allowedLevels =
        getQuestionLevelsForStudent(studentLevel);

      pool = practiceBank.filter((q) =>
        allowedLevels.includes(q.level)
      );
    }

    pool = removeRecent(pool, recentQuestionIds);

    return buildStructuredSet({
      pool,
      studentLevel,
      limit,
    });
  }

  return buildStructuredSet({
    pool: practiceBank,
    studentLevel,
    limit,
  });
}

/**
 * QUICK TEST:
 * phải theo thứ tự sư phạm
 */
export function buildQuickTestSet(
  lessonId: string
): PracticeQuestion[] {
  const pool = practiceBank.filter(
    (question) => question.lessonId === lessonId
  );

  const nhanbiet = shuffle(
    pool.filter((q) => q.level === "nhanbiet")
  ).slice(0, 3);

  const thonghieu = shuffle(
    pool.filter((q) => q.level === "thonghieu")
  ).slice(0, 4);

  const vandung = shuffle(
    pool.filter((q) => q.level === "vandung")
  ).slice(0, 3);

  return uniqueQuestions([
    ...nhanbiet,
    ...thonghieu,
    ...vandung,
  ]).sort(sortByPedagogy);
}

/**
 * DIAGNOSTIC:
 * kiểm tra nền từ dễ -> khó
 */
export function buildDiagnosticSet(
  startLessonOrder: number
): PracticeQuestion[] {
  const beforeLessons = practiceBank.filter(
    (question) =>
      question.lessonOrder < startLessonOrder
  );

  const source =
    beforeLessons.length >= 10
      ? beforeLessons
      : practiceBank.filter(
          (question) =>
            question.lessonOrder <= startLessonOrder
        );

  const nhanbiet = shuffle(
    source.filter((q) => q.level === "nhanbiet")
  ).slice(0, 4);

  const thonghieu = shuffle(
    source.filter((q) => q.level === "thonghieu")
  ).slice(0, 4);

  const vandung = shuffle(
    source.filter((q) => q.level === "vandung")
  ).slice(0, 4);

  return uniqueQuestions([
    ...nhanbiet,
    ...thonghieu,
    ...vandung,
  ]).sort(sortByPedagogy);
}

export function calculateResult(
  questions: PracticeQuestion[],
  answers: Record<string, string>
): PracticeResult {
  let score = 0;

  const answerDetails = questions.map((question) => {
    const selectedOptionId =
      answers[question.id] || "";

    const isCorrect =
      selectedOptionId === question.correctOptionId;

    if (isCorrect) score += 1;

    return {
      questionId: question.id,
      lessonId: question.lessonId,
      level: question.level,
      selectedOptionId,
      correctOptionId:
        question.correctOptionId,
      isCorrect,
    };
  });

  const totalQuestions = questions.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round(
          (score / totalQuestions) * 100
        )
      : 0;

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
    level:
      mapAccuracyToStudentLevel(
        accuracy
      ),
    questionIds: questions.map(
      (question) => question.id
    ),
    answerDetails,
    weakLessonIds,
  };
}