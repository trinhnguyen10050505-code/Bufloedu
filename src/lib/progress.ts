import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types";

export type SaveStudentProgressPayload = {
  studentId: string;
  lessonId: string;
  activityType: "practice" | "quick_test" | "focus_room" | "diagnostic_test";
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
};

export type SaveDiagnosticResultPayload = {
  studentId: string;
  score: number;
  totalQuestions: number;
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
  level: StudentLevel;
  weakLessonIds: string[];
  recommendedLessonIds: string[];
  recommendedPracticeLevels: string[];
  nextAction: string;
};

export async function saveStudentProgress(payload: SaveStudentProgressPayload) {
  await addDoc(collection(db, "student_progress"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function saveDiagnosticResult(payload: SaveDiagnosticResultPayload) {
  await addDoc(collection(db, "diagnostic_results"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function updateStudentPersonalization(params: {
  studentId: string;
  currentLevel: StudentLevel;
  weakLessonIds: string[];
  recommendedLessonIds: string[];
  recommendedPracticeLevels: string[];
  nextAction: string;
}) {
  await setDoc(
    doc(db, "users", params.studentId),
    {
      diagnosticCompleted: true,
      currentLevel: params.currentLevel,
      weakLessonIds: params.weakLessonIds,
      recommendedLessonIds: params.recommendedLessonIds,
      recommendedPracticeLevels: params.recommendedPracticeLevels,
      nextAction: params.nextAction,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}