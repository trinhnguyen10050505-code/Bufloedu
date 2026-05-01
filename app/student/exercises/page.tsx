"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { getAllLessons, getLessonQuestionCount } from "@/lib/lesson-utils";
import ProgressCard from "@/components/student/ProgressCard";
import PracticeCard from "@/components/student/PracticeCard";

export default function StudentExercisesPage() {
  const { profile } = useCurrentUser();

  const currentLevel = profile?.currentLevel || "trungbinh";
  const buMeta = getBuLevelMeta(currentLevel);

  const lessons = useMemo(() => getAllLessons(), []);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Luyện tập cá nhân hóa
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu giúp em luyện đúng phần mình đang cần
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Tại đây em có thể làm bài đánh giá mức độ, luyện tập theo mức,
          luyện tập theo từng bài hoặc làm kiểm tra nhanh sau khi học xong.
        </p>

        <div className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
          Mức hiện tại: {buMeta.label}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <PracticeCard
          title="Đánh giá mức độ"
          description="Làm bài test đầu vào để Bu cập nhật mức học phù hợp."
          href="/student/diagnostic-test"
          cta="Làm test"
        />
        <PracticeCard
          title="Luyện theo mức"
          description="Ôn theo mức Bu hiện tại để học chắc dần từng bước."
          href="/student/exercises"
          cta="Xem mức hiện tại"
        />
        <PracticeCard
          title="Luyện theo bài"
          description="Đi vào từng bài cụ thể để luyện câu hỏi đúng phần đang học."
          href="/student/lessons"
          cta="Mở danh sách bài"
        />
        <PracticeCard
          title="Kiểm tra nhanh"
          description="Sau mỗi bài, làm quick-test để Bu kiểm tra độ chắc bài."
          href="/student/results"
          cta="Xem kết quả gần đây"
        />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <ProgressCard
          title="Mức hiện tại"
          value={buMeta.label}
          subtitle={buMeta.shortDescription}
        />
        <ProgressCard
          title="Hướng luyện phù hợp"
          value={
            currentLevel === "gioi"
              ? "Thông hiểu + Vận dụng"
              : currentLevel === "kha"
              ? "Thông hiểu + Vận dụng cơ bản"
              : "Nhận biết + Thông hiểu"
          }
          subtitle="Bu sẽ gợi ý bài tập theo đúng nhịp học hiện tại của em."
        />
        <ProgressCard
          title="Mục tiêu"
          value="Học chắc"
          subtitle="Bu ưu tiên học đúng phần còn yếu trước khi nâng độ khó."
        />
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Luyện theo bài</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">
          Chọn bài để bắt đầu luyện tập
        </h2>

        <div className="mt-6 grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.lessonId}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {lesson.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {lesson.summary}
                  </p>
                  <p className="mt-2 text-sm text-blue-600">
                    Số câu hỏi hiện có: {getLessonQuestionCount(lesson.lessonId)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/student/lessons/${lesson.lessonId}`}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Học bài
                  </Link>
                  <Link
                    href={`/student/lessons/${lesson.lessonId}/practice`}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Luyện tập
                  </Link>
                  <Link
                    href={`/student/lessons/${lesson.lessonId}/quick-test`}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Quick test
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}