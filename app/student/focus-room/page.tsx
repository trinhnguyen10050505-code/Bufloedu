"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { saveLearningActivity } from "@/lib/practice-progress";

export default function FocusRoomPage() {
  const { profile } = useCurrentUser();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;

  async function saveSession() {
    if (!profile?.uid || seconds < 10) return;

    await saveLearningActivity({
      studentId: profile.uid,
      lessonId: "focus-room",
      activityType: "focus_room",
      durationInSeconds: seconds,
    });

    setSaved(true);
    setRunning(false);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Focus Room
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu cùng em giữ nhịp học tập trung
        </h1>
        <p className="mt-4 max-w-3xl text-blue-50">
          Thời gian học trong Focus Room sẽ được lưu vào lịch sử để Bu theo dõi nhịp học.
        </p>
      </section>

      <section className="rounded-[36px] bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-blue-600">Phiên học hiện tại</p>
        <div className="mt-6 text-7xl font-black text-slate-800">
          {String(minutes).padStart(2, "0")}:{String(remainSeconds).padStart(2, "0")}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setRunning((prev) => !prev)}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {running ? "Tạm dừng" : "Tiếp tục"}
          </button>

          <button
            onClick={saveSession}
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Lưu phiên học
          </button>

          <Link
            href="/student/results"
            className="rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-200"
          >
            Xem kết quả
          </Link>
        </div>

        {saved ? (
          <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            Bu đã lưu phiên học tập trung của em.
          </p>
        ) : null}
      </section>
    </div>
  );
}