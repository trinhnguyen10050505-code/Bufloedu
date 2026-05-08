import Link from "next/link";
import { lessonCatalog } from "@/data/lesson-catalog";

export default function StudentLessonsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Video bài giảng và E-learning
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl">
          Học theo từng bài, có video tương tác, thẻ kiến thức và luyện tập ngay sau bài
        </h1>
        <p className="mt-4 max-w-3xl text-blue-50">
          Mỗi bài có một khung E-learning riêng. Sau khi học, em có thể chuyển ngay
          sang mindmap, Focus Room hoặc luyện tập theo đúng bài đó.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {lessonCatalog.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/student/lessons/${lesson.id}`}
            className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700">
                {lesson.order}
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {lesson.chapter}
              </span>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800 group-hover:text-blue-700">
              {lesson.title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {lesson.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 text-sm font-semibold text-blue-600">
              Vào bài học →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}