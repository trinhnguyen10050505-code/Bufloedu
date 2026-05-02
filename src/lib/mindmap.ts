import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getMindmapByLesson(lessonId: string) {
  const q = query(collection(db, "mindmaps"), where("lessonId", "==", lessonId));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return items[0] || null;
}

export async function getLessonImages(lessonId: string) {
  const q = query(collection(db, "lesson_images"), where("lessonId", "==", lessonId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getMindmapPuzzleByLesson(lessonId: string) {
  const q = query(
    collection(db, "mindmap_puzzles"),
    where("lessonId", "==", lessonId)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return items[0] || null;
}