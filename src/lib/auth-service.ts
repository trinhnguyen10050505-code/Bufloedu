import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { joinClassByCode } from "@/lib/class-service";

export type UserRole = "student" | "teacher";

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  school?: string;
  grade?: string;
  className?: string;
  classCode?: string;
  subject?: string;
};

export async function registerUser(payload: RegisterPayload) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const uid = credential.user.uid;

  const baseProfile = {
    uid,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
    school: payload.school || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (payload.role === "student") {
    await setDoc(doc(db, "users", uid), {
      ...baseProfile,
      grade: payload.grade || "",
      className: payload.className || "",
      classCode: "",
      classId: "",
      currentLevel: "trungbinh",
      diagnosticCompleted: false,
      weakLessonIds: [],
      recommendedLessonIds: [],
      nextAction: "Làm test chẩn đoán để Bu hiểu mức học hiện tại của em.",
    });

    if (payload.classCode?.trim()) {
      await joinClassByCode({
        studentId: uid,
        classCode: payload.classCode,
      });
    }
  }

  if (payload.role === "teacher") {
    await setDoc(doc(db, "users", uid), {
      ...baseProfile,
      subject: payload.subject || "Khoa học tự nhiên",
      teacherCode: `GV-${uid.slice(0, 6).toUpperCase()}`,
    });
  }

  return {
    uid,
    role: payload.role,
  };
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    throw new Error("Không tìm thấy hồ sơ người dùng trong Firestore.");
  }

  return {
    uid,
    ...snapshot.data(),
  } as any;
}

export async function resetPassword(email: string) {
  if (!email.trim()) {
    throw new Error("Vui lòng nhập email trước khi đặt lại mật khẩu.");
  }

  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await signOut(auth);
}