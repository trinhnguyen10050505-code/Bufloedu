import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type MaterialAudience = "student" | "teacher" | "both";
export type MaterialType =
  | "pdf"
  | "docx"
  | "pptx"
  | "image"
  | "video"
  | "elearning"
  | "other";

export type MaterialDoc = {
  id?: string;
  title: string;
  description?: string;
  lessonId?: string;
  classId?: string;
  uploadedBy: string;
  uploaderRole: "student" | "teacher";
  audience: MaterialAudience;
  materialType: MaterialType;
  downloadURL: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sourceText?: string;
  createdAt?: unknown;
};

export type GeneratedMaterialDoc = {
  id?: string;
  sourceMaterialId: string;
  lessonId?: string;
  title: string;
  summary: string;
  reviewNotes: string[];
  mcqQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  flashcards: Array<{
    front: string;
    back: string;
  }>;
  createdAt?: unknown;
};

function inferMaterialType(fileName: string, mimeType: string): MaterialType {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx") || lower.endsWith(".doc")) return "docx";
  if (lower.endsWith(".pptx") || lower.endsWith(".ppt")) return "pptx";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (lower.endsWith(".zip") || lower.includes("elearning")) return "elearning";

  return "other";
}

export async function createMaterialRecord(params: {
  title: string;
  description?: string;
  lessonId?: string;
  classId?: string;
  uploadedBy: string;
  uploaderRole: "student" | "teacher";
  audience: MaterialAudience;
  downloadURL: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sourceText?: string;
}) {
  const materialType = inferMaterialType(params.fileName, params.mimeType);

  const docRef = await addDoc(collection(db, "materials"), {
    ...params,
    materialType,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function createGeneratedMaterialRecord(
  payload: Omit<GeneratedMaterialDoc, "id" | "createdAt">
) {
  const docRef = await addDoc(collection(db, "generated_materials"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getMaterialsForUser(params: {
  uid: string;
  role: "student" | "teacher";
}) {
  const allSnapshot = await getDocs(collection(db, "materials"));

  const allItems = allSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as MaterialDoc),
  }));

  if (params.role === "teacher") {
    return allItems.filter(
      (item) =>
        item.uploadedBy === params.uid ||
        item.audience === "teacher" ||
        item.audience === "both"
    );
  }

  return allItems.filter(
    (item) =>
      item.uploadedBy === params.uid ||
      item.audience === "student" ||
      item.audience === "both"
  );
}

export async function getGeneratedMaterialsByLesson(lessonId: string) {
  const q = query(
    collection(db, "generated_materials"),
    where("lessonId", "==", lessonId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as GeneratedMaterialDoc),
  }));
}

export async function getGeneratedMaterialsForUser(params: {
  uid: string;
  role: "student" | "teacher";
}) {
  const [generatedSnapshot, materialsSnapshot] = await Promise.all([
    getDocs(collection(db, "generated_materials")),
    getDocs(collection(db, "materials")),
  ]);

  const generatedItems = generatedSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as GeneratedMaterialDoc),
  }));

  const materialMap = new Map(
    materialsSnapshot.docs.map((doc) => [
      doc.id,
      { id: doc.id, ...(doc.data() as MaterialDoc) },
    ])
  );

  return generatedItems
    .map((item) => {
      const sourceMaterial = materialMap.get(item.sourceMaterialId);
      return {
        ...item,
        sourceMaterial,
      };
    })
    .filter((item) => {
      const source = item.sourceMaterial;
      if (!source) return false;

      if (params.role === "teacher") {
        return (
          source.uploadedBy === params.uid ||
          source.audience === "teacher" ||
          source.audience === "both"
        );
      }

      return (
        source.uploadedBy === params.uid ||
        source.audience === "student" ||
        source.audience === "both"
      );
    });
}