import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types";

export type StudentProgressItem = {
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
  answerDetails?: Array<{
    questionId: string;
    lessonId: string;
    level: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
  }>;
  createdAt?: any;
};

export type DashboardProgressSummary = {
  currentLevel: StudentLevel;
  completedLessonsCount: number;
  totalFocusMinutes: number;
  recentResults: StudentProgressItem[];
  suggestedLessons: string[];
  suggestedActions: string[];
  weakTopics: string[];
  recentlyAnsweredQuestionIds: string[];
};

function getTimestamp(item: StudentProgressItem) {
  if (!item.createdAt) return 0;
  if (typeof item.createdAt?.seconds === "number") {
    return item.createdAt.seconds * 1000;
  }
  return 0;
}

export async function getStudentProgress(
  studentId: string
): Promise<StudentProgressItem[]> {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<StudentProgressItem, "id">),
    }))
    .sort((a, b) => getTimestamp(b) - getTimestamp(a));
}

function calculateLevel(items: StudentProgressItem[]): StudentLevel {
  const recentScored = items
    .filter(
      (item) =>
        typeof item.accuracy === "number" &&
        ["practice", "quick_test", "diagnostic_test", "mindmap_puzzle"].includes(
          item.activityType
        )
    )
    .slice(0, 5);

  if (recentScored.length === 0) return "trungbinh";

  const average =
    recentScored.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
    recentScored.length;

  if (average >= 80) return "gioi";
  if (average >= 50) return "kha";
  return "trungbinh";
}

function calculateCompletedLessons(items: StudentProgressItem[]) {
  const completed = new Set<string>();

  items.forEach((item) => {
    if (
      item.lessonId?.startsWith("lesson-") &&
      ["practice", "quick_test"].includes(item.activityType) &&
      (item.accuracy || 0) >= 60
    ) {
      completed.add(item.lessonId);
    }
  });

  return completed.size;
}

function calculateFocusMinutes(items: StudentProgressItem[]) {
  const totalSeconds = items.reduce((sum, item) => {
    if (item.activityType === "focus_room") {
      return sum + (item.durationInSeconds || 0);
    }
    return sum;
  }, 0);

  return Math.round(totalSeconds / 60);
}

function detectWeakLessons(items: StudentProgressItem[]) {
  const weakMap = new Map<string, number>();

  items.forEach((item) => {
    if (
      item.lessonId?.startsWith("lesson-") &&
      typeof item.accuracy === "number" &&
      item.accuracy < 60
    ) {
      weakMap.set(item.lessonId, (weakMap.get(item.lessonId) || 0) + 1);
    }

    item.answerDetails?.forEach((answer) => {
      if (!answer.isCorrect) {
        weakMap.set(answer.lessonId, (weakMap.get(answer.lessonId) || 0) + 1);
      }
    });
  });

  return Array.from(weakMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([lessonId]) => lessonId)
    .slice(0, 3);
}

function getWeakTopicLabels(lessonIds: string[]) {
  const map: Record<string, string> = {
    "lesson-2": "Phản ứng hóa học",
    "lesson-3": "Mol và tỉ khối chất khí",
    "lesson-4": "Nồng độ dung dịch",
    "lesson-5": "Định luật bảo toàn khối lượng",
  };

  return lessonIds.map((lessonId) => map[lessonId] || lessonId);
}

function collectRecentlyAnsweredQuestionIds(items: StudentProgressItem[]) {
  return Array.from(
    new Set(
      items
        .slice(0, 8)
        .flatMap((item) => item.questionIds || [])
        .filter(Boolean)
    )
  ).slice(0, 60);
}

function buildSuggestedActions(params: {
  currentLevel: StudentLevel;
  weakLessonIds: string[];
  totalFocusMinutes: number;
  recentResults: StudentProgressItem[];
}) {
  const actions: string[] = [];

  if (params.weakLessonIds.length > 0) {
    actions.push("Ôn lại phần còn yếu trước khi học bài mới.");
  }

  if (params.currentLevel === "trungbinh") {
    actions.push("Luyện câu nhận biết và thông hiểu để xây nền chắc hơn.");
  } else if (params.currentLevel === "kha") {
    actions.push("Luyện thêm thông hiểu và vận dụng cơ bản để nâng mức.");
  } else {
    actions.push("Làm quick-test và câu vận dụng để giữ phong độ.");
  }

  if (params.totalFocusMinutes < 30) {
    actions.push("Vào Focus Room 15–25 phút để tăng nhịp tập trung.");
  }

  const latest = params.recentResults[0];
  if (latest && typeof latest.accuracy === "number" && latest.accuracy < 60) {
    actions.push("Làm lại một bộ luyện tập mới, Bu sẽ trộn câu khác để tránh lặp.");
  }

  return actions.slice(0, 4);
}

export async function getDashboardProgressSummary(
  studentId: string
): Promise<DashboardProgressSummary> {
  const items = await getStudentProgress(studentId);

  const currentLevel = calculateLevel(items);
  const completedLessonsCount = calculateCompletedLessons(items);
  const totalFocusMinutes = calculateFocusMinutes(items);
  const recentResults = items.slice(0, 5);
  const weakLessonIds = detectWeakLessons(items);
  const suggestedLessons =
    weakLessonIds.length > 0 ? weakLessonIds : ["lesson-2"];
  const weakTopics = getWeakTopicLabels(weakLessonIds);
  const recentlyAnsweredQuestionIds = collectRecentlyAnsweredQuestionIds(items);

  return {
    currentLevel,
    completedLessonsCount,
    totalFocusMinutes,
    recentResults,
    suggestedLessons,
    suggestedActions: buildSuggestedActions({
      currentLevel,
      weakLessonIds,
      totalFocusMinutes,
      recentResults,
    }),
    weakTopics,
    recentlyAnsweredQuestionIds,
  };
}

export async function getLatestDiagnosticResult(studentId: string) {
  const q = query(
    collection(db, "diagnostic_results"),
    where("studentId", "==", studentId),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function getTeacherDashboardData(teacherId: string) {
  // Placeholder implementation
  // In a real app, this would aggregate data from students, classes, etc.
  return {
    totalStudents: 0,
    totalClasses: 0,
    averagePerformance: 0,
    recentActivities: [],
  };
}