import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AssignmentType = "practice" | "quick_test" | "mindmap" | "lesson";

export type AssignmentDoc = {
  id: string;
  teacherId: string;
  classId: string;
  classCode: string;
  title: string;
  description: string;
  lessonId: string;
  type: AssignmentType;
  dueDate?: string;
  createdAt?: any;
};

export async function createAssignment(params: {
  teacherId: string;
  classId: string;
  classCode: string;
  title: string;
  description: string;
  lessonId: string;
  type: AssignmentType;
  dueDate?: string;
}) {
  const docRef = await addDoc(collection(db, "assignments"), {
    teacherId: params.teacherId,
    classId: params.classId,
    classCode: params.classCode,
    title: params.title,
    description: params.description,
    lessonId: params.lessonId,
    type: params.type,
    dueDate: params.dueDate || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getAssignmentsForClass(classCode: string) {
  if (!classCode) return [];

  const q = query(
    collection(db, "assignments"),
    where("classCode", "==", classCode)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<AssignmentDoc, "id">),
  }));
}

export function getAssignmentHref(assignment: AssignmentDoc) {
  if (assignment.type === "practice") {
    return `/student/exercises?lessonId=${assignment.lessonId}&mode=by_lesson`;
  }

  if (assignment.type === "quick_test") {
    return `/student/lessons/${assignment.lessonId}/quick-test`;
  }

  if (assignment.type === "mindmap") {
    return `/student/mindmap?lessonId=${assignment.lessonId}`;
  }

  return `/student/lessons/${assignment.lessonId}`;
}