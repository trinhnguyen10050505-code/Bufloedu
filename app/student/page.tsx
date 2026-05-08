"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  getDashboardProgressSummary,
  getLatestDiagnosticResult,
} from "@/lib/practice-reader";
import { lessonsContent } from "@/data/lessons-content";
import ProgressCard from "@/components/student/ProgressCard";
import PracticeCard from "@/components/student/PracticeCard";
import QueueCard from "@/components/student/QueueCard";

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
  }, [profile?.uid, profile?.currentLevel]);

  const currentLevel =
    summary?.currentLevel ??
    latestDiagnostic?.level ??
    profile?.currentLevel ??
    "trungbinh";

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

  const suggestedActions =
    summary?.suggestedActions ||
    (profile?.nextAction ? [profile.nextAction] : []);

  const weakTopics = summary?.weakTopics || [];

  if (loading || pageLoading) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <p className="text-slate-600">Bu đang tải dữ liệu học tập của em...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
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

        <div className="mt-5">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
            {buMeta.label}
          </span>
        </div>

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
        <ProgressCard
          title="Mức hiện tại"
          value={buMeta.label}
          subtitle={buMeta.shortDescription}
        />
        <ProgressCard
          title="Số bài đã hoàn thành"
          value={String(summary?.completedLessonsCount ?? 0)}
          subtitle="Bu tính từ bài luyện tập và quick-test em đã làm tốt."
        />
        <ProgressCard
          title="Thời gian Focus"
          value={`${summary?.totalFocusMinutes ?? 0} phút`}
          subtitle="Giữ nhịp học đều sẽ giúp em tiến bộ nhanh và chắc hơn."
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <QueueCard
          title="Bu gợi ý hôm nay"
          items={
            suggestedActions.length > 0
              ? suggestedActions
              : ["Làm bài test chẩn đoán để Bu hiểu rõ em hơn."]
          }
        />

        <QueueCard
          title="Phần cần chú ý"
          items={
            weakTopics.length > 0
              ? weakTopics
              : ["Bu chưa thấy phần yếu nổi bật nào, em hãy tiếp tục giữ nhịp học nhé."]
          }
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <PracticeCard
          title="Đánh giá mức độ"
          description="Làm bài test để Bu cập nhật mức học và gợi ý lộ trình phù hợp."
          href="/student/diagnostic-test"
          cta="Làm test"
        />
        <PracticeCard
          title="Luyện tập"
          description="Luyện theo bài và theo mức để học chắc phần Bu đang gợi ý."
          href="/student/exercises"
          cta="Vào luyện tập"
        />
        <PracticeCard
          title="Focus Room"
          description="Học tập trung theo phiên ngắn để duy trì nhịp học ổn định."
          href="/student/focus-room"
          cta="Bắt đầu focus"
        />
        <PracticeCard
          title="Kết quả học tập"
          description="Xem tiến bộ, kết quả gần đây và phần kiến thức còn cần củng cố."
          href="/student/results"
          cta="Xem kết quả"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Bài nên ưu tiên</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Lộ trình Bu đang gợi ý cho em
          </h2>

          <div className="mt-6 grid gap-4">
            {suggestedLessonTitles.length > 0 ? (
              suggestedLessonTitles.map((title, index) => (
                <div
                  key={title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Bu gợi ý em ưu tiên bài này để củng cố phần còn yếu hoặc tiếp tục nâng mức.
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-600">
                Bu chưa có lộ trình cụ thể. Hãy làm bài test chẩn đoán trước nhé.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
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
                Em chưa có dữ liệu chẩn đoán. Bu gợi ý em làm bài test đầu vào trước để nhận lộ trình học phù hợp.
              </div>
            )}
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Nhịp học hôm nay</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Học theo thứ tự: lý thuyết → luyện tập → quick-test.</li>
              <li>• Dành thêm 15 đến 25 phút trong Focus Room để giữ tập trung.</li>
              <li>• Sau mỗi bài, quay lại xem kết quả để Bu điều chỉnh gợi ý cho em.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}