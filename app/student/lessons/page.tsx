import Link from "next/link";
import { lessonCatalog } from "@/data/lesson-catalog";

export default function StudentLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 overflow-hidden pb-6 lg:space-y-8 lg:pb-0">
      <section
        id="student-lessons-hero"
        className="mobile-safe-section overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-5 py-6 text-white shadow-lg sm:rounded-[36px] sm:p-8"
      >
        <p className="text-caption-pro text-blue-100">
          Video bài giảng và E-learning
        </p>

        <h1 className="text-hero-pro mt-3 max-w-4xl text-white">
          Học theo từng bài, có video tương tác, thẻ kiến thức và luyện tập ngay sau bài
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
          Mỗi bài có một khung E-learning riêng. Sau khi học, em có thể chuyển ngay
          sang mindmap, Focus Room hoặc luyện tập theo đúng bài đó.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white sm:px-4 sm:py-2 sm:text-sm">
            12 bài học
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white sm:px-4 sm:py-2 sm:text-sm">
            E-learning
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white sm:px-4 sm:py-2 sm:text-sm">
            Mindmap + Luyện tập
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {lessonCatalog.map((lesson) => (
          <Link
            id={lesson.id}
            key={lesson.id}
            href={`/student/lessons/${lesson.id}`}
            className="mobile-safe-section group block overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[30px] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-base font-black text-blue-700 sm:h-12 sm:w-12">
                {lesson.order}
              </div>

              <span className="max-w-[58%] truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {lesson.chapter}
              </span>
            </div>

            <h2 className="mt-5 text-lg font-black leading-snug text-slate-800 group-hover:text-blue-700 sm:text-xl">
              {lesson.title}
            </h2>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
              {lesson.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="text-sm font-black text-blue-600">
                Vào bài học →
              </span>

              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                Bài {lesson.order}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}