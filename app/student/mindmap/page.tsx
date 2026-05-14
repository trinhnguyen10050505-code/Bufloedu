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
        block: "center",
      });
    }, 80);
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
          Mindmap thông minh
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight">
          Chọn bài, Bu sẽ cuộn đến đúng ảnh mindmap để em ôn nhanh hơn
        </h1>
        <p className="mt-4 max-w-3xl leading-8 text-blue-50">
          Mỗi bài có ảnh mindmap riêng lưu trong VS Code. Khi em chọn bài, khung ảnh
          sẽ tự cuộn mượt để em nhìn rõ nội dung.
        </p>
      </section>

      <section className="rounded-[34px] bg-white p-5 shadow-sm">
        <div className="flex gap-4 overflow-x-auto pb-3">
          {localMindmapLessons.map((lesson) => (
            <button
              key={lesson.lessonId}
              onClick={() => chooseLesson(lesson.lessonId)}
              className={`min-w-[230px] rounded-[26px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
                selectedLessonId === lesson.lessonId
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-sm font-bold text-blue-600">
                Bài {lesson.lessonOrder}
              </p>
              <h2 className="mt-2 text-lg font-black text-slate-800">
                {lesson.shortTitle}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {lesson.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section
        ref={imageSectionRef}
        className="rounded-[38px] bg-white p-6 shadow-sm"
      >
        <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
          <div>
            <p className="text-sm font-bold text-blue-600">
              Bài {selectedLesson.lessonOrder}
            </p>

            <h2 className="mt-2 text-4xl font-black leading-tight text-slate-900">
              {selectedLesson.title}
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              {selectedLesson.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedLesson.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/student/lessons/${selectedLesson.lessonId}`}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                Ôn lý thuyết bài này
              </Link>

              <Link
                href={`/student/exercises?lessonId=${selectedLesson.lessonId}&mode=by_lesson`}
                className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 hover:bg-slate-200"
              >
                Luyện tập bài này
              </Link>
            </div>

            <div className="mt-7 rounded-[28px] border border-amber-200 bg-amber-50 p-5">
              <p className="text-xl font-black text-amber-700">Bu hướng dẫn</p>
              <p className="mt-3 text-base leading-8 text-slate-700">
                Nếu em luyện tập sai nhiều ở bài này, hãy xem ảnh mindmap trước,
                đọc từng nhánh kiến thức, sau đó quay lại luyện thêm một bộ câu mới.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-slate-200 bg-slate-50 shadow-inner">
            <div className="relative min-h-[560px] w-full bg-white xl:min-h-[620px]">
              <Image
                src={selectedLesson.imageUrl}
                alt={selectedLesson.title}
                fill
                className="object-contain p-5"
                priority
              />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Ảnh đang lấy từ:</p>
              <code className="mt-2 block rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                {selectedLesson.imageUrl}
              </code>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[38px] bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-blue-600">
          Các nhánh kiến thức chính
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">
          Bu tóm tắt bài này thành các mảnh kiến thức dễ nhớ
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {selectedLesson.nodes.map((node, index) => (
            <article
              key={`${selectedLesson.lessonId}-${node.title}`}
              className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-black text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-800">
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