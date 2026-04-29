"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { getDashboardProgressSummary, getLatestDiagnosticResult } from "@/lib/progress-reader";
import { lessonsContent } from "@/data/lessons-content";

export default function StudentDashboardPage() {
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
        const [diagnostic, progressSummary] = await Promise.all([
          getLatestDiagnosticResult(profile.uid),
          getDashboardProgressSummary(profile.uid),
        ]);

        setLatestDiagnostic(diagnostic);
        setSummary(progressSummary);
      } catch (error) {
        console.error("Lỗi tải dashboard học sinh:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid]);

  const currentLevel = summary?.currentLevel || profile?.currentLevel || "trungbinh";
  const buMeta = getBuLevelMeta(currentLevel);

  const suggestedLessonTitles = useMemo(() => {
    const lessonIds: string[] =
      summary?.suggestedLessons ||
      profile?.recommendedLessonIds ||
      [];

    return lessonIds
      .map((lessonId) => lessonsContent[lessonId as keyof typeof lessonsContent]?.title || lessonId)
      .slice(0, 3);
  }, [summary?.suggestedLessons, profile?.recommendedLessonIds]);

  const suggestedActions = summary?.suggestedActions || (profile?.nextAction ? [profile.nextAction] : []);
  const weakTopics = summary?.weakTopics || [];

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">Bu đang tải dữ liệu học tập của em...</p>
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
            Bu chưa nhận ra em. Hãy đăng nhập để xem dashboard học tập cá nhân hóa nhé.
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
        <p className="text-sm font-medium text-blue-100">Khu học tập cá nhân hóa</p>
        <h1 className="mt-2 text-4xl font-bold">
          Chào {profile.fullName}, hôm nay Bu gợi ý em học gì?
        </h1>
        <p className="mt-3 max-w-2xl text-blue-50">
          Bu sẽ giúp em học đúng mức độ, luyện đúng phần còn yếu và theo dõi tiến bộ rõ ràng
          sau từng lần học, luyện tập và kiểm tra nhanh.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/student/diagnostic-test"
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Làm bài test chẩn đoán
          </Link>
          <Link
            href="/student/exercises"
            className="rounded-2xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Bắt đầu luyện tập
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
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
            Bu đang tính dựa trên dữ liệu luyện tập và kiểm tra nhanh của em.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Thời gian Focus</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {summary?.totalFocusMinutes ?? 0} phút
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Học đều mỗi ngày sẽ giúp em nâng mức nhanh và chắc hơn.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Bu gợi ý hôm nay</p>

          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Hành động nên làm</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {suggestedActions.length > 0 ? (
                  suggestedActions.map((action: string) => (
                    <li key={action}>• {action}</li>
                  ))
                ) : (
                  <li>• Làm bài test chẩn đoán để Bu hiểu rõ em hơn.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Bài nên ưu tiên</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {suggestedLessonTitles.length > 0 ? (
                  suggestedLessonTitles.map((title) => <li key={title}>• {title}</li>)
                ) : (
                  <li>• Phản ứng hóa học</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Phần cần chú ý</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {weakTopics.length > 0 ? (
                  weakTopics.map((topic: string) => <li key={topic}>• {topic}</li>)
                ) : (
                  <li>• Bu chưa thấy phần yếu nổi bật nào, em hãy tiếp tục giữ nhịp học nhé.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Kết quả chẩn đoán gần nhất</p>

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
                  <p className="text-sm text-slate-500">Mức của Bu</p>
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
            <div className="mt-4 rounded-3xl bg-slate-50 p-5">
              <p className="text-slate-600">
                Em chưa có dữ liệu chẩn đoán. Bu gợi ý em làm bài test đầu vào trước
                để nhận lộ trình học phù hợp.
              </p>
              <Link
                href="/student/diagnostic-test"
                className="mt-4 inline-flex rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Làm test ngay
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/student/diagnostic-test"
          className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
            🧪
          </div>
          <h2 className="text-xl font-bold text-slate-800">Đánh giá mức độ</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Làm bài test để Bu cập nhật mức học và gợi ý lộ trình phù hợp.
          </p>
        </Link>

        <Link
          href="/student/exercises"
          className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
            ✍️
          </div>
          <h2 className="text-xl font-bold text-slate-800">Luyện tập</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Luyện theo bài và theo mức để học chắc phần Bu đang gợi ý.
          </p>
        </Link>

        <Link
          href="/student/focus-room"
          className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
            ⏱️
          </div>
          <h2 className="text-xl font-bold text-slate-800">Focus Room</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Học tập trung theo phiên ngắn để duy trì nhịp học ổn định.
          </p>
        </Link>

        <Link
          href="/student/results"
          className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-700">
            📊
          </div>
          <h2 className="text-xl font-bold text-slate-800">Kết quả học tập</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Xem tiến bộ, kết quả gần đây và phần kiến thức còn cần củng cố.
          </p>
        </Link>
      </section>
    </div>
  );
}