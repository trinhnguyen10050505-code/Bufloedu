"use client";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/types";

export function useCurrentUser() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const snapshot = await getDoc(doc(db, "users", user.uid));
      setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, profile, loading };
}