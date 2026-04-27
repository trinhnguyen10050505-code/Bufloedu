import { collection, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types";

export type ProgressActivityType =
  | "practice"
  | "quick_test"
  | "focus_room"
  | "diagnostic_test";

export interface StudentProgressItem {
  id: string;
  studentId: string;
  lessonId: string;
  activityType: ProgressActivityType;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  createdAt?: unknown;
}

export interface DashboardProgressSummary {
  currentLevel: StudentLevel;
  completedLessonsCount: number;
  totalFocusMinutes: number;
  recentResults: StudentProgressItem[];
  suggestedLessons: string[];
  suggestedActions: string[];
  weakTopics: string[];
}

function calculateLevelFromProgress(items: StudentProgressItem[]): StudentLevel {
  const withLevel = items.filter((item) => item.level) as Array<
    StudentProgressItem & { level: StudentLevel }
  >;

  if (withLevel.length === 0) return "trungbinh";

  const scores = { trungbinh: 0, kha: 0, gioi: 0 };

  withLevel.forEach((item) => {
    scores[item.level] += 1;
  });

  if (scores.gioi >= scores.kha && scores.gioi >= scores.trungbinh) return "gioi";
  if (scores.kha >= scores.trungbinh) return "kha";
  return "trungbinh";
}

function calculateCompletedLessons(items: StudentProgressItem[]): number {
  const completedLessonIds = new Set<string>();

  items.forEach((item) => {
    if (
      item.lessonId?.startsWith("lesson-") &&
      (item.activityType === "practice" || item.activityType === "quick_test") &&
      (item.accuracy ?? 0) >= 60
    ) {
      completedLessonIds.add(item.lessonId);
    }
  });

  return completedLessonIds.size;
}

function calculateFocusMinutes(items: StudentProgressItem[]): number {
  const totalSeconds = items.reduce((sum, item) => {
    if (item.activityType === "focus_room") {
      return sum + (item.durationInSeconds ?? 0);
    }
    return sum;
  }, 0);

  return Math.round(totalSeconds / 60);
}

function buildSuggestedLessons(items: StudentProgressItem[]): string[] {
  const weakLessonMap = new Map<string, number>();

  items.forEach((item) => {
    if (
      item.lessonId?.startsWith("lesson-") &&
      (item.activityType === "practice" || item.activityType === "quick_test") &&
      typeof item.accuracy === "number" &&
      item.accuracy < 60
    ) {
      weakLessonMap.set(item.lessonId, (weakLessonMap.get(item.lessonId) ?? 0) + 1);
    }
  });

  return Array.from(weakLessonMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([lessonId]) => lessonId)
    .slice(0, 3);
}

function buildWeakTopics(items: StudentProgressItem[]): string[] {
  const weakTopics: string[] = [];

  const lowAccuracyLessons = items.filter(
    (item) =>
      item.lessonId?.startsWith("lesson-") &&
      typeof item.accuracy === "number" &&
      item.accuracy < 60
  );

  lowAccuracyLessons.forEach((item) => {
    if (item.lessonId === "lesson-2") {
      weakTopics.push("Phản ứng hóa học");
    }
    if (item.lessonId === "lesson-3") {
      weakTopics.push("Mol và tỉ khối chất khí");
    }
    if (item.lessonId === "lesson-4") {
      weakTopics.push("Nồng độ dung dịch");
    }
    if (item.lessonId === "lesson-5") {
      weakTopics.push("Định luật bảo toàn khối lượng");
    }
  });

  return Array.from(new Set(weakTopics)).slice(0, 4);
}

function buildSuggestedActions(items: StudentProgressItem[], currentLevel: StudentLevel): string[] {
  const actions: string[] = [];

  const hasDiagnostic = items.some((item) => item.activityType === "diagnostic_test");
  if (!hasDiagnostic) {
    actions.push("Làm bài test chẩn đoán để Bu xác định mức học phù hợp.");
  }

  const latestPractice = items.find((item) => item.activityType === "practice");
  if (latestPractice && (latestPractice.accuracy ?? 0) < 60) {
    actions.push("Ôn lại bài gần nhất và luyện lại phần Bu thấy em còn chưa chắc.");
  }

  if (currentLevel === "trungbinh") {
    actions.push("Luyện các câu nhận biết và thông hiểu trước để xây nền thật chắc.");
  } else if (currentLevel === "kha") {
    actions.push("Làm thêm bài luyện theo mức Bu Thông minh để tăng độ chắc kiến thức.");
  } else {
    actions.push("Thử thêm câu vận dụng và kiểm tra nhanh để giữ phong độ Bu Năng nổ.");
  }

  const recentFocus = items.filter((item) => item.activityType === "focus_room").length;
  if (recentFocus === 0) {
    actions.push("Vào Focus Room 15 đến 25 phút để giữ nhịp học đều.");
  }

  return actions.slice(0, 4);
}

export async function getStudentProgress(studentId: string): Promise<StudentProgressItem[]> {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", studentId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<StudentProgressItem, "id">),
  }));
}

export async function getRecentStudentProgress(
  studentId: string,
  maxItems = 5
): Promise<StudentProgressItem[]> {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", studentId),
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<StudentProgressItem, "id">),
  }));
}

export async function getDashboardProgressSummary(
  studentId: string
): Promise<DashboardProgressSummary> {
  const items = await getStudentProgress(studentId);

  const currentLevel = calculateLevelFromProgress(items);
  const completedLessonsCount = calculateCompletedLessons(items);
  const totalFocusMinutes = calculateFocusMinutes(items);
  const recentResults = items.slice(0, 5);
  const suggestedLessons = buildSuggestedLessons(items);
  const suggestedActions = buildSuggestedActions(items, currentLevel);
  const weakTopics = buildWeakTopics(items);

  return {
    currentLevel,
    completedLessonsCount,
    totalFocusMinutes,
    recentResults,
    suggestedLessons,
    suggestedActions,
    weakTopics,
  };
}