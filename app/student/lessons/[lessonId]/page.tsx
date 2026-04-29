"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { lessonsContent } from "@/data/lessons-content";
import { questionBank } from "@/data/question-bank";
import ELearningBlock from "@/components/student/ELearningBlock";
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
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* HERO */}
          <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Bài học E-learning
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-3 max-w-3xl text-blue-50">{lesson.summary}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/student/lessons/${lessonId}/practice`}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Luyện tập bài này
              </Link>

              <Link
                href={`/student/lessons/${lessonId}/quick-test`}
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Kiểm tra nhanh
              </Link>
            </div>
          </section>

          {/* OBJECTIVES */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <section className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Mục tiêu bài học</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                Hôm nay em sẽ học được gì?
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                {lesson.objectives.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* E-LEARNING */}
          {lesson.elearning && (
            <ELearningBlock
              title={lesson.elearning.title}
              entry={lesson.elearning.entry}
              duration={lesson.elearning.duration}
              note={lesson.elearning.note}
            />
          )}

          {/* THEORY */}
          {lesson.theory?.map((block: any, i: number) => (
            <section key={i} className="rounded-[28px] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-blue-700">
                {block.title}
              </h2>

              {block.sections?.map((section: any, j: number) => (
                <div key={j} className="mb-5 last:mb-0">
                  <h3 className="font-semibold text-slate-800">
                    {section.subtitle}
                  </h3>

                  <p className="mt-1 text-slate-600">{section.content}</p>

                  {section.examples && (
                    <ul className="mt-2 list-disc pl-5 text-slate-500">
                      {section.examples.map((ex: string, k: number) => (
                        <li key={k}>{ex}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          ))}

          {/* RESOURCES */}
          {lesson.resources && lesson.resources.length > 0 && (
            <section className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Tài nguyên bài học</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                Tài liệu đi kèm
              </h2>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {lesson.resources.map((resource: any) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <p className="font-semibold text-slate-800">{resource.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Loại tài liệu: {resource.type}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ACTIONS */}
          <section className="grid gap-4 md:grid-cols-2">
            <Link
              href={`/student/lessons/${lessonId}/practice`}
              className="rounded-2xl bg-blue-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Luyện tập bài này ({questions.length} câu)
            </Link>

            <Link
              href={`/student/lessons/${lessonId}/quick-test`}
              className="rounded-2xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-emerald-700"
            >
              Kiểm tra nhanh
            </Link>
          </section>

          {/* MINI SUMMARY */}
          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">
              Bu nhắc em cần nhớ gì trong bài này?
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              <li>Nắm rõ khái niệm chính của bài</li>
              <li>Xem bài giảng E-learning trước rồi đọc lại lý thuyết</li>
              <li>Làm luyện tập và kiểm tra nhanh để Bu xem em đã chắc bài chưa</li>
            </ul>
          </section>
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