import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AssignmentDoc, StudentProgressDoc, TeacherClassDoc, UserProfile } from "@/types";

export async function getTeacherClassesWithCounts(teacherId: string) {
  const classesSnapshot = await getDocs(
    query(collection(db, "classes"), where("teacherId", "==", teacherId))
  );

  const classes = classesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as TeacherClassDoc),
  }));

  const classStudentsSnapshot = await getDocs(collection(db, "class_students"));
  const classStudents = classStudentsSnapshot.docs.map((doc) => doc.data() as {
    classId: string;
    studentId: string;
  });

  const progressSnapshot = await getDocs(collection(db, "student_progress"));
  const progressItems = progressSnapshot.docs.map((doc) => doc.data() as StudentProgressDoc);

  return classes.map((classItem) => {
    const studentsInClass = classStudents.filter((item) => item.classId === classItem.id);
    const studentIds = studentsInClass.map((item) => item.studentId);

    const classProgress = progressItems.filter((item) =>
      studentIds.includes(item.studentId)
    );

    const studentsWithProgress = Array.from(
      new Set(classProgress.map((item) => item.studentId))
    ).length;

    const completionRate =
      studentIds.length > 0
        ? Math.round((studentsWithProgress / studentIds.length) * 100)
        : 0;

    return {
      ...classItem,
      studentsCount: studentIds.length,
      completionRate,
    };
  });
}

export async function getTeacherStudents(teacherId: string) {
  const classesSnapshot = await getDocs(
    query(collection(db, "classes"), where("teacherId", "==", teacherId))
  );

  const classes = classesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as TeacherClassDoc),
  }));

  const classStudentsSnapshot = await getDocs(collection(db, "class_students"));
  const classStudents = classStudentsSnapshot.docs.map((doc) => doc.data() as {
    classId: string;
    studentId: string;
  });

  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = usersSnapshot.docs.map((doc) => doc.data() as UserProfile);

  const progressSnapshot = await getDocs(collection(db, "student_progress"));
  const progressItems = progressSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as StudentProgressDoc),
  }));

  const teacherClassIds = classes.map((item) => item.id);

  const studentLinks = classStudents.filter((item) =>
    teacherClassIds.includes(item.classId)
  );

  return studentLinks
    .map((link) => {
      const student = users.find((user) => user.uid === link.studentId && user.role === "student");
      const classInfo = classes.find((item) => item.id === link.classId);
      const studentProgress = progressItems.filter((item) => item.studentId === link.studentId);

      const completedLessonIds = Array.from(
        new Set(
          studentProgress
            .filter(
              (item) =>
                (item.activityType === "practice" || item.activityType === "quick_test") &&
                (item.accuracy ?? 0) >= 60
            )
            .map((item) => item.lessonId)
        )
      );

      const averageAccuracy =
        studentProgress.filter((item) => typeof item.accuracy === "number").length > 0
          ? Math.round(
              studentProgress
                .filter((item) => typeof item.accuracy === "number")
                .reduce((sum, item) => sum + (item.accuracy ?? 0), 0) /
                studentProgress.filter((item) => typeof item.accuracy === "number").length
            )
          : 0;

      return {
        uid: student?.uid || link.studentId,
        fullName: student?.fullName || "Học sinh chưa có hồ sơ",
        className: classInfo?.className || "Chưa rõ lớp",
        currentLevel: student?.currentLevel || "trungbinh",
        weakLessonIds: student?.weakLessonIds || [],
        progressPercent: averageAccuracy,
        completedLessonsCount: completedLessonIds.length,
      };
    })
    .sort((a, b) => a.className.localeCompare(b.className) || a.fullName.localeCompare(b.fullName));
}

export async function getTeacherAssignments(teacherId: string) {
  const snapshot = await getDocs(
    query(collection(db, "assignments"), where("teacherId", "==", teacherId))
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as AssignmentDoc),
  }));
}