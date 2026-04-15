"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getLessonById,
  getQuestionsByLesson,
} from "@/lib/lesson-utils";

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const lesson = getLessonById(lessonId);
  const questions = getQuestionsByLesson(lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Không tìm thấy bài học</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-medium text-blue-600">Bài học</p>
          <h1 className="text-3xl font-bold text-slate-800">{lesson.title}</h1>
          <p className="mt-3 text-slate-600">
            Bài này hiện có {questions.length} câu hỏi luyện tập.
          </p>
        </div>

        {lesson.theory.map((block, blockIndex) => (
          <div key={blockIndex} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-800">{block.title}</h2>

            <div className="space-y-5">
              {block.sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-800">
                    {section.subtitle}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">{section.content}</p>

                  {section.examples && section.examples.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 font-medium text-slate-700">Ví dụ:</p>
                      <ul className="list-disc space-y-1 pl-5 text-slate-600">
                        {section.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href={`/student/lessons/${lessonId}/practice`}
            className="rounded-2xl bg-blue-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Luyện tập bài này
          </Link>

          <Link
            href={`/student/lessons/${lessonId}/quick-test`}
            className="rounded-2xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-emerald-700"
          >
            Kiểm tra nhanh
          </Link>
        </div>
      </div>
    </div>
  );
}