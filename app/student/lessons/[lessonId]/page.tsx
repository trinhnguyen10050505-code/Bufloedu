"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  FileQuestion,
  Flame,
  Layers,
  Target,
  Zap,
} from "lucide-react";

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
        <p className="font-semibold text-red-500">Không tìm thấy bài học.</p>
        <Link
          href="/student/lessons"
          className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
        >
          Quay lại danh sách bài học
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-8 overflow-hidden pb-8">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-5 py-7 text-white shadow-lg sm:rounded-[40px] sm:p-8">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
            Bài {lesson.order}
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
            {lesson.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/student/exercises?lessonId=${lesson.id}&mode=by_lesson`}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue px-5 py-3 font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <BookOpen size={18} />
              Luyện bài này
            </Link>

            <Link
              href={`/student/lessons/${lesson.id}/quick-test`}
              className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
            >
              <Zap size={18} />
              Kiểm tra nhanh
            </Link>

            <Link
              href={`/student/mindmap?lessonId=${lesson.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/20"
            >
              <Brain size={18} />
              Xem mindmap
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-bold text-blue-100">Bước 1</p>
              <p className="mt-1 font-black text-white">Xem bài giảng</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-bold text-blue-100">Bước 2</p>
              <p className="mt-1 font-black text-white">Luyện theo bài</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-bold text-blue-100">Bước 3</p>
              <p className="mt-1 font-black text-white">Quick-test</p>
            </div>
          </div>
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
            <p className="text-sm font-black text-blue-600">
              Thẻ củng cố bài học
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Sau khi xem video, Bu gợi ý
            </h2>

            <div className="mt-5 space-y-3">
              <Link
                href={`/student/focus-room?lessonId=${lesson.id}`}
                className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <Clock size={18} className="text-purple-500" />
                  Vào Focus Room để học tập trung bài này
                </span>
                <ArrowRight size={17} className="opacity-0 transition group-hover:opacity-100" />
              </Link>

              <Link
                href={`/student/exercises?lessonId=${lesson.id}&mode=by_lesson`}
                className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <Target size={18} className="text-amber-500" />
                  Luyện tập theo đúng bài này
                </span>
                <ArrowRight size={17} className="opacity-0 transition group-hover:opacity-100" />
              </Link>

              <Link
                href={`/student/lessons/${lesson.id}/quick-test`}
                className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <Flame size={18} className="text-red-500" />
                  Làm quick-test riêng của bài này
                </span>
                <ArrowRight size={17} className="opacity-0 transition group-hover:opacity-100" />
              </Link>

              <Link
                href={`/student/mindmap?lessonId=${lesson.id}`}
                className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <Brain size={18} className="text-pink-500" />
                  Ôn lại bằng mindmap
                </span>
                <ArrowRight size={17} className="opacity-0 transition group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-emerald-600">
              Kho câu hỏi bài này
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-900">
              Cấu trúc câu hỏi theo mức độ
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bu dùng các mức này để luyện từ dễ đến khó, đúng logic sư phạm.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <FileQuestion size={20} className="text-blue-600" />
                  <p className="text-sm font-bold text-slate-500">Tổng câu</p>
                </div>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stats.total}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-sm font-bold text-sky-700">Nhận biết</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.nhanbiet}
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm font-bold text-blue-700">Thông hiểu</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.thonghieu}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-bold text-amber-700">Vận dụng</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.vandung}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Layers size={21} className="text-blue-600" />
              </div>

              <div>
                <p className="font-black text-blue-700">Lộ trình đúng bài</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Học sinh xem video trước, luyện đúng bài, sau đó làm
                  quick-test riêng của bài này để Bu cập nhật mức học chính xác.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <CheckCircle2 size={21} className="text-emerald-600" />
              </div>

              <div>
                <p className="font-black text-emerald-700">Đúng định hướng</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Nút “Kiểm tra nhanh” không đi sang luyện tập chung nữa, mà mở
                  quick-test của chính bài đang học.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}