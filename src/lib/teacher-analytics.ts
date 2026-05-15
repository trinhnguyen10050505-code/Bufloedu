import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type StudentLevel = "trungbinh" | "kha" | "gioi";

export type TeacherStudent = {
  uid: string;
  fullName: string;
  email: string;
  role: "student";
  classCode?: string;
  currentLevel?: StudentLevel;
  lastAccuracy?: number;
  weakLessonIds?: string[];
  recommendedLessonIds?: string[];
  nextAction?: string;
};

export type StudentProgressDoc = {
  id: string;
  studentId: string;
  studentName?: string;
  classCode?: string;
  lessonId?: string;
  activityType:
    | "diagnostic_test"
    | "quick_test"
    | "practice"
    | "focus_room"
    | "web_active_time"
    | string;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  createdAt?: Timestamp;
};

export type TeacherReportSummary = {
  totalStudents: number;
  totalClasses: number;
  averageAccuracy: number;
  totalPracticeTimes: number;
  totalQuickTests: number;
  totalFocusMinutes: number;
  levelStats: {
    trungbinh: number;
    kha: number;
    gioi: number;
  };
  classSummaries: {
    classCode: string;
    totalStudents: number;
    averageAccuracy: number;
    totalPracticeTimes: number;
    totalQuickTests: number;
    totalFocusMinutes: number;
    levelStats: {
      trungbinh: number;
      kha: number;
      gioi: number;
    };
    weakLessons: string[];
  }[];
  alertStudents: {
    studentId: string;
    studentName: string;
    classCode: string;
    reason: string;
    accuracy?: number;
  }[];
};

function toDate(value: any): Date {
  if (!value) return new Date(0);
  if (typeof value?.toDate === "function") return value.toDate();
  return new Date(value);
}

export function getLevelLabel(level?: StudentLevel) {
  if (level === "gioi") return "Bu Thông thái";
  if (level === "kha") return "Bu Vững vàng";
  return "Bu Chăm chỉ";
}

export function getLevelTone(level?: StudentLevel) {
  if (level === "gioi") return "bg-emerald-100 text-emerald-700";
  if (level === "kha") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

export async function getTeacherStudents(classCodes: string[]) {
  if (classCodes.length === 0) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "users"),
      where("role", "==", "student"),
      where("classCode", "in", classCodes.slice(0, 10))
    )
  );

  return snapshot.docs.map(
    (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
      } as TeacherStudent)
  );
}

export async function getTeacherProgress(classCodes: string[]) {
  if (classCodes.length === 0) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "student_progress"),
      where("classCode", "in", classCodes.slice(0, 10)),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as StudentProgressDoc)
  );
}

export async function getProgressByStudent(studentId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, "student_progress"),
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as StudentProgressDoc)
  );
}

export function buildTeacherReportSummary({
  students,
  progress,
  classCodes,
}: {
  students: TeacherStudent[];
  progress: StudentProgressDoc[];
  classCodes: string[];
}): TeacherReportSummary {
  const levelStats = {
    trungbinh: 0,
    kha: 0,
    gioi: 0,
  };

  students.forEach((student) => {
    const level = student.currentLevel || "trungbinh";
    levelStats[level] += 1;
  });

  const scoredActivities = progress.filter(
    (item) =>
      typeof item.accuracy === "number" &&
      ["diagnostic_test", "quick_test", "practice"].includes(item.activityType)
  );

  const averageAccuracy =
    scoredActivities.length > 0
      ? Math.round(
          scoredActivities.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
            scoredActivities.length
        )
      : 0;

  const totalPracticeTimes = progress.filter(
    (item) => item.activityType === "practice"
  ).length;

  const totalQuickTests = progress.filter(
    (item) => item.activityType === "quick_test"
  ).length;

  const totalFocusMinutes = Math.round(
    progress
      .filter(
        (item) =>
          item.activityType === "focus_room" ||
          item.activityType === "web_active_time"
      )
      .reduce((sum, item) => sum + (item.durationInSeconds || 0), 0) / 60
  );

  const classSummaries = classCodes.map((classCode) => {
    const classStudents = students.filter(
      (student) => student.classCode === classCode
    );

    const classProgress = progress.filter((item) => item.classCode === classCode);

    const classScored = classProgress.filter(
      (item) =>
        typeof item.accuracy === "number" &&
        ["diagnostic_test", "quick_test", "practice"].includes(item.activityType)
    );

    const classAverageAccuracy =
      classScored.length > 0
        ? Math.round(
            classScored.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
              classScored.length
          )
        : 0;

    const classLevelStats = {
      trungbinh: 0,
      kha: 0,
      gioi: 0,
    };

    classStudents.forEach((student) => {
      const level = student.currentLevel || "trungbinh";
      classLevelStats[level] += 1;
    });

    const weakCount: Record<string, number> = {};

    classStudents.forEach((student) => {
      (student.weakLessonIds || []).forEach((lessonId) => {
        weakCount[lessonId] = (weakCount[lessonId] || 0) + 1;
      });
    });

    const weakLessons = Object.entries(weakCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([lessonId]) => lessonId);

    return {
      classCode,
      totalStudents: classStudents.length,
      averageAccuracy: classAverageAccuracy,
      totalPracticeTimes: classProgress.filter(
        (item) => item.activityType === "practice"
      ).length,
      totalQuickTests: classProgress.filter(
        (item) => item.activityType === "quick_test"
      ).length,
      totalFocusMinutes: Math.round(
        classProgress
          .filter(
            (item) =>
              item.activityType === "focus_room" ||
              item.activityType === "web_active_time"
          )
          .reduce((sum, item) => sum + (item.durationInSeconds || 0), 0) / 60
      ),
      levelStats: classLevelStats,
      weakLessons,
    };
  });

  const latestByStudent = new Map<string, StudentProgressDoc>();

  progress.forEach((item) => {
    if (!item.studentId) return;

    const current = latestByStudent.get(item.studentId);
    if (!current || toDate(item.createdAt) > toDate(current.createdAt)) {
      latestByStudent.set(item.studentId, item);
    }
  });

  const alertStudents = students
    .map((student) => {
      const latest = latestByStudent.get(student.uid);
      const accuracy = latest?.accuracy ?? student.lastAccuracy ?? 0;

      if ((student.currentLevel || "trungbinh") === "trungbinh") {
        return {
          studentId: student.uid,
          studentName: student.fullName,
          classCode: student.classCode || "",
          reason: "Đang ở mức Bu Chăm chỉ, cần theo dõi và giao bài nền.",
          accuracy,
        };
      }

      if (accuracy > 0 && accuracy < 50) {
        return {
          studentId: student.uid,
          studentName: student.fullName,
          classCode: student.classCode || "",
          reason: "Độ chính xác gần đây dưới 50%.",
          accuracy,
        };
      }

      if ((student.weakLessonIds || []).length >= 2) {
        return {
          studentId: student.uid,
          studentName: student.fullName,
          classCode: student.classCode || "",
          reason: "Có nhiều bài cần ôn lại.",
          accuracy,
        };
      }

      return null;
    })
    .filter(Boolean)
    .slice(0, 8) as TeacherReportSummary["alertStudents"];

  return {
    totalStudents: students.length,
    totalClasses: classCodes.length,
    averageAccuracy,
    totalPracticeTimes,
    totalQuickTests,
    totalFocusMinutes,
    levelStats,
    classSummaries,
    alertStudents,
  };
}