"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LevelBadge from "@/components/student/LevelBadge";
import ProgressCard from "@/components/student/ProgressCard";
import PracticeCard from "@/components/student/PracticeCard";
import QueueCard from "@/components/student/QueueCard";
import { science8Chapter1Queue } from "@/data/science8.chapter1";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { GRADIENT_PRIMARY, CARD_BASE } from "@/lib/theme";
import {
  DashboardProgressSummary,
  getDashboardProgressSummary,
} from "@/lib/progress-reader";

const DEMO_STUDENT_ID = "demo-student-id";

function mapLessonIdToTitle(lessonId: string): string {
  const found = science8Chapter1Queue.find((lesson) => lesson.lessonId === lessonId);
  return found?.lessonTitle ?? lessonId;
}

export default function StudentDashboardPage() {
  const [summary, setSummary] = useState<DashboardProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardProgressSummary(DEMO_STUDENT_ID);
        setSummary(data);
      } catch (error) {
        console.error("Đọc dashboard progress thất bại:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const currentLevel = summary?.currentLevel ?? "trungbinh";
  const buMeta = getBuLevelMeta(currentLevel);

  const completedLessons = summary?.completedLessonsCount ?? 0;
  const totalLessons = science8Chapter1Queue.length;
  const focusMinutes = summary?.totalFocusMinutes ?? 0;

  const suggestedLessonTitles =
    summary?.suggestedLessons?.map(mapLessonIdToTitle) ?? [];

  const suggestedActions =
    summary?.suggestedActions?.length
      ? summary.suggestedActions
      : [
          "Làm bài test chẩn đoán để Bu hiểu rõ mức học hiện tại của em.",
          "Bắt đầu với một bài học trong lộ trình Bu đang gợi ý.",
          "Làm kiểm tra nhanh sau khi học xong để Bu xem em đã nắm bài chưa.",
        ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className={`${GRADIENT_PRIMARY} overflow-hidden rounded-[32px] p-8 text-white shadow-lg md:p-10`}>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
                Khu học tập cá nhân hóa
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Chào em, hôm nay Bu sẽ đồng hành cùng em nhé
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
                Bu đang đọc dữ liệu học tập của em để gợi ý bài nên học trước,
                phần cần ôn lại và cách luyện phù hợp nhất.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <LevelBadge level={currentLevel} />
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
                  {buMeta.shortDescription}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/student/diagnostic-test"
                  className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Làm bài test chẩn đoán
                </Link>

                <Link
                  href="/student/exercises"
                  className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
                >
                  Bắt đầu luyện tập
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-md">
              <p className="text-sm font-medium text-blue-100">Bu theo dõi tiến trình học của em</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Tiến độ bài học</p>
                  <p className="mt-2 text-3xl font-bold">
                    {completedLessons}/{totalLessons}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Focus time</p>
                  <p className="mt-2 text-3xl font-bold">{focusMinutes} phút</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-medium text-blue-100">Bu gợi ý hôm nay</p>
                {loading ? (
                  <p className="mt-3 text-sm text-white">Bu đang đọc dữ liệu học của em...</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-white">
                    {suggestedActions.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <ProgressCard
            title="Mức hiện tại của em"
            value={buMeta.label}
            subtitle={buMeta.shortDescription}
          />
          <ProgressCard
            title="Tiến độ 6 bài"
            value={`${completedLessons}/${totalLessons}`}
            subtitle="Bu đang tính từ kết quả luyện tập và kiểm tra gần đây của em."
          />
          <ProgressCard
            title="Nhịp học tập trung"
            value={`${focusMinutes} phút`}
            subtitle="Dữ liệu này lấy từ các phiên Focus Room em đã hoàn thành."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={`${CARD_BASE} p-6 sm:p-8`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Lộ trình học theo bài</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  6 bài học trọng tâm dành cho em
                </h2>
              </div>

              <Link
                href="/student/exercises"
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Luyện tập ngay
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {science8Chapter1Queue.map((lesson, index) => {
                const isDone = index < completedLessons;
                const isCurrent = index === completedLessons;

                return (
                  <div
                    key={lesson.lessonId}
                    className={`rounded-3xl border p-5 transition ${
                      isCurrent
                        ? "border-blue-200 bg-blue-50"
                        : isDone
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold ${
                            isCurrent
                              ? "bg-blue-600 text-white"
                              : isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {lesson.lessonTitle}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {lesson.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {isDone && (
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Bu thấy em đã hoàn thành bài này
                              </span>
                            )}
                            {isCurrent && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                Bu gợi ý em học bài này tiếp theo
                              </span>
                            )}
                            {!isDone && !isCurrent && (
                              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                Chưa bắt đầu
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/student/lessons/${lesson.lessonId}`}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Học bài này
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <QueueCard
              title="Bu gợi ý học hôm nay"
              items={suggestedActions}
            />

            <QueueCard
              title="Bu thấy em nên chú ý các bài này"
              items={
                suggestedLessonTitles.length
                  ? suggestedLessonTitles
                  : ["Chưa có đủ dữ liệu, Bu sẽ gợi ý rõ hơn sau vài lần luyện tập."]
              }
            />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <PracticeCard
            title="Đánh giá mức độ"
            description="Bu sẽ dùng bài test đầu vào và dữ liệu học tập để xác định điểm xuất phát phù hợp."
            href="/student/diagnostic-test"
            cta="Làm test"
          />
          <PracticeCard
            title="Luyện tập cá nhân hóa"
            description="Bu đọc kết quả gần đây để gợi ý bài tập đúng phần em còn thiếu."
            href="/student/exercises"
            cta="Vào luyện tập"
          />
          <PracticeCard
            title="Focus Room"
            description="Bu theo dõi nhịp học tập trung của em qua từng phiên học."
            href="/student/focus-room"
            cta="Bắt đầu focus"
          />
          <PracticeCard
            title="Bu theo dõi kết quả"
            description="Xem tiến độ, kết quả gần đây và những phần em nên ôn thêm."
            href="/student/results"
            cta="Xem kết quả"
          />
        </section>
      </div>
    </div>
  );
}