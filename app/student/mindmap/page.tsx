"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getLocalMindmapByLessonId,
  localMindmapLessons,
} from "@/data/mindmap-local";

export default function MindmapPage() {
  const searchParams = useSearchParams();
  const defaultLessonId = searchParams.get("lessonId") || "lesson-1";

  const [selectedLessonId, setSelectedLessonId] = useState(defaultLessonId);

  const selectedLesson = useMemo(() => {
    return getLocalMindmapByLessonId(selectedLessonId) || localMindmapLessons[0];
  }, [selectedLessonId]);

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Mindmap theo từng bài
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Chọn bài để xem sơ đồ tư duy và ảnh minh họa
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Ảnh mindmap được lưu trực tiếp trong VS Code tại thư mục public/mindmaps.
          Em chỉ cần thay ảnh đúng tên lesson là giao diện tự cập nhật.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {localMindmapLessons.map((lesson) => (
          <button
            key={lesson.lessonId}
            onClick={() => setSelectedLessonId(lesson.lessonId)}
            className={`rounded-[26px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
              selectedLessonId === lesson.lessonId
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-sm font-semibold text-blue-600">
              Bài {lesson.lessonOrder}
            </p>

            <h2 className="mt-2 text-lg font-bold text-slate-800">
              {lesson.shortTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {lesson.description}
            </p>
          </button>
        ))}
      </section>

      <section className="rounded-[36px] bg-white p-6 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Bài {selectedLesson.lessonOrder}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {selectedLesson.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {selectedLesson.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedLesson.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/student/lessons/${selectedLesson.lessonId}`}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Ôn lý thuyết bài này
              </Link>

              <Link
                href={`/student/exercises?lessonId=${selectedLesson.lessonId}&mode=by_lesson`}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Luyện tập bài này
              </Link>
            </div>

            <div className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-700">Bu hướng dẫn</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Nếu em luyện tập sai nhiều ở bài này, hãy xem ảnh mindmap trước,
                đọc từng nhánh kiến thức, sau đó quay lại luyện thêm một bộ câu mới.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50">
            <div className="relative aspect-[4/3] w-full bg-white">
              <Image
                src={selectedLesson.imageUrl}
                alt={selectedLesson.title}
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">
                Ảnh đang lấy từ:
              </p>
              <code className="mt-2 block rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                {selectedLesson.imageUrl}
              </code>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">
          Các nhánh kiến thức chính
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-800">
          Bu tóm tắt bài này thành các mảnh kiến thức dễ nhớ
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {selectedLesson.nodes.map((node, index) => (
            <article
              key={`${selectedLesson.lessonId}-${node.title}`}
              className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white">
                {index + 1}
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {node.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {node.content}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] bg-gradient-to-r from-emerald-50 to-blue-50 p-6">
        <p className="text-sm font-semibold text-emerald-700">
          Cách thêm hoặc thay ảnh mindmap
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <p className="text-2xl">1️⃣</p>
            <h3 className="mt-3 font-bold text-slate-800">Chuẩn bị ảnh</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tạo ảnh PNG/JPG cho từng bài.
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <p className="text-2xl">2️⃣</p>
            <h3 className="mt-3 font-bold text-slate-800">Đưa vào VS Code</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Kéo ảnh vào thư mục public/mindmaps.
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <p className="text-2xl">3️⃣</p>
            <h3 className="mt-3 font-bold text-slate-800">Đặt đúng tên</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ví dụ: lesson-2.png, lesson-3.png, lesson-12.png.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}