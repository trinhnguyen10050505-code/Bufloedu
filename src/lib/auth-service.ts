import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  AppUserProfile,
  RegisterStudentPayload,
  RegisterTeacherPayload,
} from "@/types/auth";

export async function registerStudent(payload: RegisterStudentPayload) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const profile: AppUserProfile = {
    uid: credential.user.uid,
    fullName: payload.fullName,
    email: payload.email,
    role: "student",
    school: payload.school,
    grade: payload.grade,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", credential.user.uid), profile);

  return profile;
}

export async function registerTeacher(payload: RegisterTeacherPayload) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const profile: AppUserProfile = {
    uid: credential.user.uid,
    fullName: payload.fullName,
    email: payload.email,
    role: "teacher",
    school: payload.school,
    subject: payload.subject,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", credential.user.uid), profile);

  return profile;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) {
    throw new Error("Không tìm thấy hồ sơ người dùng.");
  }

  return snapshot.data() as AppUserProfile;
}

export async function logoutUser() {
  await signOut(auth);
}