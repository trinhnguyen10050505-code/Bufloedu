"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type CurrentUserProfile = {
  uid: string;
  fullName: string;
  email: string;
  role: "student" | "teacher";
  school?: string;
  className?: string;
  grade?: string;
  subject?: string;
  diagnosticCompleted?: boolean;
  currentLevel?: "trungbinh" | "kha" | "gioi";
  weakLessonIds?: string[];
  recommendedLessonIds?: string[];
  recommendedPracticeLevels?: string[];
  nextAction?: string;
};

export function useCurrentUser() {
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setProfile(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);

      unsubscribeProfile = onSnapshot(
        userRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            setProfile(null);
            setLoading(false);
            return;
          }

          const data = snapshot.data() as Omit<CurrentUserProfile, "uid">;

          setProfile({
            uid: user.uid,
            ...data,
          });

          setLoading(false);
        },
        (error) => {
          console.error("Lỗi đọc hồ sơ người dùng:", error);
          setProfile(null);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return { profile, loading };
}