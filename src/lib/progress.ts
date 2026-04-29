import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DiagnosticResultDoc,
  ProgressActivityType,
  StudentLevel,
} from "@/types";

type SaveStudentProgressPayload = {
  studentId: string;
  lessonId: string;
  activityType: ProgressActivityType;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
};

export async function saveStudentProgress(payload: SaveStudentProgressPayload) {
  await addDoc(collection(db, "student_progress"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function saveDiagnosticResult(result: DiagnosticResultDoc) {
  await addDoc(collection(db, "diagnostic_results"), {
    ...result,
    createdAt: serverTimestamp(),
  });
}

export async function updateStudentPersonalization(params: {
  studentId: string;
  currentLevel: StudentLevel;
  weakLessonIds: string[];
  recommendedLessonIds: string[];
  recommendedPracticeLevels: ("nhanbiet" | "thonghieu" | "vandung")[];
  nextAction: string;
}) {
  await updateDoc(doc(db, "users", params.studentId), {
    diagnosticCompleted: true,
    currentLevel: params.currentLevel,
    weakLessonIds: params.weakLessonIds,
    recommendedLessonIds: params.recommendedLessonIds,
    recommendedPracticeLevels: params.recommendedPracticeLevels,
    nextAction: params.nextAction,
    updatedAt: serverTimestamp(),
  });
}