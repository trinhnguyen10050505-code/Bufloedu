import Link from "next/link";

type ExerciseOverviewPanelProps = {
  lessonTitle: string;
  totalQuestions: number;
  levelLabel: string;
  practiceHref: string;
  quickTestHref: string;
};

export default function ExerciseOverviewPanel({
  lessonTitle,
  totalQuestions,
  levelLabel,
  practiceHref,
  quickTestHref,
}: ExerciseOverviewPanelProps) {
  return (
    <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
        Luyện tập cá nhân hóa
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        Luyện tập - {lessonTitle}
      </h1>
      <p className="mt-3 max-w-3xl text-blue-50">
        Bu đã chuẩn bị bài luyện tập để em củng cố kiến thức từng bước, từ nền
        tảng đến vận dụng.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">Tổng số câu</p>
          <p className="mt-2 text-2xl font-bold">{totalQuestions}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">Mức Bu dự kiến</p>
          <p className="mt-2 text-2xl font-bold">{levelLabel}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">Mục tiêu</p>
          <p className="mt-2 text-base font-semibold">
            Làm chắc bài và nhận ra phần còn yếu
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={practiceHref}
          className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Luyện ngay
        </Link>

        <Link
          href={quickTestHref}
          className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
        >
          Sang kiểm tra nhanh
        </Link>
      </div>
    </section>
  );
}