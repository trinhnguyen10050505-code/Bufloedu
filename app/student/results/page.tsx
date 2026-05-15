"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import ChemText from "@/lib/ChemText";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  getStudentLearningHistorySummary,
  StudentLearningHistorySummary,
} from "@/lib/student-history-reader";

function formatActivity(type: string) {
  const map: Record<string, string> = {
    lesson_view: "Xem bài học",
    elearning_view: "E-learning",
    practice: "Luyện tập",
    quick_test: "Quick-test",
    diagnostic_test: "Test chẩn đoán",
    focus_room: "Focus Room",
    mindmap_puzzle: "Mindmap",
    web_active_time: "Thời gian học trên web",
  };

  return map[type] || type;
}

export default function StudentResultsPage() {
  const { profile, loading } = useCurrentUser();
  const [summary, setSummary] = useState<StudentLearningHistorySummary | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        const data = await getStudentLearningHistorySummary(profile.uid);
        setSummary(data);
      } catch (error) {
        console.error("Lỗi tải lịch sử học tập:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void load();
  }, [profile?.uid]);

  if (loading || pageLoading) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <p className="text-slate-600">Bu đang tổng hợp lịch sử học tập của em...</p>
      </div>
    );
  }

  const currentLevel = summary?.currentLevel || profile?.currentLevel || "trungbinh";
  const buMeta = getBuLevelMeta(currentLevel);

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Kết quả học tập
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu cho em thấy rõ mình đã học gì, luyện gì và nên làm gì tiếp
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Kết quả không chỉ là điểm số. Bu dùng lịch sử học bài, luyện tập,
          quick-test và thời gian học để đề xuất bước tiếp theo phù hợp với em.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/student/exercises"
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Bu trộn bộ luyện mới
          </Link>

          <Link
            href="/student/lessons"
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
          >
            Ôn bài đã học
          </Link>

          <Link
            href="/student/focus-room"
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
          >
            Vào Focus Room
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Mức hiện tại</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {buMeta.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {buMeta.shortDescription}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Thời gian học</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {summary?.totalStudyMinutes || 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">phút đã được ghi nhận</p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Lượt luyện tập</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {summary?.totalPracticeTimes || 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">lượt practice đã làm</p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Quick-test</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {summary?.totalQuickTests || 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">bài kiểm tra đã hoàn thành</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Bu hướng dẫn thông minh</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Việc nên làm tiếp theo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Dựa vào kết quả học tập của em, Bu gợi ý những hoạt động hữu ích.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/student/exercises"
            className="rounded-[26px] bg-blue-600 p-5 text-white transition hover:-translate-y-1 hover:shadow-md hover:bg-blue-700"
          >
            <h3 className="text-lg font-bold">Luyện thêm</h3>
            <p className="mt-2 text-sm leading-6 opacity-90">
              Làm thêm bộ câu mới để tăng kiến thức và kỹ năng của em.
            </p>
          </Link>

          <Link
            href="/student/focus-room"
            className="rounded-[26px] bg-emerald-600 p-5 text-white transition hover:-translate-y-1 hover:shadow-md hover:bg-emerald-700"
          >
            <h3 className="text-lg font-bold">Focus Room</h3>
            <p className="mt-2 text-sm leading-6 opacity-90">
              Học tập tập trung trong khoảng thời gian ngắn, tối ưu hiệu quả.
            </p>
          </Link>

          <Link
            href="/student/mindmap"
            className="rounded-[26px] bg-amber-500 p-5 text-white transition hover:-translate-y-1 hover:shadow-md hover:bg-amber-600"
          >
            <h3 className="text-lg font-bold">Ôn lại Mindmap</h3>
            <p className="mt-2 text-sm leading-6 opacity-90">
              Ôn tập kiến thức bằng sơ đồ tư duy và hình ảnh minh họa.
            </p>
          </Link>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">Lịch sử theo từng bài</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">
          Em đã học, luyện và kiểm tra bài nào?
        </h2>

        <div className="mt-6 grid gap-4">
          {(summary?.lessonHistories || []).map((lesson) => (
            <div
              key={lesson.lessonId}
              className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {lesson.lessonTitle}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        lesson.viewed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {lesson.viewed ? "Đã học bài" : "Chưa học"}
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      Luyện tập: {lesson.practicedTimes} lượt
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        lesson.quickTestDone
                          ? "bg-violet-100 text-violet-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {lesson.quickTestDone ? "Đã quick-test" : "Chưa quick-test"}
                    </span>

                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      Học: {Math.round(lesson.totalStudySeconds / 60)} phút
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                  <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                    <p className="text-xs text-slate-500">Practice tốt nhất</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {lesson.bestPracticeAccuracy}%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                    <p className="text-xs text-slate-500">Quick-test</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {typeof lesson.latestQuickTestAccuracy === "number"
                        ? `${lesson.latestQuickTestAccuracy}%`
                        : "—"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/student/lessons/${lesson.lessonId}`}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Ôn bài
                    </Link>

                    <Link
                      href={`/student/exercises?lessonId=${lesson.lessonId}&mode=by_lesson`}
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Luyện lại
                    </Link>

                    {!lesson.quickTestDone ? (
                      <Link
                        href={`/student/lessons/${lesson.lessonId}/quick-test`}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Quick-test
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-amber-600">Phần cần chú ý</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Bu phát hiện từ lịch sử làm bài
          </h2>

          <div className="mt-5 space-y-3">
            {summary?.weakLessonIds?.length ? (
              summary.weakLessonIds.map((lessonId) => (
                <Link
                  key={lessonId}
                  href={`/student/exercises?lessonId=${lessonId}&mode=weak_part`}
                  className="block rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                >
                  Ôn lại {lessonId} với bộ câu mới →
                </Link>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Bu chưa phát hiện phần yếu nổi bật. Em tiếp tục học và quick-test bài mới nhé.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Hoạt động gần đây</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Dòng thời gian học tập
          </h2>

          <div className="mt-5 space-y-4">
            {summary?.recentActivities?.length ? (
              summary.recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {formatActivity(item.activityType)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Bài: {item.lessonId || "Toàn hệ thống"}
                      </p>
                    </div>

                    {typeof item.accuracy === "number" ? (
                      <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-xs text-slate-500">Độ chính xác</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                          {item.accuracy}%
                        </p>
                      </div>
                    ) : item.durationInSeconds ? (
                      <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-xs text-slate-500">Thời gian</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                          {Math.round(item.durationInSeconds / 60)} phút
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Chưa có hoạt động nào. Em hãy học bài hoặc luyện tập để Bu bắt đầu ghi nhận.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}