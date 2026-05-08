"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getLessonCatalogItem } from "@/data/lesson-catalog";
import ElearningFrame from "@/components/student/ElearningFrame";
import { getLessonPracticeStats } from "@/lib/lesson-practice-data";

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const lesson = getLessonCatalogItem(lessonId);
  const stats = getLessonPracticeStats(lessonId);

  if (!lesson) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <p className="text-red-500">Không tìm thấy bài học.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Bài {lesson.order}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-4 max-w-3xl text-blue-50">{lesson.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/student/exercises?lessonId=${lesson.id}&mode=by_lesson`}
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Luyện bài này
          </Link>
          <Link
            href={`/student/exercises?lessonId=${lesson.id}&mode=quick_review`}
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
          >
            Kiểm tra nhanh
          </Link>
          <Link
            href={`/student/mindmap?lessonId=${lesson.id}`}
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
          >
            Xem mindmap
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ElearningFrame
          title={`E-learning - ${lesson.shortTitle}`}
          src={lesson.elearningUrl}
          fallbackSrc={lesson.localEntry}
        />

        <aside className="space-y-5">
          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">
              Thẻ củng cố bài học
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-800">
              Sau khi xem video, Bu gợi ý
            </h2>

            <div className="mt-5 space-y-3">
              <Link
                href={`/student/focus-room?lessonId=${lesson.id}`}
                className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                ⏱️ Vào Focus Room để học tập trung bài này
              </Link>
              <Link
                href={`/student/exercises?lessonId=${lesson.id}&mode=by_lesson`}
                className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                ✍️ Luyện tập theo từng phần của bài
              </Link>
              <Link
                href={`/student/exercises?lessonId=${lesson.id}&mode=quick_review`}
                className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                ⚡ Làm kiểm tra nhanh
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-emerald-600">
              Kho câu hỏi bài này
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Tổng câu</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Nhận biết</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {stats.nhanbiet}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Thông hiểu</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {stats.thonghieu}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Vận dụng</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {stats.vandung}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}