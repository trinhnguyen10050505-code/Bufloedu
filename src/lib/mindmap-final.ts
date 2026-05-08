import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type MindmapNode = {
  id: string;
  label: string;
  description: string;
  type: "center" | "main" | "detail" | "example";
  imageUrl?: string;
};

export type MindmapPuzzlePiece = {
  id: string;
  text: string;
  type: "concept" | "definition" | "example";
};

export type MindmapPuzzleTarget = {
  id: string;
  title: string;
  hint: string;
  accepts: string[];
};

export type MindmapDoc = {
  id: string;
  lessonId: string;
  title: string;
  centerText: string;
  nodes: MindmapNode[];
};

export type MindmapPuzzleDoc = {
  id: string;
  lessonId: string;
  title: string;
  pieces: MindmapPuzzlePiece[];
  targets: MindmapPuzzleTarget[];
};

export async function getMindmapByLesson(lessonId: string) {
  const q = query(collection(db, "mindmaps"), where("lessonId", "==", lessonId));
  const snapshot = await getDocs(q);

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MindmapDoc, "id">),
  }));

  return items[0] || null;
}

export async function getMindmapPuzzleByLesson(lessonId: string) {
  const q = query(
    collection(db, "mindmap_puzzles"),
    where("lessonId", "==", lessonId)
  );

  const snapshot = await getDocs(q);

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MindmapPuzzleDoc, "id">),
  }));

  return items[0] || null;
}