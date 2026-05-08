"use client";

import { useCurrentUser } from "@/hook/useCurrentUser";
import { useAutoStudyTimer } from "@/hook/useAutoStudyTimer";

export default function StudentAutoStudyTracker() {
  const { profile } = useCurrentUser();

  useAutoStudyTimer(profile?.role === "student" ? profile.uid : undefined);

  return null;
}