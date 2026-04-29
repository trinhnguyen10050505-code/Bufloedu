"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { lessonsContent } from "@/data/lessons-content";
import { questionBank } from "@/data/question-bank";
import BuChatWidget from "@/components/student/BuChatWidget";

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.lessonId as keyof typeof lessonsContent;
  const lesson = lessonsContent[lessonId];
  const questions = questionBank.filter((q) => q.lessonId === lessonId);

  if (!lesson) {
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy bài học
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* HEADER */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow">
            <p className="text-sm text-blue-100">Bài học</p>
            <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
            <p className="mt-2 text-blue-100">
              Bu sẽ đồng hành cùng em qua phần lý thuyết, luyện tập và kiểm tra nhanh.
            </p>
          </div>

          {/* THEORY */}
          {lesson.theory.map((block, i) => (
            <div key={i} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-blue-700">{block.title}</h2>

              {block.sections.map((section, j) => (
                <div key={j} className="mb-5">
                  <h3 className="font-semibold text-slate-800">{section.subtitle}</h3>

                  <p className="mt-1 text-slate-600">{section.content}</p>

                  {'examples' in section && section.examples && (
                    <ul className="mt-2 list-disc pl-5 text-slate-500">
                      {section.examples.map((ex: string, k: number) => (
                        <li key={k}>{ex}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* ACTION */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href={`/student/lessons/${lessonId}/practice`}
              className="rounded-2xl bg-blue-600 px-6 py-4 text-center font-semibold text-white hover:bg-blue-700"
            >
              Luyện tập bài này ({questions.length} câu)
            </Link>

            <Link
              href={`/student/lessons/${lessonId}/quick-test`}
              className="rounded-2xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white hover:bg-emerald-700"
            >
              Kiểm tra nhanh
            </Link>
          </div>

          {/* MINI SUMMARY */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">
              Bu nhắc em cần nhớ gì trong bài này?
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              <li>Nắm rõ khái niệm chính của bài</li>
              <li>Phân biệt các hiện tượng dễ nhầm</li>
              <li>Biết nhận dạng dạng bài thường gặp</li>
            </ul>
          </div>
        </div>
      </div>

      <BuChatWidget
        lessonTitle={lesson.title}
        currentLevelLabel="Bu Thông minh"
        weakTopics={[lesson.title]}
      />
    </>
  );
}