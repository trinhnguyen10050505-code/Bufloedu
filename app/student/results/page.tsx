"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { getDashboardProgressSummary, getLatestDiagnosticResult } from "@/lib/progress-reader";
import { lessonsContent } from "@/data/lessons-content";

export default function StudentResultsPage() {
  const { profile, loading } = useCurrentUser();
  const [summary, setSummary] = useState<any>(null);
  const [latestDiagnostic, setLatestDiagnostic] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        const [progressSummary, diagnostic] = await Promise.all([
          getDashboardProgressSummary(profile.uid),
          getLatestDiagnosticResult(profile.uid),
        ]);

        setSummary(progressSummary);
        setLatestDiagnostic(diagnostic);
      } catch (error) {
        console.error("Lỗi tải trang kết quả:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid]);

  const currentLevel = summary?.currentLevel || profile?.currentLevel || "trungbinh";
  const buMeta = getBuLevelMeta(currentLevel);

  const suggestedLessonTitles = useMemo(() => {
    const ids: string[] = summary?.suggestedLessons || profile?.recommendedLessonIds || [];
    return ids
      .map((lessonId) => lessonsContent[lessonId as keyof typeof lessonsContent]?.title || lessonId)
      .slice(0, 4);
  }, [summary?.suggestedLessons, profile?.recommendedLessonIds]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">Bu đang tổng hợp kết quả học tập của em...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Chưa đăng nhập</h1>
          <p className="mt-3 text-slate-600">
            Em cần đăng nhập để xem kết quả học tập và tiến độ cá nhân hóa.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Kết quả học tập
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu đang theo dõi tiến bộ của em từng bước
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Tại đây, em có thể xem mức hiện tại, kết quả gần đây, phần kiến thức còn yếu
          và những gì Bu gợi ý em nên làm tiếp theo.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Mức hiện tại</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{buMeta.label}</p>
          <p className="mt-2 text-sm text-slate-600">{buMeta.shortDescription}</p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Số bài đã hoàn thành</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {summary?.completedLessonsCount ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Tính từ bài luyện tập và quick-test em đã làm tốt.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tổng thời gian Focus</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {summary?.totalFocusMinutes ?? 0} phút
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Nhịp học đều giúp Bu đánh giá tiến bộ rõ hơn.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Số kết quả gần đây</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {summary?.recentResults?.length ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Bu đang hiển thị các lần học và làm bài gần nhất của em.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Kết quả gần đây</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Hoạt động học tập mới nhất
          </h2>

          <div className="mt-6 grid gap-4">
            {summary?.recentResults?.length > 0 ? (
              summary.recentResults.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">{item.activityType}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-800">
                        {lessonsContent[item.lessonId as keyof typeof lessonsContent]?.title ||
                          item.lessonId}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {typeof item.accuracy === "number" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                          {item.accuracy}%
                        </span>
                      )}
                      {item.level && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                          {getBuLevelMeta(item.level).label}
                        </span>
                      )}
                    </div>
                  </div>

                  {typeof item.score === "number" && typeof item.totalQuestions === "number" && (
                    <p className="mt-3 text-sm text-slate-600">
                      Điểm: {item.score}/{item.totalQuestions}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-600">
                Em chưa có dữ liệu học tập gần đây. Hãy làm diagnostic, luyện tập hoặc quick-test nhé.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-emerald-600">Kết quả chẩn đoán</p>

            {latestDiagnostic ? (
              <>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Tỉ lệ đúng</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {Math.round(latestDiagnostic.correctRate)}%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Câu vận dụng đúng</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {latestDiagnostic.hardCorrect}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Mức Bu</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {getBuLevelMeta(latestDiagnostic.level).label}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-800">Bu nhận xét</p>
                  <p className="mt-2 text-slate-600">{latestDiagnostic.nextAction}</p>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-3xl bg-slate-50 p-5 text-slate-600">
                Em chưa có bài test chẩn đoán. Bu gợi ý em làm test đầu vào để nhận lộ trình học phù hợp.
              </div>
            )}
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Bu gợi ý tiếp theo</p>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Bài nên ưu tiên</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {suggestedLessonTitles.length > 0 ? (
                    suggestedLessonTitles.map((title) => <li key={title}>• {title}</li>)
                  ) : (
                    <li>• Bu chưa có đề xuất cụ thể, em hãy làm diagnostic trước nhé.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Phần cần chú ý</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {summary?.weakTopics?.length > 0 ? (
                    summary.weakTopics.map((topic: string) => <li key={topic}>• {topic}</li>)
                  ) : (
                    <li>• Chưa có phần yếu nổi bật. Hãy tiếp tục duy trì nhịp học tốt.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}