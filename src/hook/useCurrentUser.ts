import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";

export type UserRole = "student" | "teacher";

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  school?: string;
  className?: string;
  grade?: string;
  subject?: string;
};

export async function registerUser(payload: RegisterPayload) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const uid = credential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
    school: payload.school || "",
    className: payload.role === "student" ? payload.className || "" : "",
    grade: payload.role === "student" ? payload.grade || "" : "",
    subject: payload.role === "teacher" ? payload.subject || "Khoa học tự nhiên" : "",
    diagnosticCompleted: false,
    currentLevel: payload.role === "student" ? "trungbinh" : null,
    weakLessonIds: [],
    recommendedLessonIds: [],
    recommendedPracticeLevels: [],
    nextAction: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

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

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, profile, loading };
}