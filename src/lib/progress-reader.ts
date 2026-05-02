import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  getTeacherAssignments,
  getTeacherClassesWithCounts,
} from "@/lib/teacher-reader";
import { DiagnosticResultDoc, StudentLevel } from "@/types";

export type StudentProgressItem = {
  studentId: string;
  lessonId: string;
  activityType: string;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  createdAt?: any;
};

export type DashboardSummary = {
  currentLevel: StudentLevel;
  completedLessonsCount: number;
  totalFocusMinutes: number;
  recentResults: StudentProgressItem[];
  suggestedLessons: string[];
  suggestedActions: string[];
  weakTopics: string[];
  streakDays: number;
};

export async function getLatestDiagnosticResult(
  studentId: string
): Promise<DiagnosticResultDoc | null> {
  const snapshot = await getDocs(
    query(
      collection(db, "diagnostic_results"),
      where("studentId", "==", studentId)
    )
  );

  const results = snapshot.docs
    .map((doc) => doc.data() as DiagnosticResultDoc)
    .sort((a, b) => {
      const aTime = getCreatedAtSeconds(a.createdAt);
      const bTime = getCreatedAtSeconds(b.createdAt);
      return bTime - aTime;
    });

  return results.length > 0 ? results[0] : null;
}

export async function getTeacherDashboardData(teacherId: string) {
  const [classes, assignments] = await Promise.all([
    getTeacherClassesWithCounts(teacherId),
    getTeacherAssignments(teacherId),
  ]);

  const classesCount = classes.length;
  const studentsCount = classes.reduce(
    (sum, item) => sum + (item.studentsCount ?? 0),
    0
  );
  const completionRate = classesCount
    ? Math.round(
        classes.reduce((sum, item) => sum + (item.completionRate ?? 0), 0) /
          classesCount
      )
    : 0;

  return {
    classesCount,
    studentsCount,
    assignmentsCount: assignments.length,
    completionRate,
  };
}

function getCreatedAtSeconds(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as any).seconds === "number"
  ) {
    return (value as any).seconds;
  }

  return 0;
}

function getTimestamp(item: any) {
  if (!item?.createdAt) return 0;
  return getCreatedAtSeconds(item.createdAt) * 1000;
}

// =======================
// MAIN
// =======================
export async function getDashboardProgressSummary(
  studentId: string
): Promise<DashboardSummary> {
  const snapshot = await getDocs(
    query(collection(db, "student_progress"), where("studentId", "==", studentId))
  );

  const items = snapshot.docs.map(
    (doc) => doc.data() as StudentProgressItem
  );

  const sorted = [...items].sort(
    (a, b) => getTimestamp(b) - getTimestamp(a)
  );

  const recentResults = sorted.slice(0, 5);

  const currentLevel = calculateLevel(items);

  const completedLessonsCount = countCompletedLessons(items);

  const totalFocusMinutes = calculateFocus(items);

  const weakTopics = detectWeakTopics(items);

  const suggestedLessons = buildSuggestedLessons(weakTopics);

  const suggestedActions = buildSuggestedActions(
    currentLevel,
    weakTopics,
    totalFocusMinutes
  );

  const streakDays = calculateStreak(sorted);

  return {
    currentLevel,
    completedLessonsCount,
    totalFocusMinutes,
    recentResults,
    suggestedLessons,
    suggestedActions,
    weakTopics,
    streakDays,
  };
}

// =======================
// LOGIC
// =======================

function calculateLevel(items: StudentProgressItem[]): StudentLevel {
  const levels = items.filter((i) => i.level);

  if (levels.length === 0) return "trungbinh";

  const score = { trungbinh: 0, kha: 0, gioi: 0 };

  levels.forEach((i) => {
    score[i.level!] += 1;
  });

  if (score.gioi >= score.kha && score.gioi >= score.trungbinh)
    return "gioi";
  if (score.kha >= score.trungbinh) return "kha";
  return "trungbinh";
}

function countCompletedLessons(items: StudentProgressItem[]) {
  const set = new Set<string>();

  items.forEach((i) => {
    if (
      i.lessonId &&
      i.accuracy &&
      i.accuracy >= 60 &&
      (i.activityType === "practice" ||
        i.activityType === "quick_test")
    ) {
      set.add(i.lessonId);
    }
  });

  return set.size;
}

function calculateFocus(items: StudentProgressItem[]) {
  const seconds = items.reduce((sum, i) => {
    if (i.activityType === "focus_room") {
      return sum + (i.durationInSeconds || 0);
    }
    return sum;
  }, 0);

  return Math.round(seconds / 60);
}

function detectWeakTopics(items: StudentProgressItem[]) {
  const weak: Record<string, number> = {};

  items.forEach((i) => {
    if (i.lessonId && i.accuracy && i.accuracy < 60) {
      weak[i.lessonId] = (weak[i.lessonId] || 0) + 1;
    }
  });

  return Object.keys(weak)
    .sort((a, b) => weak[b] - weak[a])
    .slice(0, 3);
}

function buildSuggestedLessons(weak: string[]) {
  return weak.length > 0 ? weak : ["lesson-2"];
}

function buildSuggestedActions(
  level: StudentLevel,
  weak: string[],
  focusMinutes: number
) {
  const actions: string[] = [];

  if (weak.length > 0) {
    actions.push("Ôn lại bài còn yếu trước.");
  }

  if (level === "trungbinh") {
    actions.push("Luyện nhận biết + thông hiểu.");
  } else if (level === "kha") {
    actions.push("Tăng cường câu vận dụng.");
  } else {
    actions.push("Giữ phong độ với quick-test.");
  }

  if (focusMinutes < 30) {
    actions.push("Vào Focus Room để tăng tập trung.");
  }

  return actions;
}

function calculateStreak(items: StudentProgressItem[]) {
  if (items.length === 0) return 0;

  let streak = 1;

  for (let i = 1; i < items.length; i++) {
    const diff =
      getTimestamp(items[i - 1]) - getTimestamp(items[i]);

    if (diff <= 86400000) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}