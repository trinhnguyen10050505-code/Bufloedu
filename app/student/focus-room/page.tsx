"use client";

import { useEffect, useMemo, useState } from "react";
import { saveStudentProgress } from "@/lib/progress";
import { useCurrentUser } from "@/hook/useCurrentUser";
import FocusRoomPanel from "@/components/student/focus-room/FocusRoomPanel";
import { buildFocusPlan, EnergyMode } from "@/lib/focus-room";

const FOCUS_PRESETS = [
  { label: "Phiên ngắn", minutes: 15 },
  { label: "Phiên chuẩn", minutes: 25 },
  { label: "Phiên bứt tốc", minutes: 40 },
];

export default function FocusRoomPage() {
  const { profile } = useCurrentUser();

  const weakTopics = profile?.weakLessonIds || [];

  const [energyMode, setEnergyMode] = useState<EnergyMode>("vua");
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionFinishedMessage, setSessionFinishedMessage] = useState("");

  const focusPlan = useMemo(() => {
    return buildFocusPlan({
      level: profile?.currentLevel || "trungbinh",
      energyMode,
      weakTopics,
    });
  }, [profile?.currentLevel, energyMode, weakTopics]);

  useEffect(() => {
    setSelectedMinutes(focusPlan.recommendedMinutes);
    setRemainingSeconds(focusPlan.recommendedMinutes * 60);
  }, [focusPlan.recommendedMinutes]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          void handleCompleteSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, selectedMinutes]);

  async function handleCompleteSession() {
    if (!profile?.uid) return;

    try {
      setIsSaving(true);

      await saveStudentProgress({
        studentId: profile.uid,
        lessonId: "focus-room",
        activityType: "focus_room",
        durationInSeconds: selectedMinutes * 60,
        level: profile.currentLevel || "trungbinh",
      });

      setCompletedSessions((prev) => prev + 1);
      setSessionFinishedMessage(
        `Bu thấy em vừa hoàn thành 1 phiên ${selectedMinutes} phút. ${focusPlan.postSessionAction}`
      );
    } catch (error) {
      console.error("Lưu Focus Room thất bại:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleStart() {
    setSessionFinishedMessage("");
    if (remainingSeconds <= 0) {
      setRemainingSeconds(selectedMinutes * 60);
    }
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setRemainingSeconds(selectedMinutes * 60);
    setSessionFinishedMessage("");
  }

  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remainingSeconds]);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Focus Room thông minh
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu không chỉ đếm giờ, Bu còn dẫn nhịp học cho em
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Focus Room sẽ điều chỉnh theo mức học hiện tại, phần em còn yếu và trạng thái năng lượng
          của em để tạo ra phiên học phù hợp nhất.
        </p>
      </section>

      <FocusRoomPanel
        presets={FOCUS_PRESETS}
        selectedMinutes={selectedMinutes}
        remainingTime={timeDisplay}
        isRunning={isRunning}
        completedSessions={completedSessions}
        isSaving={isSaving}
        energyMode={energyMode}
        focusPlan={focusPlan}
        onSelectPreset={(minutes) => {
          if (!isRunning) {
            setSelectedMinutes(minutes);
            setRemainingSeconds(minutes * 60);
          }
        }}
        onChangeEnergyMode={(value) => {
          if (!isRunning) {
            setEnergyMode(value);
          }
        }}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />

      {sessionFinishedMessage ? (
        <section className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Bu nhận xét sau phiên học</p>
          <p className="mt-2 text-slate-700">{sessionFinishedMessage}</p>
        </section>
      ) : null}
    </div>
  );
}