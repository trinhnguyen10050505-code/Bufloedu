import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types/practice-final";

export type StudentHistoryItem = {
  id: string;
  studentId: string;
  lessonId: string;
  activityType: string;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  questionIds?: string[];
  answerDetails?: any[];
  createdAt?: any;
};

export type LessonHistorySummary = {
  lessonId: string;
  lessonTitle: string;
  viewed: boolean;
  practicedTimes: number;
  quickTestDone: boolean;
  bestPracticeAccuracy: number;
  latestQuickTestAccuracy?: number;
  totalStudySeconds: number;
  lastActivityAt: number;
};

export type StudentLearningHistorySummary = {
  totalStudyMinutes: number;
  totalPracticeTimes: number;
  totalQuickTests: number;
  completedLessonsCount: number;
  currentLevel: StudentLevel;
  recentActivities: StudentHistoryItem[];
  lessonHistories: LessonHistorySummary[];
  weakLessonIds: string[];
  strongLessonIds: string[];
  recentQuestionIds: string[];
  averageAccuracy: number;
};

const lessonTitleMap: Record<string, string> = {
  "lesson-2": "Phản ứng hóa học",
  "lesson-3": "Mol và tỉ khối của chất khí",
  "lesson-4": "Nồng độ dung dịch",
  "lesson-5": "Định luật bảo toàn khối lượng",
  "lesson-6": "Tính theo phương trình hóa học",
  "lesson-7": "Tốc độ phản ứng và chất xúc tác",
  "lesson-8": "Acid",
  "lesson-9": "Base – thang đo pH",
  "lesson-10": "Oxide",
  "lesson-11": "Muối",
  "lesson-12": "Phân bón hóa học",
};

const lessonOrder = Object.keys(lessonTitleMap);

function getTimestamp(item: StudentHistoryItem) {
  if (typeof item.createdAt?.seconds === "number") {
    return item.createdAt.seconds * 1000;
  }

  return 0;
}

function calculateCurrentLevel(items: StudentHistoryItem[]): StudentLevel {
  const scored = items
    .filter(
      (item) =>
        typeof item.accuracy === "number" &&
        ["diagnostic_test", "quick_test", "practice", "mindmap_puzzle"].includes(
          item.activityType
        )
    )
    .slice(0, 6);

  if (scored.length === 0) return "trungbinh";

  const average =
    scored.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
    scored.length;

  if (average >= 80) return "gioi";
  if (average >= 50) return "kha";
  return "trungbinh";
}

function buildLessonHistories(items: StudentHistoryItem[]): LessonHistorySummary[] {
  return lessonOrder.map((lessonId) => {
    const lessonItems = items.filter((item) => item.lessonId === lessonId);

    const practiced = lessonItems.filter((item) => item.activityType === "practice");
    const quickTests = lessonItems.filter((item) => item.activityType === "quick_test");

    const studySeconds = lessonItems.reduce((sum, item) => {
      if (
        ["focus_room", "lesson_view", "elearning_view", "web_active_time"].includes(
          item.activityType
        )
      ) {
        return sum + (item.durationInSeconds || 0);
      }

      return sum;
    }, 0);

    const bestPracticeAccuracy =
      practiced.length > 0
        ? Math.max(...practiced.map((item) => item.accuracy || 0))
        : 0;

    const latestQuickTest = quickTests.sort(
      (a, b) => getTimestamp(b) - getTimestamp(a)
    )[0];

    const lastActivityAt =
      lessonItems.length > 0
        ? Math.max(...lessonItems.map((item) => getTimestamp(item)))
        : 0;

    return {
      lessonId,
      lessonTitle: lessonTitleMap[lessonId],
      viewed: lessonItems.some((item) =>
        ["lesson_view", "elearning_view", "web_active_time"].includes(
          item.activityType
        )
      ),
      practicedTimes: practiced.length,
      quickTestDone: quickTests.length > 0,
      bestPracticeAccuracy,
      latestQuickTestAccuracy: latestQuickTest?.accuracy,
      totalStudySeconds: studySeconds,
      lastActivityAt,
    };
  });
}

function getWeakLessonIds(items: StudentHistoryItem[]) {
  const weakMap = new Map<string, number>();

  items.forEach((item) => {
    if (
      item.lessonId?.startsWith("lesson-") &&
      typeof item.accuracy === "number" &&
      item.accuracy < 60 &&
      ["practice", "quick_test", "diagnostic_test"].includes(item.activityType)
    ) {
      weakMap.set(item.lessonId, (weakMap.get(item.lessonId) || 0) + 1);
    }

    item.answerDetails?.forEach((answer: any) => {
      if (!answer.isCorrect && answer.lessonId) {
        weakMap.set(answer.lessonId, (weakMap.get(answer.lessonId) || 0) + 1);
      }
    });
  });

  return Array.from(weakMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([lessonId]) => lessonId)
    .slice(0, 4);
}

function getStrongLessonIds(lessonHistories: LessonHistorySummary[]) {
  return lessonHistories
    .filter(
      (lesson) =>
        lesson.quickTestDone &&
        typeof lesson.latestQuickTestAccuracy === "number" &&
        lesson.latestQuickTestAccuracy >= 80
    )
    .map((lesson) => lesson.lessonId)
    .slice(0, 4);
}

function collectRecentQuestionIds(items: StudentHistoryItem[]) {
  return Array.from(
    new Set(items.slice(0, 10).flatMap((item) => item.questionIds || []))
  ).slice(0, 80);
}

export async function getStudentLearningHistorySummary(
  studentId: string
): Promise<StudentLearningHistorySummary> {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);

  const items: StudentHistoryItem[] = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<StudentHistoryItem, "id">),
    }))
    .sort((a, b) => getTimestamp(b) - getTimestamp(a));

  const totalStudySeconds = items.reduce((sum, item) => {
    if (
      ["focus_room", "lesson_view", "elearning_view", "web_active_time"].includes(
        item.activityType
      )
    ) {
      return sum + (item.durationInSeconds || 0);
    }

    return sum;
  }, 0);

  const lessonHistories = buildLessonHistories(items);
  const currentLevel = calculateCurrentLevel(items);
  const weakLessonIds = getWeakLessonIds(items);

  const scoredItems = items.filter((item) => typeof item.accuracy === "number");
  const averageAccuracy = scoredItems.length > 0
    ? Math.round(scoredItems.reduce((sum, item) => sum + (item.accuracy || 0), 0) / scoredItems.length)
    : 0;

  return {
    totalStudyMinutes: Math.round(totalStudySeconds / 60),
    totalPracticeTimes: items.filter((item) => item.activityType === "practice")
      .length,
    totalQuickTests: items.filter((item) => item.activityType === "quick_test")
      .length,
    completedLessonsCount: lessonHistories.filter(
      (lesson) =>
        lesson.quickTestDone &&
        typeof lesson.latestQuickTestAccuracy === "number" &&
        lesson.latestQuickTestAccuracy >= 60
    ).length,
    currentLevel,
    recentActivities: items.slice(0, 8),
    lessonHistories,
    weakLessonIds,
    strongLessonIds: getStrongLessonIds(lessonHistories),
    recentQuestionIds: collectRecentQuestionIds(items),
    averageAccuracy,
  };
}