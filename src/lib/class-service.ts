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

export type ClassDoc = {
  id: string;
  className: string;
  classCode: string;
  teacherId: string;
  teacherName: string;
  school?: string;
  grade?: string;
  subject?: string;
};

function normalizeClassCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export async function createClassForTeacher(params: {
  className: string;
  classCode: string;
  teacherId: string;
  teacherName: string;
  school?: string;
  grade?: string;
  subject?: string;
}) {
  const classCode = normalizeClassCode(params.classCode);

  if (!classCode) {
    throw new Error("Vui lòng nhập mã lớp.");
  }

  const existedQuery = query(
    collection(db, "classes"),
    where("classCode", "==", classCode)
  );

  const existedSnapshot = await getDocs(existedQuery);

  if (!existedSnapshot.empty) {
    throw new Error("Mã lớp này đã tồn tại. Giáo viên hãy chọn mã khác.");
  }

  const docRef = await addDoc(collection(db, "classes"), {
    className: params.className,
    classCode,
    teacherId: params.teacherId,
    teacherName: params.teacherName,
    school: params.school || "",
    grade: params.grade || "",
    subject: params.subject || "Khoa học tự nhiên",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function findClassByCode(classCodeInput: string) {
  const classCode = normalizeClassCode(classCodeInput);

  const q = query(
    collection(db, "classes"),
    where("classCode", "==", classCode)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...(item.data() as Omit<ClassDoc, "id">),
  };
}

export async function joinClassByCode(params: {
  studentId: string;
  classCode: string;
}) {
  const classData = await findClassByCode(params.classCode);

  if (!classData) {
    throw new Error("Không tìm thấy lớp với mã này. Em kiểm tra lại mã giáo viên đưa nhé.");
  }

  await setDoc(
    doc(db, "users", params.studentId),
    {
      classId: classData.id,
      classCode: classData.classCode,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await setDoc(
    doc(db, "class_students", `${classData.id}_${params.studentId}`),
    {
      classId: classData.id,
      classCode: classData.classCode,
      teacherId: classData.teacherId,
      studentId: params.studentId,
      joinedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return classData;
}

export async function getTeacherClasses(teacherId: string) {
  const q = query(
    collection(db, "classes"),
    where("teacherId", "==", teacherId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<ClassDoc, "id">),
  }));
}