"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ClipboardList, Target } from "lucide-react";
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

import StudentHeroLevelChart from "@/components/student/StudentHeroLevelChart";
import StudentGardenWide from "@/components/student/StudentGardenWide";
import QueueCard from "@/components/student/QueueCard";
import PracticeCard from "@/components/student/PracticeCard";

export default function StudentDashboardPage() {
  const { profile, loading } = useCurrentUser();

  const [summary, setSummary] =
    useState<StudentLearningHistorySummary | null>(null);
  const [levelHistory, setLevelHistory] = useState<QuickTestLevelPoint[]>([]);
  const [assignments, setAssignments] = useState<AssignmentDoc[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        const [historySummary, quickHistory, classAssignments] =
          await Promise.all([
            getStudentLearningHistorySummary(profile.uid),
            getQuickTestLevelHistory(profile.uid),
            profile.classCode
              ? getAssignmentsForClass(profile.classCode)
              : Promise.resolve([]),
          ]);

        setSummary(historySummary);
        setLevelHistory(quickHistory);
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

  const smartActions = useMemo(() => {
    const actions: string[] = [];

    if (!summary || summary.recentActivities.length === 0) {
      return [
        "Làm bài test chẩn đoán để Bu xác định mức học hiện tại.",
        "Bắt đầu học bài bằng E-learning và lý thuyết.",
        "Sau khi học xong, luyện một bộ câu mới để Bu hiểu em hơn.",
      ];
    }

    if (summary.weakLessonIds.length > 0) {
      actions.push("Ôn lại phần Bu phát hiện còn yếu bằng lý thuyết và mindmap.");
      actions.push("Luyện thêm một bộ câu mới ở bài đang vấp.");
    }

    if ((summary.totalStudyMinutes || 0) < 20) {
      actions.push("Vào Focus Room 15–25 phút để tăng hiệu quả học tập.");
    }

    if (actions.length === 0) {
      actions.push("Tiếp tục học bài mới và giữ nhịp luyện tập đều mỗi ngày.");
      actions.push("Xem kết quả học tập để Bu điều chỉnh gợi ý cho em.");
    }

    return actions.slice(0, 4);
  }, [summary]);

  const weakItems = useMemo(() => {
    const weak = summary?.weakLessonIds || profile?.weakLessonIds || [];

    if (weak.length === 0) {
      return ["Bu chưa thấy phần yếu nổi bật. Em hãy tiếp tục giữ nhịp học nhé."];
    }

    return weak.slice(0, 3).map((lessonId: string) => `Ôn lại: ${lessonId}`);
  }, [summary?.weakLessonIds, profile?.weakLessonIds]);

  if (loading || pageLoading) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <p className="text-slate-600">Bu đang tải khu học tập của em...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Chưa đăng nhập</h1>
        <p className="mt-3 text-slate-600">
          Em cần đăng nhập để Bu cá nhân hóa lộ trình học.
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
    <div className="mx-auto w-full max-w-[1500px] space-y-6 overflow-hidden">
      <section className="relative w-full overflow-hidden rounded-[34px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-7 py-7 text-white shadow-[0_18px_45px_rgba(37,99,235,0.25)]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="pointer-events-none absolute left-10 top-20 text-xl text-white/70">✦</div>
        <div className="pointer-events-none absolute left-40 top-28 text-lg text-white/70">✦</div>
        <div className="pointer-events-none absolute left-[44%] top-12 text-2xl text-white/70">✦</div>

        <div className="relative grid min-h-[340px] w-full grid-cols-1 gap-7 xl:grid-cols-[230px_minmax(0,1fr)_430px] 2xl:grid-cols-[260px_minmax(0,1fr)_500px] xl:items-center">
          <div className="hidden xl:flex xl:items-end xl:justify-center">
            <div className="relative h-[300px] w-[230px] 2xl:h-[325px] 2xl:w-[250px]">
              <Image
                src="/bu-macost.png"
                alt="Bu"
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-caption-pro text-blue-100">
              Khu học tập cá nhân hóa
            </p>

            <h1 className="text-hero-pro mt-4 max-w-[740px] text-white">
              Chào {profile.fullName || "em"}, hôm nay Bu gợi ý em học gì?
            </h1>

            <p className="text-body-pro mt-4 max-w-[720px] text-blue-50">
              Bu theo dõi thời gian học, bài đã học, lượt luyện tập, quick-test
              và phần kiến thức còn yếu để gợi ý bước học tiếp theo cho em.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                ⭐ {buMeta.label}
              </span>

              {profile.classCode ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                  🏫 Lớp {profile.classCode}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                  🎓 Học sinh tự do
                </span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/student/diagnostic-test"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-sm transition hover:bg-blue-700"
              >
                <ClipboardList size={19}/>

                Làm test chẩn đoán
              </Link>

              <Link
                href="/student/lessons"
                className="btn-pro border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Vào học bài
              </Link>

              <Link
                href="/student/exercises"
                className="btn-pro border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Luyện tập
              </Link>
            </div>
          </div>

          <div className="min-w-0 xl:max-w-[430px] 2xl:max-w-[500px]">
            <StudentHeroLevelChart
              currentLevel={currentLevel}
              history={levelHistory}
            />
          </div>
        </div>
      </section>

      <StudentGardenWide
        level={currentLevel}
        studyMinutes={summary?.totalStudyMinutes || 0}
        completedLessons={summary?.completedLessonsCount || 0}
        practiceTimes={summary?.totalPracticeTimes || 0}
        quickTests={summary?.totalQuickTests || 0}
        averageAccuracy={summary?.averageAccuracy || 0}
      />

      {profile.classCode ? (
        <section className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">Bài giáo viên giao</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                Nhiệm vụ của lớp {profile.classCode}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Chỉ học sinh thuộc lớp này mới nhìn thấy nhiệm vụ giáo viên giao.
              </p>
            </div>

            <Link
              href="/student/assignments"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
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
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    {assignment.type}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-800">
                    {assignment.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {assignment.description}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-[26px] bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                Chưa có bài mới từ giáo viên.
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-2">
        <QueueCard
          title="Bu gợi ý hôm nay"
          subtitle="Bu chọn gợi ý dựa trên lịch sử học gần nhất của em."
          icon="✨"
          tone="blue"
          items={smartActions}
          action={{ label: "Vào luyện tập", href: "/student/exercises" }}
        />

        <QueueCard
          title="Phần cần chú ý"
          subtitle="Nếu có bài còn yếu, Bu sẽ dẫn em về đúng bài đó để ôn."
          icon="🧩"
          tone={weakItems.length > 1 ? "amber" : "emerald"}
          items={weakItems}
          action={{
            label: weakItems.length > 1 ? "Ôn ngay với mindmap" : "Xem kết quả",
            href: weakItems.length > 1 ? "/student/mindmap" : "/student/results",
          }}
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
        <PracticeCard
          title="Focus Room"
          description="Tập trung học theo phiên ngắn, có thống kê thời gian."
          href="/student/focus-room"
          cta="Bắt đầu focus"
        />
        <PracticeCard
          title="Mindmap"
          description="Ôn lại kiến thức bằng sơ đồ tư duy và ảnh minh họa theo từng bài."
          href="/student/mindmap"
          cta="Xem mindmap"
        />
      </section>
    </div>
  );
}