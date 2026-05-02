"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { lessonsContent } from "@/data/lessons-content";
import { getQuestionsByLesson } from "@/lib/lesson-utils";
import { getElearningByLessonId } from "@/lib/elearning";
import ElearningFrame from "@/components/student/ElearningFrame";

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const lesson = lessonsContent[lessonId as keyof typeof lessonsContent];
  const questions = getQuestionsByLesson(lessonId);
  const elearning = getElearningByLessonId(lessonId);

  if (!lesson) {
    return <div className="p-10 text-red-500">Không tìm thấy bài học</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Bài học
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{lesson.title}</h1>
        <p className="mt-3 max-w-3xl text-blue-50">{lesson.summary}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/student/lessons/${lessonId}/practice`}
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Luyện tập
          </Link>
          <Link
            href={`/student/lessons/${lessonId}/quick-test`}
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
          >
            Quick test
          </Link>
        </div>
      </section>

      <ElearningFrame
        title={elearning.title}
        mode={elearning.mode}
        entry={elearning.entry}
        externalUrl={elearning.externalUrl}
        note={elearning.note}
      />

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Thông tin bài học</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Tổng câu hỏi</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">{questions.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Mục tiêu</p>
            <p className="mt-2 text-slate-700">Hiểu bài, nhớ bài, luyện đúng phần cần học</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Khuyến nghị</p>
            <p className="mt-2 text-slate-700">Xem E-learning trước rồi mới sang luyện tập</p>
          </div>
        </div>
      </section>
    </div>
  );
}