"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { saveLearningActivity } from "@/lib/practice-progress";

export function useAutoStudyTimer(studentId?: string) {
  const pathname = usePathname();
  const activeSecondsRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!studentId) return;
    const currentStudentId = studentId;

    function inferLessonId(path: string) {
      const match = path.match(/\/student\/lessons\/(lesson-\d+)/);
      return match?.[1] || "global";
    }

    async function flush() {
      const seconds = activeSecondsRef.current;

      if (seconds <= 0) return;

      activeSecondsRef.current = 0;

      await saveLearningActivity({
        studentId: currentStudentId,
        lessonId: inferLessonId(pathname),
        activityType: "web_active_time",
        durationInSeconds: seconds,
      });
    }

    const timer = window.setInterval(() => {
      if (document.hidden) {
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();

      if (lastTickRef.current === null) {
        lastTickRef.current = now;
        return;
      }

      const diff = Math.floor((now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      if (diff > 0 && diff <= 5) {
        activeSecondsRef.current += diff;
      }

      if (activeSecondsRef.current >= 60) {
        void flush();
      }
    }, 1000);

    const onVisibilityChange = () => {
      if (document.hidden) {
        void flush();
      } else {
        lastTickRef.current = Date.now();
      }
    };

    window.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      void flush();
    };
  }, [studentId, pathname]);
}