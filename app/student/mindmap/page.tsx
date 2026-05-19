"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getLocalMindmapByLessonId,
  localMindmapLessons,
} from "@/data/mindmap-local";

export default function MindmapPage() {
  const searchParams = useSearchParams();
  const defaultLessonId = searchParams.get("lessonId") || "lesson-1";

  const [selectedLessonId, setSelectedLessonId] = useState(defaultLessonId);
  const imageSectionRef = useRef<HTMLDivElement | null>(null);

  const selectedLesson = useMemo(() => {
    return getLocalMindmapByLessonId(selectedLessonId) || localMindmapLessons[0];
  }, [selectedLessonId]);

  function chooseLesson(lessonId: string) {
    setSelectedLessonId(lessonId);

    window.setTimeout(() => {
      imageSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 overflow-hidden pb-8 lg:space-y-7 lg:pb-0">
      <section
        id="mindmap-hero"
        className="mobile-safe-section overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-5 py-6 text-white shadow-lg sm:rounded-[36px] sm:p-8"
      >
        <p className="text-caption-pro text-blue-100">Mindmap thông minh</p>

        <h1 className="text-hero-pro mt-4 max-w-5xl text-white">
          Chọn bài, Bu sẽ cuộn đến đúng ảnh mindmap để em ôn nhanh hơn
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
          Mỗi bài có ảnh mindmap riêng lưu trong VS Code. Khi em chọn bài, khung
          ảnh sẽ tự cuộn mượt để em nhìn rõ nội dung.
        </p>
      </section>

      <section className="mobile-safe-section rounded-[26px] bg-white p-4 shadow-sm sm:rounded-[34px] sm:p-5">
        <div className="flex gap-3 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch] sm:gap-4">
          {localMindmapLessons.map((lesson) => (
            <button
              key={lesson.lessonId}
              id={`mindmap-tab-${lesson.lessonId}`}
              onClick={() => chooseLesson(lesson.lessonId)}
              className={`min-w-[210px] max-w-[230px] shrink-0 rounded-[22px] border p-4 text-left transition hover:-translate-y-1 hover:shadow-md sm:min-w-[230px] sm:rounded-[26px] sm:p-5 ${
                selectedLessonId === lesson.lessonId
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600 sm:text-sm">
                Bài {lesson.lessonOrder}
              </p>

              <h2 className="mt-2 line-clamp-2 text-base font-black leading-snug text-slate-800 sm:text-lg">
                {lesson.shortTitle}
              </h2>

              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                {lesson.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section
        id={`mindmap-${selectedLesson.lessonId}`}
        ref={imageSectionRef}
        className="mobile-safe-section rounded-[28px] bg-white p-4 shadow-sm sm:rounded-[38px] sm:p-6"
      >
        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
          <div className="min-w-0">
            <p className="text-sm font-bold text-blue-600">
              Bài {selectedLesson.lessonOrder}
            </p>

            <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {selectedLesson.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
              {selectedLesson.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedLesson.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href={`/student/lessons/${selectedLesson.lessonId}`}
                className="btn-pro bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
              >
                Ôn lý thuyết bài này
              </Link>

              <Link
                href={`/student/exercises?lessonId=${selectedLesson.lessonId}&mode=by_lesson`}
                className="btn-pro bg-slate-100 text-slate-700 hover:bg-slate-200 sm:w-auto"
              >
                Luyện tập bài này
              </Link>
            </div>

            <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-4 sm:rounded-[28px] sm:p-5">
              <p className="text-lg font-black text-amber-700 sm:text-xl">
                Bu hướng dẫn
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
                Nếu em luyện tập sai nhiều ở bài này, hãy xem ảnh mindmap trước,
                đọc từng nhánh kiến thức, sau đó quay lại luyện thêm một bộ câu mới.
              </p>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50 shadow-inner sm:rounded-[34px]">
            <div className="relative h-[360px] w-full bg-white sm:h-[520px] xl:h-[620px]">
              <Image
                src={selectedLesson.imageUrl}
                alt={selectedLesson.title}
                fill
                className="object-contain p-3 sm:p-5"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 850px"
              />
            </div>

            <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                Ảnh đang lấy từ:
              </p>

              <code className="mt-2 block overflow-x-auto rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-700 sm:px-4 sm:py-3 sm:text-sm">
                {selectedLesson.imageUrl}
              </code>
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-safe-section rounded-[28px] bg-white p-4 shadow-sm sm:rounded-[38px] sm:p-6">
        <p className="text-sm font-bold text-blue-600">
          Các nhánh kiến thức chính
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
          Bu tóm tắt bài này thành các mảnh kiến thức dễ nhớ
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {selectedLesson.nodes.map((node, index) => (
            <article
              key={`${selectedLesson.lessonId}-${node.title}`}
              id={`mindmap-node-${selectedLesson.lessonId}-${index + 1}`}
              className="mobile-safe-section rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:rounded-[26px] sm:p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white sm:h-11 sm:w-11 sm:text-base">
                {index + 1}
              </div>

              <h3 className="mt-4 text-base font-black leading-snug text-slate-800 sm:text-lg">
                {node.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                {node.content}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}