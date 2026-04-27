import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types";

type SaveStudentProgressPayload = {
  studentId: string;
  lessonId: string;
  activityType: "practice" | "quick_test" | "focus_room" | "diagnostic_test";
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