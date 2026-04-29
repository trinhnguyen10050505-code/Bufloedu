"use client";

import { useEffect, useMemo, useState } from "react";
import { saveStudentProgress } from "@/lib/progress";
import BuChatWidget from "@/components/student/BuChatWidget";

const FOCUS_PRESETS = [
  { label: "Phiên ngắn", minutes: 15 },
  { label: "Phiên chuẩn", minutes: 25 },
  { label: "Phiên dài", minutes: 40 },
];

export default function FocusRoomPage() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    setRemainingSeconds(selectedMinutes * 60);
  }, [selectedMinutes]);

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
    try {
      setIsSaving(true);

      await saveStudentProgress({
        studentId: "demo-student-id",
        lessonId: "focus-room",
        activityType: "focus_room",
        durationInSeconds: selectedMinutes * 60,
      });

      setCompletedSessions((prev) => prev + 1);
    } catch (error) {
      console.error("Lưu Focus Room thất bại:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleStart() {
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
  }

  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remainingSeconds]);

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Focus Room
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Bu cùng em học tập trung từng phiên
            </h1>
            <p className="mt-3 max-w-2xl text-blue-50">
              Chọn một phiên học phù hợp, bắt đầu đếm giờ và giữ sự tập trung.
              Bu sẽ ghi nhận thời gian học của em để theo dõi tiến bộ lâu dài.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Bộ đếm giờ tập trung</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                Chọn phiên học và bắt đầu
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                {FOCUS_PRESETS.map((preset) => (
                  <button
                    key={preset.minutes}
                    type="button"
                    onClick={() => {
                      if (!isRunning) {
                        setSelectedMinutes(preset.minutes);
                      }
                    }}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      selectedMinutes === preset.minutes
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {preset.label} · {preset.minutes} phút
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">Thời gian còn lại</p>
                <p className="mt-3 text-6xl font-bold tracking-wide text-slate-800">
                  {timeDisplay}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={isRunning}
                    className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    Bắt đầu
                  </button>

                  <button
                    type="button"
                    onClick={handlePause}
                    disabled={!isRunning}
                    className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                  >
                    Tạm dừng
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
                  >
                    Đặt lại
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Trạng thái học tập</p>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Phiên đang chọn</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {selectedMinutes} phút
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Phiên đã hoàn thành</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {completedSessions}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Trạng thái</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {isRunning ? "Đang tập trung" : "Sẵn sàng bắt đầu"}
                    </p>
                  </div>
                </div>

                {isSaving && (
                  <p className="mt-4 text-sm text-blue-600">
                    Bu đang lưu thời gian học của em...
                  </p>
                )}
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-emerald-600">Bu gợi ý</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>• Đặt điện thoại ra xa để tránh xao nhãng.</li>
                  <li>• Chọn một mục tiêu nhỏ cho mỗi phiên học.</li>
                  <li>• Sau mỗi phiên, nghỉ ngắn 3 đến 5 phút.</li>
                  <li>• Khi học xong, làm thêm kiểm tra nhanh để ghi nhớ tốt hơn.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BuChatWidget
        lessonTitle="Focus Room"
        currentLevelLabel="Bu Chăm chỉ"
        weakTopics={[]}
      />
    </>
  );
}