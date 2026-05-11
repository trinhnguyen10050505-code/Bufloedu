"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  getStudentLearningHistorySummary,
  StudentLearningHistorySummary,
} from "@/lib/student-history-reader";
import {
  getQuickTestLevelHistory,
  QuickTestLevelPoint,
} from "@/lib/level-history-reader";
import {
  AssignmentDoc,
  getAssignmentsForClass,
} from "@/lib/assignment-service";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import ProgressCard from "@/components/student/ProgressCard";
import PracticeCard from "@/components/student/PracticeCard";
import QueueCard from "@/components/student/QueueCard";
import GardenProgress from "@/components/student/GardenProgress";
import LevelTrendChart from "@/components/student/LevelTrendChart";

export default function StudentDashboardPage() {
  const { profile, loading } = useCurrentUser();

  const [summary, setSummary] =
    useState<StudentLearningHistorySummary | null>(null);
  const [levelHistory, setLevelHistory] = useState<QuickTestLevelPoint[]>([]);
  const [assignments, setAssignments] = useState<AssignmentDoc[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const lessons = useMemo(() => getPracticeLessons(), []);

  useEffect(() => {
    async function loadDashboard() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        const [historySummary, quickTestHistory, classAssignments] =
          await Promise.all([
            getStudentLearningHistorySummary(profile.uid),
            getQuickTestLevelHistory(profile.uid),
            profile.classCode
              ? getAssignmentsForClass(profile.classCode)
              : Promise.resolve([]),
          ]);

        setSummary(historySummary);
        setLevelHistory(quickTestHistory);
        setAssignments(classAssignments);
      } catch (error) {
        console.error("Lỗi tải dashboard học sinh:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void loadDashboard();
  }, [profile?.uid, profile?.classCode]);

  const currentLevel =
    summary?.currentLevel ?? profile?.currentLevel ?? "trungbinh";

  const buMeta = getBuLevelMeta(currentLevel);

  const weakLessonTitles = useMemo(() => {
    const weakLessonIds = summary?.weakLessonIds || profile?.weakLessonIds || [];

    return weakLessonIds
      .map((lessonId: string) => {
        const lesson = lessons.find((item) => item.lessonId === lessonId);
        return lesson?.lessonTitle || lessonId;
      })
      .slice(0, 3);
  }, [summary?.weakLessonIds, profile?.weakLessonIds, lessons]);

  const nextLesson = useMemo(() => {
    const histories = summary?.lessonHistories || [];

    const notViewed = histories.find((lesson) => !lesson.viewed);
    if (notViewed) return notViewed;

    const viewedButNotQuickTest = histories.find(
      (lesson) => lesson.viewed && !lesson.quickTestDone
    );
    if (viewedButNotQuickTest) return viewedButNotQuickTest;

    return histories[0];
  }, [summary?.lessonHistories]);

  const smartActions = useMemo(() => {
    const actions: string[] = [];

    if (!summary || summary.recentActivities.length === 0) {
      actions.push("Làm bài test chẩn đoán để Bu xác định mức học hiện tại.");
      actions.push("Bắt đầu học bài đầu tiên bằng E-learning và lý thuyết.");
      actions.push("Sau khi học xong, luyện một bộ câu mới để Bu hiểu em hơn.");
      return actions;
    }

    if (summary.weakLessonIds.length > 0) {
      actions.push("Ôn lại phần Bu phát hiện còn yếu bằng lý thuyết và mindmap.");
      actions.push("Luyện thêm một bộ câu mới ở bài đang vấp.");
    }

    if (nextLesson && nextLesson.viewed && !nextLesson.quickTestDone) {
      actions.push(
        "Nếu đã chắc bài vừa học, em có thể làm quick-test để cập nhật mức Bu."
      );
    }

    if ((summary.totalStudyMinutes || 0) < 20) {
      actions.push(
        "Vào Focus Room 15–25 phút để tăng thời gian học tập trung hôm nay."
      );
    }

    if (actions.length === 0) {
      actions.push("Tiếp tục học bài mới và giữ nhịp luyện tập đều mỗi ngày.");
      actions.push("Xem kết quả học tập để Bu điều chỉnh gợi ý cho em.");
    }

    return actions.slice(0, 4);
  }, [summary, nextLesson]);

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
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Khu học tập cá nhân hóa
        </p>

        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Chào {profile.fullName || "em"}, hôm nay Bu gợi ý em học gì?
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Bu theo dõi thời gian học, bài đã học, lượt luyện tập, quick-test và phần
          kiến thức còn yếu để gợi ý bước học tiếp theo.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
            {buMeta.label}
          </span>

          {profile.classCode ? (
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Mã lớp: {profile.classCode}
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              Học sinh tự do
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/student/diagnostic-test"
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Làm test chẩn đoán
          </Link>

          <Link
            href="/student/lessons"
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Vào học bài
          </Link>

          <Link
            href="/student/exercises"
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Luyện tập
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GardenProgress
          level={currentLevel}
          studyMinutes={summary?.totalStudyMinutes || 0}
          completedLessons={summary?.completedLessonsCount || 0}
          practiceTimes={summary?.totalPracticeTimes || 0}
          quickTests={summary?.totalQuickTests || 0}
        />

        <LevelTrendChart currentLevel={currentLevel} history={levelHistory} />
      </section>

      {profile.classCode ? (
        <section className="rounded-[30px] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Bài giáo viên giao
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                Nhiệm vụ của lớp {profile.classCode}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Chỉ học sinh thuộc lớp này mới nhìn thấy các nhiệm vụ giáo viên giao.
              </p>
            </div>

            <Link
              href="/student/assignments"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignments.length > 0 ? (
              assignments.slice(0, 3).map((assignment) => (
                <Link
                  key={assignment.id}
                  href="/student/assignments"
                  className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                    {assignment.type}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-slate-800">
                    {assignment.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {assignment.description}
                  </p>

                  {assignment.dueDate ? (
                    <p className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Hạn: {assignment.dueDate}
                    </p>
                  ) : null}
                </Link>
              ))
            ) : (
              <div className="rounded-[26px] bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                Chưa có bài mới từ giáo viên. Khi thầy/cô giao bài, Bu sẽ hiện ở đây.
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ProgressCard
          title="Mức hiện tại"
          value={buMeta.label}
          subtitle={buMeta.shortDescription}
        />

        <ProgressCard
          title="Bài đã hoàn thành"
          value={String(summary?.completedLessonsCount ?? 0)}
          subtitle="Bu tính từ quick-test và kết quả học tập đã lưu."
        />

        <ProgressCard
          title="Thời gian học"
          value={`${summary?.totalStudyMinutes ?? 0} phút`}
          subtitle="Tự động ghi nhận khi em học trong khu học sinh."
        />

        <ProgressCard
          title="Lượt luyện tập"
          value={String(summary?.totalPracticeTimes ?? 0)}
          subtitle="Practice có thể làm nhiều lần với bộ câu trộn mới."
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <QueueCard
          title="Bu gợi ý hôm nay"
          subtitle="Bu chọn gợi ý dựa trên lịch sử học gần nhất của em."
          icon="✨"
          tone="blue"
          items={smartActions}
          action={{
            label: "Vào luyện tập",
            href: "/student/exercises",
          }}
        />

        <QueueCard
          title="Phần cần chú ý"
          subtitle="Nếu có bài còn yếu, Bu sẽ dẫn em về đúng bài đó để ôn."
          icon="🧩"
          tone={weakLessonTitles.length > 0 ? "amber" : "emerald"}
          items={
            weakLessonTitles.length > 0
              ? weakLessonTitles.map((title) => `Ôn lại: ${title}`)
              : [
                  "Bu chưa thấy phần yếu nổi bật. Em hãy tiếp tục giữ nhịp học nhé.",
                ]
          }
          action={{
            label: weakLessonTitles.length > 0 ? "Ôn bằng mindmap" : "Xem kết quả",
            href: weakLessonTitles.length > 0 ? "/student/mindmap" : "/student/results",
          }}
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <PracticeCard
          title="Test chẩn đoán"
          description="Bu kiểm tra nền kiến thức để xác định mức Trung bình, Khá hoặc Giỏi."
          href="/student/diagnostic-test"
          cta="Làm test"
        />

        <PracticeCard
          title="Học bài"
          description="Vào E-learning, đọc lý thuyết và chuyển sang luyện tập theo bài."
          href="/student/lessons"
          cta="Vào học"
        />

        <PracticeCard
          title="Luyện tập"
          description="Luyện nhiều lần với câu hỏi xáo trộn theo bài, theo mức hoặc phần yếu."
          href="/student/exercises"
          cta="Vào luyện tập"
        />

        {profile.classCode ? (
          <PracticeCard
            title="Bài giáo viên giao"
            description={
              assignments.length > 0
                ? `Em có ${assignments.length} nhiệm vụ từ giáo viên.`
                : "Chưa có bài mới từ giáo viên của lớp em."
            }
            href="/student/assignments"
            cta="Xem bài giao"
          />
        ) : (
          <PracticeCard
            title="Mindmap"
            description="Ôn lại kiến thức bằng sơ đồ tư duy và ảnh minh họa theo từng bài."
            href="/student/mindmap"
            cta="Xem mindmap"
          />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Lộ trình gần nhất</p>

          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Bu đang đề xuất em đi theo hướng này
          </h2>

          <div className="mt-6 grid gap-4">
            {nextLesson ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white">
                    1
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {nextLesson.lessonTitle}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {nextLesson.viewed
                        ? "Em đã học bài này. Bu gợi ý luyện thêm hoặc làm quick-test nếu đã chắc."
                        : "Bu gợi ý em bắt đầu bài này bằng E-learning và lý thuyết."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/student/lessons/${nextLesson.lessonId}`}
                        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Học bài
                      </Link>

                      <Link
                        href={`/student/exercises?lessonId=${nextLesson.lessonId}&mode=by_lesson`}
                        className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Luyện bài này
                      </Link>

                      {!nextLesson.quickTestDone ? (
                        <Link
                          href={`/student/lessons/${nextLesson.lessonId}/quick-test`}
                          className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Quick-test
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-600">
                Bu chưa có dữ liệu lộ trình. Em hãy làm test chẩn đoán trước nhé.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-emerald-600">
              Hoạt động gần đây
            </p>

            <div className="mt-5 space-y-3">
              {summary?.recentActivities?.length ? (
                summary.recentActivities.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"
                  >
                    <p className="font-semibold">
                      {item.activityType} · {item.lessonId}
                    </p>

                    {typeof item.accuracy === "number" ? (
                      <p className="mt-1 text-slate-500">
                        Độ chính xác: {item.accuracy}%
                      </p>
                    ) : item.durationInSeconds ? (
                      <p className="mt-1 text-slate-500">
                        Thời gian: {Math.round(item.durationInSeconds / 60)} phút
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Chưa có hoạt động nào. Em hãy bắt đầu học bài hoặc luyện tập nhé.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Nhịp học hôm nay</p>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Học theo thứ tự: E-learning → lý thuyết → mindmap → luyện tập.</li>
              <li>• Nếu luyện sai nhiều, Bu sẽ dẫn em về đúng bài cần ôn.</li>
              <li>• Quick-test chỉ làm một lần cho mỗi bài để cập nhật mức học.</li>
              <li>• Vào Focus Room 15–25 phút để giữ nhịp tập trung.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}