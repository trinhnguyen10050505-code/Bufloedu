import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types/practice-final";

export type TeacherClassSummary = {
  classId: string;
  classCode: string;
  className: string;
  totalStudents: number;
  averageAccuracy: number;
  totalStudyMinutes: number;
  totalPracticeTimes: number;
  totalQuickTests: number;
  levelDistribution: {
    trungbinh: number;
    kha: number;
    gioi: number;
  };
};

export type TeacherStudentRow = {
  id: string;
  fullName: string;
  email?: string;
  classCode?: string;
  currentLevel: StudentLevel;
  lastAccuracy: number;
  totalStudyMinutes: number;
  totalPracticeTimes: number;
  totalQuickTests: number;
  weakLessonIds: string[];
  nextAction?: string;
};

export type TeacherRecentActivity = {
  id: string;
  studentId: string;
  studentName: string;
  classCode?: string;
  lessonId: string;
  activityType: string;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  createdAt?: any;
};

export type TeacherDashboardData = {
  totalClasses: number;
  totalStudents: number;
  averageAccuracy: number;
  totalStudyMinutes: number;
  totalPracticeTimes: number;
  totalQuickTests: number;
  levelDistribution: {
    trungbinh: number;
    kha: number;
    gioi: number;
  };
  classes: TeacherClassSummary[];
  students: TeacherStudentRow[];
  recentActivities: TeacherRecentActivity[];
};

function safeLevel(value: unknown): StudentLevel {
  if (value === "gioi" || value === "kha" || value === "trungbinh") {
    return value;
  }

  return "trungbinh";
}

function levelToLabel(level: StudentLevel) {
  if (level === "gioi") return "Bu Thông thái";
  if (level === "kha") return "Bu Vững vàng";
  return "Bu Chăm chỉ";
}

function getTimestampMs(value: any) {
  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return 0;
}

function average(numbers: number[]) {
  const valid = numbers.filter((item) => Number.isFinite(item));

  if (valid.length === 0) return 0;

  return Math.round(
    valid.reduce((sum, item) => sum + item, 0) / valid.length
  );
}

export function getTeacherLevelLabel(level: StudentLevel) {
  return levelToLabel(level);
}

export async function getTeacherDashboardData(
  teacherId: string
): Promise<TeacherDashboardData> {
  const classesQuery = query(
    collection(db, "classes"),
    where("teacherId", "==", teacherId)
  );

  const classesSnapshot = await getDocs(classesQuery);

  const classes = classesSnapshot.docs.map((docItem) => {
    const data = docItem.data();

    return {
      id: docItem.id,
      classId: data.classId || docItem.id,
      classCode: data.classCode || "",
      className: data.className || data.name || "Lớp học",
    };
  });

  const classCodes = classes.map((item) => item.classCode).filter(Boolean);

  let students: TeacherStudentRow[] = [];

  if (classCodes.length > 0) {
    const usersSnapshot = await getDocs(collection(db, "users"));

    students = usersSnapshot.docs
      .map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          fullName: data.fullName || "Học sinh chưa đặt tên",
          email: data.email || "",
          classCode: data.classCode || "",
          currentLevel: safeLevel(data.currentLevel),
          lastAccuracy: Number(data.lastAccuracy || 0),
          totalStudyMinutes: 0,
          totalPracticeTimes: 0,
          totalQuickTests: 0,
          weakLessonIds: Array.isArray(data.weakLessonIds)
            ? data.weakLessonIds
            : [],
          nextAction: data.nextAction || "",
        };
      })
      .filter(
        (student) =>
          classCodes.includes(student.classCode || "") &&
          student.id &&
          student.fullName
      );
  }

  const studentIds = students.map((student) => student.id);
  const progressSnapshot = await getDocs(collection(db, "student_progress"));

  const progressItems = progressSnapshot.docs
    .map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as any),
    }))
    .filter((item) => studentIds.includes(item.studentId));

  const studentMap = new Map(students.map((student) => [student.id, student]));

  progressItems.forEach((item) => {
    const student = studentMap.get(item.studentId);
    if (!student) return;

    if (item.activityType === "focus_room" || item.activityType === "web_active_time") {
      student.totalStudyMinutes += Math.round(
        Number(item.durationInSeconds || 0) / 60
      );
    }

    if (item.activityType === "practice") {
      student.totalPracticeTimes += 1;
    }

    if (item.activityType === "quick_test") {
      student.totalQuickTests += 1;
    }
  });

  const levelDistribution = {
    trungbinh: students.filter((item) => item.currentLevel === "trungbinh")
      .length,
    kha: students.filter((item) => item.currentLevel === "kha").length,
    gioi: students.filter((item) => item.currentLevel === "gioi").length,
  };

  const classSummaries: TeacherClassSummary[] = classes.map((classItem) => {
    const classStudents = students.filter(
      (student) => student.classCode === classItem.classCode
    );

    return {
      classId: classItem.classId,
      classCode: classItem.classCode,
      className: classItem.className,
      totalStudents: classStudents.length,
      averageAccuracy: average(
        classStudents.map((student) => Number(student.lastAccuracy || 0))
      ),
      totalStudyMinutes: classStudents.reduce(
        (sum, student) => sum + student.totalStudyMinutes,
        0
      ),
      totalPracticeTimes: classStudents.reduce(
        (sum, student) => sum + student.totalPracticeTimes,
        0
      ),
      totalQuickTests: classStudents.reduce(
        (sum, student) => sum + student.totalQuickTests,
        0
      ),
      levelDistribution: {
        trungbinh: classStudents.filter(
          (student) => student.currentLevel === "trungbinh"
        ).length,
        kha: classStudents.filter((student) => student.currentLevel === "kha")
          .length,
        gioi: classStudents.filter((student) => student.currentLevel === "gioi")
          .length,
      },
    };
  });

  const recentActivities: TeacherRecentActivity[] = progressItems
    .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt))
    .slice(0, 12)
    .map((item) => {
      const student = studentMap.get(item.studentId);

      return {
        id: item.id,
        studentId: item.studentId,
        studentName: student?.fullName || "Học sinh",
        classCode: student?.classCode || "",
        lessonId: item.lessonId || "",
        activityType: item.activityType || "",
        accuracy: item.accuracy,
        level: safeLevel(item.level),
        durationInSeconds: item.durationInSeconds,
        createdAt: item.createdAt,
      };
    });

  return {
    totalClasses: classes.length,
    totalStudents: students.length,
    averageAccuracy: average(students.map((student) => student.lastAccuracy)),
    totalStudyMinutes: students.reduce(
      (sum, student) => sum + student.totalStudyMinutes,
      0
    ),
    totalPracticeTimes: students.reduce(
      (sum, student) => sum + student.totalPracticeTimes,
      0
    ),
    totalQuickTests: students.reduce(
      (sum, student) => sum + student.totalQuickTests,
      0
    ),
    levelDistribution,
    classes: classSummaries,
    students,
    recentActivities,
  };
}