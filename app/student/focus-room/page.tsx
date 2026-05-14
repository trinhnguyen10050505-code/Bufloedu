"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Clock3,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { saveLearningActivity } from "@/lib/practice-progress";
import {
  getStudentLearningHistorySummary,
  StudentLearningHistorySummary,
} from "@/lib/student-history-reader";

const focusPlans = [
  {
    minutes: 15,
    label: "Khởi động nhẹ",
    desc: "Phù hợp khi em mệt hoặc mới bắt đầu học.",
  },
  {
    minutes: 25,
    label: "Pomodoro chuẩn",
    desc: "Tập trung học lý thuyết hoặc luyện một bộ câu.",
  },
  {
    minutes: 40,
    label: "Đào sâu kiến thức",
    desc: "Dành cho bài khó, cần vừa học vừa ghi chú.",
  },
];

function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function FocusRoomPage() {
  const { profile } = useCurrentUser();

  const [summary, setSummary] = useState<StudentLearningHistorySummary | null>(
    null
  );
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [focusGoal, setFocusGoal] = useState("Ôn lại bài còn yếu và luyện tập.");
  const [distractionNote, setDistractionNote] = useState("");
  const [saved, setSaved] = useState(false);

  const startedRef = useRef(false);

  useEffect(() => {
    async function load() {
      if (!profile?.uid) return;
      const data = await getStudentLearningHistorySummary(profile.uid);
      setSummary(data);
    }

    void load();
  }, [profile?.uid]);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          setCompleted(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    setSecondsLeft(selectedMinutes * 60);
    setCompleted(false);
    setSaved(false);
  }, [selectedMinutes]);

  const currentLevel =
    summary?.currentLevel ?? profile?.currentLevel ?? "trungbinh";
  const buMeta = getBuLevelMeta(currentLevel);

  const progress = useMemo(() => {
    const total = selectedMinutes * 60;
    return Math.round(((total - secondsLeft) / total) * 100);
  }, [secondsLeft, selectedMinutes]);

  const focusSuggestion = useMemo(() => {
    if (!summary || summary.recentActivities.length === 0) {
      return [
        "Bắt đầu bằng 15 phút đọc lý thuyết.",
        "Sau đó luyện 5–8 câu để Bu có dữ liệu học tập.",
        "Nếu thấy khó, ghi lại câu hỏi để hỏi Bu.",
      ];
    }

    if (summary.weakLessonIds.length > 0) {
      return [
        "Mở mindmap của bài còn yếu trước.",
        "Ghi lại 3 ý chính em chưa chắc.",
        "Sau phiên focus, luyện lại một bộ câu đúng phần đó.",
      ];
    }

    return [
      "Duy trì nhịp học đều 25 phút.",
      "Chọn một bài mới hoặc ôn lại bài vừa học.",
      "Kết thúc phiên bằng 3 câu tự kiểm tra nhanh.",
    ];
  }, [summary]);

  async function saveFocusSession() {
    if (!profile?.uid || saved) return;

    const durationInSeconds = selectedMinutes * 60 - secondsLeft;

    if (durationInSeconds <= 30) return;

    await saveLearningActivity({
      studentId: profile.uid,
      lessonId: "focus-room",
      activityType: "focus_room",
      durationInSeconds,
    });

    setSaved(true);
  }

  async function handleFinish() {
    await saveFocusSession();
    setRunning(false);
    setCompleted(true);
  }

  async function handleReset() {
    await saveFocusSession();
    setRunning(false);
    setCompleted(false);
    setSecondsLeft(selectedMinutes * 60);
    startedRef.current = false;
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
              Focus Room thông minh
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">
              Bu giúp em học tập trung, đúng mục tiêu và có lưu tiến độ
            </h1>
            <p className="mt-4 max-w-3xl leading-8 text-blue-50">
              Focus Room không chỉ đếm giờ. Bu gợi ý việc nên làm, ghi nhận thời gian
              học thật và dẫn em về đúng phần cần ôn sau phiên tập trung.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                {buMeta.label}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                Đã học {summary?.totalStudyMinutes ?? 0} phút
              </span>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold text-blue-100">Bu đề xuất phiên này</p>
            <div className="mt-4 space-y-3">
              {focusSuggestion.map((item, index) => (
                <div key={item} className="rounded-2xl bg-white/10 p-3 text-sm">
                  {index + 1}. {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-blue-600">Chọn phiên focus</p>
          <div className="mt-5 grid gap-4">
            {focusPlans.map((plan) => (
              <button
                key={plan.minutes}
                onClick={() => setSelectedMinutes(plan.minutes)}
                className={`rounded-[26px] border p-5 text-left transition ${
                  selectedMinutes === plan.minutes
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-800">
                    {plan.minutes} phút · {plan.label}
                  </h2>
                  <Clock3 className="text-blue-600" />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {plan.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-[26px] bg-slate-50 p-5">
            <p className="font-bold text-slate-800">Mục tiêu phiên này</p>
            <textarea
              value={focusGoal}
              onChange={(event) => setFocusGoal(event.target.value)}
              className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background: `conic-gradient(#2563eb ${progress}%, rgba(226,232,240,0.9) ${progress}%)`,
                }}
              />
              <div className="relative flex h-56 w-56 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <p className="text-sm font-bold text-slate-500">
                  {running ? "Đang tập trung" : completed ? "Đã hoàn thành" : "Sẵn sàng"}
                </p>
                <p className="mt-2 text-6xl font-black text-slate-900">
                  {formatTime(secondsLeft)}
                </p>
                <p className="mt-2 text-sm text-slate-500">{progress}% phiên học</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setRunning((prev) => !prev);
                  startedRef.current = true;
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700"
              >
                {running ? <Pause size={20} /> : <Play size={20} />}
                {running ? "Tạm dừng" : "Bắt đầu"}
              </button>

              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white hover:bg-emerald-700"
              >
                <Flame size={20} />
                Hoàn thành
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-700 hover:bg-slate-200"
              >
                <RotateCcw size={20} />
                Đặt lại
              </button>
            </div>

            {completed ? (
              <div className="mt-6 w-full rounded-[26px] border border-emerald-200 bg-emerald-50 p-5">
                <p className="font-bold text-emerald-700">
                  Bu đã ghi nhận phiên tập trung của em
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Sau phiên này, Bu gợi ý em luyện một bộ câu ngắn hoặc xem lại mindmap
                  của bài đang học để giữ mạch kiến thức.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/student/exercises"
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Luyện tập ngay
                  </Link>
                  <Link
                    href="/student/mindmap"
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    Xem mindmap
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <Brain className="text-blue-600" />
          <h2 className="mt-4 text-xl font-black text-slate-800">
            Bu nhắc cách học
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Trong lúc focus, em chỉ nên mở một bài học, một mindmap hoặc một bộ
            luyện tập. Tránh đổi qua lại quá nhiều.
          </p>
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <Target className="text-emerald-600" />
          <h2 className="mt-4 text-xl font-black text-slate-800">
            Mục tiêu rõ ràng
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Mỗi phiên nên có một mục tiêu nhỏ: hiểu một khái niệm, làm một bộ câu,
            hoặc sửa một lỗi sai thường gặp.
          </p>
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <Sparkles className="text-amber-500" />
          <h2 className="mt-4 text-xl font-black text-slate-800">
            Ghi lại xao nhãng
          </h2>
          <textarea
            value={distractionNote}
            onChange={(event) => setDistractionNote(event.target.value)}
            placeholder="Ví dụ: em bị phân tâm vì điện thoại, chưa hiểu công thức..."
            className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </section>
    </div>
  );
}