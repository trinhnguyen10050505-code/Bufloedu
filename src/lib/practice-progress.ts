import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types/practice-final";

export type LearningActivityType =
  | "practice"
  | "quick_test"
  | "diagnostic_test"
  | "lesson_view"
  | "elearning_view"
  | "focus_room"
  | "mindmap_puzzle"
  | "web_active_time";

export async function saveLearningActivity(params: {
  studentId: string;
  lessonId: string;
  activityType: LearningActivityType;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  questionIds?: string[];
  answerDetails?: any[];
}) {
  await addDoc(collection(db, "student_progress"), {
    ...params,
    createdAt: serverTimestamp(),
  });
}

export async function updateStudentAfterAssessment(params: {
  studentId: string;
  currentLevel: StudentLevel;
  weakLessonIds: string[];
  recommendedLessonIds: string[];
  nextAction: string;
  lastAccuracy: number;
}) {
  await setDoc(
    doc(db, "users", params.studentId),
    {
      currentLevel: params.currentLevel,
      weakLessonIds: params.weakLessonIds,
      recommendedLessonIds: params.recommendedLessonIds,
      nextAction: params.nextAction,
      lastAccuracy: params.lastAccuracy,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function hasDoneQuickTest(params: {
  studentId: string;
  lessonId: string;
}) {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", params.studentId),
    where("lessonId", "==", params.lessonId),
    where("activityType", "==", "quick_test")
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;
}

export async function getRecentQuestionIds(studentId: string) {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => doc.data());

  return Array.from(
    new Set(items.flatMap((item: any) => item.questionIds || []).filter(Boolean))
  ).slice(0, 80);
}