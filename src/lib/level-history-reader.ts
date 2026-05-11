import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentLevel } from "@/types/practice-final";

export type QuickTestLevelPoint = {
  id: string;
  lessonId: string;
  activityType: "quick_test";
  score?: number;
  totalQuestions?: number;
  accuracy: number;
  level: StudentLevel;
  createdAt?: any;
};

function getTimestamp(item: { createdAt?: any }) {
  if (typeof item.createdAt?.seconds === "number") {
    return item.createdAt.seconds * 1000;
  }

  return 0;
}

export function levelToNumber(level: StudentLevel) {
  if (level === "gioi") return 3;
  if (level === "kha") return 2;
  return 1;
}

export function numberToLevelLabel(value: number) {
  if (value >= 3) return "Giỏi";
  if (value >= 2) return "Khá";
  return "Trung bình";
}

export async function getQuickTestLevelHistory(studentId: string) {
  const q = query(
    collection(db, "student_progress"),
    where("studentId", "==", studentId),
    where("activityType", "==", "quick_test")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<QuickTestLevelPoint, "id">),
    }))
    .sort((a, b) => getTimestamp(a) - getTimestamp(b));
}