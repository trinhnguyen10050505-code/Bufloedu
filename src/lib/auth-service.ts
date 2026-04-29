import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/types";

export async function registerStudent(payload: {
  fullName: string;
  email: string;
  password: string;
  school: string;
  grade: string;
}) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const userProfile: UserProfile = {
    uid: credential.user.uid,
    fullName: payload.fullName,
    email: payload.email,
    role: "student",
    school: payload.school,
    grade: payload.grade,
    diagnosticCompleted: false,
    currentLevel: "trungbinh",
    weakLessonIds: [],
    recommendedLessonIds: ["lesson-2"],
    recommendedPracticeLevels: ["nhanbiet"],
    nextAction: "Làm bài test chẩn đoán để Bu hiểu rõ em hơn.",
  };

  await setDoc(doc(db, "users", credential.user.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userProfile;
}

export async function registerTeacher(payload: {
  fullName: string;
  email: string;
  password: string;
  school: string;
  subject: string;
}) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const userProfile: UserProfile = {
    uid: credential.user.uid,
    fullName: payload.fullName,
    email: payload.email,
    role: "teacher",
    school: payload.school,
    subject: payload.subject,
  };

  await setDoc(doc(db, "users", credential.user.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userProfile;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const snapshot = await getDoc(doc(db, "users", credential.user.uid));

  if (!snapshot.exists()) {
    throw new Error(
      "Tài khoản đã có trong Authentication nhưng chưa có hồ sơ trong Firestore/users."
    );
  }

  return snapshot.data() as UserProfile;
}

export async function logoutUser() {
  await signOut(auth);
}