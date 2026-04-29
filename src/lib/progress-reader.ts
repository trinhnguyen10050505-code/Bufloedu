import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AssignmentDoc,
  DiagnosticResultDoc,
  StudentLevel,
  StudentProgressDoc,
  TeacherClassDoc,
  UserProfile,
} from "@/types";
import { lessonsContent } from "@/data/lessons-content";

export interface StudentProgressItem extends StudentProgressDoc {
  id: string;
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

function getTimestampMs(value: unknown): number {
  if (!value) return 0;

  if (value instanceof Date) return value.getTime();

  const maybeSeconds = (value as any)?.seconds;
  if (typeof maybeSeconds === "number") {
    return maybeSeconds * 1000;
  }

  return 0;
}

function sortByCreatedAtDesc<T extends { createdAt?: unknown }>(items: T[]): T[] {
  return [...items].sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt));
}

function calculateLevelFromProgress(items: StudentProgressItem[]): StudentLevel {
  const withLevel = items.filter(
    (item): item is StudentProgressItem & { level: StudentLevel } =>
      Boolean(item.level)
  );

  if (withLevel.length === 0) return "trungbinh";

  const scores: Record<StudentLevel, number> = {
    trungbinh: 0,
    kha: 0,
    gioi: 0,
  };

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
  const weakLessonIds = new Set<string>();

  items.forEach((item) => {
    if (
      item.lessonId?.startsWith("lesson-") &&
      typeof item.accuracy === "number" &&
      item.accuracy < 60
    ) {
      weakLessonIds.add(item.lessonId);
    }
  });

  return Array.from(weakLessonIds)
    .map((lessonId) => lessonsContent[lessonId as keyof typeof lessonsContent]?.title)
    .filter(Boolean)
    .slice(0, 4) as string[];
}

function buildSuggestedActions(
  items: StudentProgressItem[],
  currentLevel: StudentLevel
): string[] {
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

export async function getStudentProfile(studentId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", studentId));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function getStudentProgress(studentId: string): Promise<StudentProgressItem[]> {
  const q = query(collection(db, "student_progress"), where("studentId", "==", studentId));
  const snapshot = await getDocs(q);

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as StudentProgressDoc),
  }));

  return sortByCreatedAtDesc(items);
}

export async function getRecentStudentProgress(
  studentId: string,
  maxItems = 5
): Promise<StudentProgressItem[]> {
  const items = await getStudentProgress(studentId);
  return items.slice(0, maxItems);
}

export async function getLatestDiagnosticResult(
  studentId: string
): Promise<DiagnosticResultDoc | null> {
  const q = query(
    collection(db, "diagnostic_results"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);

  const items = snapshot.docs.map((doc) => doc.data() as DiagnosticResultDoc);
  const sorted = sortByCreatedAtDesc(items);

  return sorted[0] ?? null;
}

export async function getDashboardProgressSummary(
  studentId: string
): Promise<DashboardProgressSummary> {
  const [items, userProfile, latestDiagnostic] = await Promise.all([
    getStudentProgress(studentId),
    getStudentProfile(studentId),
    getLatestDiagnosticResult(studentId),
  ]);

  const currentLevel =
    userProfile?.currentLevel ??
    latestDiagnostic?.level ??
    calculateLevelFromProgress(items);

  const completedLessonsCount = calculateCompletedLessons(items);
  const totalFocusMinutes = calculateFocusMinutes(items);
  const recentResults = items.slice(0, 5);

  const suggestedLessons =
    userProfile?.recommendedLessonIds?.length
      ? userProfile.recommendedLessonIds
      : latestDiagnostic?.recommendedLessonIds?.length
      ? latestDiagnostic.recommendedLessonIds
      : buildSuggestedLessons(items);

  const suggestedActions =
    userProfile?.nextAction
      ? [userProfile.nextAction]
      : latestDiagnostic?.nextAction
      ? [latestDiagnostic.nextAction]
      : buildSuggestedActions(items, currentLevel);

  const weakTopics =
    userProfile?.weakLessonIds?.length
      ? userProfile.weakLessonIds
          .map((lessonId) => lessonsContent[lessonId as keyof typeof lessonsContent]?.title)
          .filter(Boolean) as string[]
      : latestDiagnostic?.weakLessonIds?.length
      ? latestDiagnostic.weakLessonIds
          .map((lessonId) => lessonsContent[lessonId as keyof typeof lessonsContent]?.title)
          .filter(Boolean) as string[]
      : buildWeakTopics(items);

  return {
    currentLevel,
    completedLessonsCount,
    totalFocusMinutes,
    recentResults,
    suggestedLessons,
    suggestedActions,
    weakTopics: weakTopics.slice(0, 4),
  };
}

export async function getTeacherDashboardData(teacherId: string) {
  const classesSnapshot = await getDocs(
    query(collection(db, "classes"), where("teacherId", "==", teacherId))
  );

  const classes = classesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as TeacherClassDoc),
  }));

  const classIds = classes.map((item) => item.id).filter(Boolean) as string[];

  const classStudentsSnapshot = await getDocs(collection(db, "class_students"));
  const classStudents = classStudentsSnapshot.docs
    .map((doc) => doc.data() as { classId: string; studentId: string })
    .filter((item) => classIds.includes(item.classId));

  const studentIds = Array.from(new Set(classStudents.map((item) => item.studentId)));

  const assignmentsSnapshot = await getDocs(
    query(collection(db, "assignments"), where("teacherId", "==", teacherId))
  );

  const assignments = assignmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as AssignmentDoc),
  }));

  const allProgressSnapshot = await getDocs(collection(db, "student_progress"));
  const allProgress = allProgressSnapshot.docs
    .map((doc) => doc.data() as StudentProgressDoc)
    .filter((item) => studentIds.includes(item.studentId));

  const studentsWithProgress = Array.from(
    new Set(allProgress.map((item) => item.studentId))
  ).length;

  const completionRate =
    studentIds.length > 0
      ? Math.round((studentsWithProgress / studentIds.length) * 100)
      : 0;

  return {
    classesCount: classes.length,
    studentsCount: studentIds.length,
    assignmentsCount: assignments.length,
    completionRate,
    classes,
    assignments,
  };
}

export async function getStudentProfilesByIds(studentIds: string[]) {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs
    .map((doc) => doc.data() as UserProfile)
    .filter((item) => studentIds.includes(item.uid));
}