"use client";

import { useEffect, useState } from "react";
import LevelBadge from "@/components/student/LevelBadge";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { GRADIENT_PRIMARY, CARD_BASE } from "@/lib/theme";
import {
  StudentProgressItem,
  getDashboardProgressSummary,
} from "@/lib/progress-reader";

const DEMO_STUDENT_ID = "demo-student-id";

function formatScore(item: StudentProgressItem): string {
  if (
    typeof item.score === "number" &&
    typeof item.totalQuestions === "number" &&
    item.totalQuestions > 0
  ) {
    return `${item.score}/${item.totalQuestions}`;
  }

  if (typeof item.durationInSeconds === "number") {
    return `${Math.round(item.durationInSeconds / 60)} phút`;
  }

  return "Đã ghi nhận";
}

function formatStatus(item: StudentProgressItem): string {
  switch (item.activityType) {
    case "diagnostic_test":
      return "Bu đã cập nhật mức học hiện tại";
    case "practice":
      return "Bu ghi nhận kết quả luyện tập";
    case "quick_test":
      return "Bu ghi nhận kết quả kiểm tra nhanh";
    case "focus_room":
      return "Bu ghi nhận phiên Focus Room";
    default:
      return "Bu đã lưu tiến độ";
  }
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<"trungbinh" | "kha" | "gioi">("trungbinh");
  const [completedLessons, setCompletedLessons] = useState(0);
  const [recentResults, setRecentResults] = useState<StudentProgressItem[]>([]);
  const [focusMinutes, setFocusMinutes] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const summary = await getDashboardProgressSummary(DEMO_STUDENT_ID);
        setCurrentLevel(summary.currentLevel);
        setCompletedLessons(summary.completedLessonsCount);
        setRecentResults(summary.recentResults);
        setFocusMinutes(summary.totalFocusMinutes);
      } catch (error) {
        console.error("Đọc results progress thất bại:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const buMeta = getBuLevelMeta(currentLevel);

  const strengths = [
    "Bu thấy em đang duy trì được nhịp học đều ở nhiều hoạt động.",
    "Bu thấy em đã bắt đầu có dữ liệu tiến bộ rõ ràng qua các bài luyện tập.",
  ];

  const weaknesses = [
    "Bu cần thêm dữ liệu từ nhiều bài hơn để chỉ ra chính xác phần còn yếu.",
    "Em nên kết hợp luyện tập và kiểm tra nhanh để Bu đánh giá rõ hơn.",
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className={`${GRADIENT_PRIMARY} rounded-[32px] p-8 text-white shadow-lg`}>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
            Bu theo dõi tiến bộ của em
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Kết quả học tập
          </h1>
          <p className="mt-3 max-w-2xl text-blue-50">
            Bu sẽ đọc dữ liệu học tập thật của em để giúp em nhìn rõ mình đã tiến bộ ở đâu
            và cần đi tiếp theo hướng nào.
          </p>
        </section>

        <section className={`rounded-[28px] border p-6 shadow-sm ${buMeta.cardClass}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Mức học tập hiện tại</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">{buMeta.label}</h2>
              <p className="mt-2 max-w-2xl text-slate-700">{buMeta.shortDescription}</p>
            </div>

            <LevelBadge level={currentLevel} />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className={`${CARD_BASE} p-6`}>
            <p className="text-sm text-slate-500">Mức hiện tại của em</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">{buMeta.label}</p>
          </div>
          <div className={`${CARD_BASE} p-6`}>
            <p className="text-sm text-slate-500">Số bài đã hoàn thành</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">{completedLessons}</p>
          </div>
          <div className={`${CARD_BASE} p-6`}>
            <p className="text-sm text-slate-500">Tổng Focus time</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">{focusMinutes} phút</p>
          </div>
        </section>

        <section className={`${CARD_BASE} p-6`}>
          <h2 className="text-xl font-bold text-slate-800">
            Bu ghi nhận kết quả gần đây của em
          </h2>

          {loading ? (
            <p className="mt-4 text-slate-600">Bu đang đọc dữ liệu học tập của em...</p>
          ) : recentResults.length === 0 ? (
            <p className="mt-4 text-slate-600">
              Chưa có dữ liệu kết quả. Em hãy làm bài test hoặc luyện tập để Bu bắt đầu theo dõi nhé.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentResults.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{item.lessonId}</p>
                    <p className="text-sm text-slate-500">Kết quả: {formatScore(item)}</p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {formatStatus(item)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className={`${CARD_BASE} p-6`}>
            <h2 className="text-xl font-bold text-slate-800">Bu thấy em đang làm tốt</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={`${CARD_BASE} p-6`}>
            <h2 className="text-xl font-bold text-slate-800">Bu gợi ý em ôn thêm</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {weaknesses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`${CARD_BASE} p-6`}>
          <h2 className="text-xl font-bold text-slate-800">Bu nhắn em một điều</h2>
          <p className="mt-3 leading-7 text-slate-600">
            {buMeta.encouragement}
          </p>
        </section>
      </div>
    </div>
  );
}