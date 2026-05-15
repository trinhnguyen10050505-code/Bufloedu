import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export type UploadOwnerRole = "teacher" | "student";

export type LearningUploadType =
  | "document"
  | "lesson_material"
  | "assignment_material"
  | "student_submission"
  | "mindmap_source"
  | "practice_source";

export type LearningUploadDoc = {
  id: string;
  ownerId: string;
  ownerRole: UploadOwnerRole;
  ownerName?: string;
  classCode?: string;
  lessonId?: string;
  assignmentId?: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadType: LearningUploadType;
  visibility: "private" | "class" | "teacher";
  status: "uploaded" | "processing" | "ready" | "failed";
  createdAt?: any;
};

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function uploadLearningFile({
  file,
  ownerId,
  ownerRole,
  ownerName,
  classCode,
  lessonId,
  assignmentId,
  title,
  description,
  uploadType,
  visibility,
  onProgress,
}: {
  file: File;
  ownerId: string;
  ownerRole: UploadOwnerRole;
  ownerName?: string;
  classCode?: string;
  lessonId?: string;
  assignmentId?: string;
  title: string;
  description?: string;
  uploadType: LearningUploadType;
  visibility: "private" | "class" | "teacher";
  onProgress?: (progress: number) => void;
}) {
  if (!ownerId) {
    throw new Error("Thiếu ownerId. Người dùng chưa đăng nhập.");
  }

  if (!file) {
    throw new Error("Chưa chọn file.");
  }

  const cleanName = safeFileName(file.name);
  const filePath = `learning_uploads/${ownerRole}/${ownerId}/${Date.now()}-${cleanName}`;
  const fileRef = ref(storage, filePath);

  const uploadTask = uploadBytesResumable(fileRef, file, {
    contentType: file.type || "application/octet-stream",
    customMetadata: {
      ownerId,
      ownerRole,
      classCode: classCode || "",
      lessonId: lessonId || "",
      assignmentId: assignmentId || "",
    },
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        onProgress?.(percent);
      },
      (error) => {
        console.error("FIREBASE_STORAGE_UPLOAD_ERROR:", {
          code: error.code,
          message: error.message,
          serverResponse: error.serverResponse,
        });

        reject(error);
      },
      () => {
        resolve();
      }
    );
  });

  const fileUrl = await getDownloadURL(fileRef);

  const docRef = await addDoc(collection(db, "uploads"), {
    ownerId,
    ownerRole,
    ownerName: ownerName || "",
    classCode: classCode || "",
    lessonId: lessonId || "",
    assignmentId: assignmentId || "",
    title,
    description: description || "",
    fileName: file.name,
    fileUrl,
    filePath,
    fileType: file.type || "unknown",
    fileSize: file.size,
    uploadType,
    visibility,
    status: "ready",
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    fileUrl,
    filePath,
  };
}

export async function getTeacherUploads(teacherId: string) {
  const q = query(
    collection(db, "uploads"),
    where("ownerId", "==", teacherId),
    where("ownerRole", "==", "teacher"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as LearningUploadDoc)
  );
}

export async function getStudentUploads(studentId: string) {
  const q = query(
    collection(db, "uploads"),
    where("ownerId", "==", studentId),
    where("ownerRole", "==", "student"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as LearningUploadDoc)
  );
}