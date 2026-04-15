"use client";

import { useEffect, useState } from "react";

export default function FocusRoomPage() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSelectMinutes = (value: number) => {
    setMinutes(value);
    setSecondsLeft(value * 60);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm text-slate-300">Phòng học tập trung</p>
          <h1 className="mt-2 text-4xl font-bold">Focus Room</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Chọn một phiên học ngắn, tập trung làm đúng một việc và giữ nhịp học ổn định.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <p className="text-lg text-slate-300">Thời gian còn lại</p>
          <p className="mt-6 text-7xl font-bold tracking-wider">{formatTime(secondsLeft)}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[15, 25, 40].map((value) => (
              <button
                key={value}
                onClick={() => handleSelectMinutes(value)}
                className={`rounded-2xl px-4 py-3 font-semibold ${
                  minutes === value ? "bg-blue-600 text-white" : "bg-white/10 text-slate-200"
                }`}
              >
                {value} phút
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setRunning(true)}
              className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600"
            >
              Bắt đầu
            </button>
            <button
              onClick={() => setRunning(false)}
              className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
            >
              Tạm dừng
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setSecondsLeft(minutes * 60);
              }}
              className="rounded-2xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
            >
              Đặt lại
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Mục tiêu phiên học</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
              <li>Ôn lại một bài học cụ thể</li>
              <li>Làm 5 đến 10 câu luyện tập</li>
              <li>Ghi lại phần còn chưa hiểu</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Gợi ý để tập trung tốt hơn</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
              <li>Tắt bớt thông báo không cần thiết</li>
              <li>Chuẩn bị sách, bút, vở trước khi bắt đầu</li>
              <li>Sau mỗi phiên, nghỉ ngắn 3 đến 5 phút</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}