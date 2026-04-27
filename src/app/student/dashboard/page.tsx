import Link from "next/link";
import LevelBadge from "@/components/student/LevelBadge";
import ProgressCard from "@/components/student/ProgressCard";
import PracticeCard from "@/components/student/PracticeCard";
import QueueCard from "@/components/student/QueueCard";
import { science8Chapter1Queue } from "@/data/science8.chapter1";
import { GRADIENT_PRIMARY, BUTTON_PRIMARY, CARD_BASE } from "@/lib/theme";

export default function StudentDashboardPage() {
  const studentName = "Minh";
  const currentLevel: any = "kha";

  const levelLabel =
    currentLevel === "trungbinh"
      ? "Trung bình"
      : currentLevel === "kha"
      ? "Khá"
      : "Giỏi";

  const completedLessons = 2;
  const totalLessons = science8Chapter1Queue.length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HERO */}
        <section className={`${GRADIENT_PRIMARY} overflow-hidden rounded-[32px] p-8 text-white shadow-lg md:p-10`}>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
                Khu học tập cá nhân hóa
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Chào {studentName}, hôm nay em học gì?
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
                Hệ thống sẽ giúp em học theo đúng năng lực, gợi ý bài nên học trước,
                tăng dần độ khó qua từng bài và theo dõi tiến bộ rõ ràng sau mỗi chặng học.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <LevelBadge level={currentLevel} />
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
                  Mức hiện tại: {levelLabel}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/student/diagnostic-test"
                  className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Làm bài test chẩn đoán
                </Link>

                <Link
                  href="/student/exercises"
                  className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
                >
                  Bắt đầu luyện tập
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-md">
              <p className="text-sm font-medium text-blue-100">Trạng thái học tập</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Tiến độ bài học</p>
                  <p className="mt-2 text-3xl font-bold">
                    {completedLessons}/{totalLessons}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Focus time</p>
                  <p className="mt-2 text-3xl font-bold">125 phút</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-medium text-blue-100">Gợi ý tiếp theo</p>
                <ul className="mt-3 space-y-2 text-sm text-white">
                  <li>• Ôn lại bài Phản ứng hóa học</li>
                  <li>• Luyện tập mức {levelLabel}</li>
                  <li>• Làm kiểm tra nhanh 5 câu</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS CARDS */}
        <section className="grid gap-5 md:grid-cols-3">
          <ProgressCard
            title="Mức hiện tại"
            value={levelLabel}
            subtitle="Hệ thống sẽ dựa trên bài test và kết quả luyện tập để điều chỉnh lộ trình học."
          />
          <ProgressCard
            title="Tiến độ 6 bài"
            value={`${completedLessons}/${totalLessons}`}
            subtitle="Học theo từng bài, từng chặng sẽ giúp em nắm chắc kiến thức hơn."
          />
          <ProgressCard
            title="Thời gian Focus"
            value="125 phút"
            subtitle="Giữ nhịp học đều và tập trung sẽ giúp em nâng mức nhanh hơn."
          />
        </section>

        {/* STUDY PATH + GUIDANCE */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={`${CARD_BASE} p-6 sm:p-8`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Lộ trình học theo bài</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  6 bài học trọng tâm dành cho em
                </h2>
              </div>

              <Link
                href="/student/exercises"
                className={`${BUTTON_PRIMARY} rounded-2xl px-4 py-3 text-sm font-semibold`}
              >
                Luyện tập ngay
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {science8Chapter1Queue.map((lesson: any, index: number) => {
                const isDone = index < completedLessons;
                const isCurrent = index === completedLessons;

                return (
                  <div
                    key={lesson.lessonId}
                    className={`rounded-3xl border p-5 transition ${
                      isCurrent
                        ? "border-blue-200 bg-blue-50"
                        : isDone
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold ${
                            isCurrent
                              ? BUTTON_PRIMARY
                              : isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {lesson.lessonTitle}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {lesson.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {isDone && (
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Đã hoàn thành
                              </span>
                            )}
                            {isCurrent && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                Bài nên học tiếp theo
                              </span>
                            )}
                            {!isDone && !isCurrent && (
                              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                Chưa bắt đầu
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/student/lessons/${lesson.lessonId}`}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Học bài này
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <QueueCard
              title="Gợi ý học hôm nay"
              items={[
                "Làm bài test chẩn đoán nếu em chưa được phân mức",
                "Ôn lại bài Phản ứng hóa học trước khi sang bài mới",
                "Luyện tập mức Khá để tăng độ chắc kiến thức",
                "Làm kiểm tra nhanh sau khi học xong",
              ]}
            />

            <QueueCard
              title="Phần cần củng cố"
              items={[
                "Phân biệt biến đổi vật lí và biến đổi hóa học",
                "Dấu hiệu nhận biết phản ứng hóa học",
                "Vận dụng khái niệm mol trong bài tập cơ bản",
              ]}
            />
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <PracticeCard
            title="Đánh giá mức độ"
            description="Làm bài test đầu vào để hệ thống xác định mức hiện tại và gợi ý lộ trình phù hợp."
            href="/student/diagnostic-test"
            cta="Làm test"
          />
          <PracticeCard
            title="Luyện tập cá nhân hóa"
            description="Luyện theo mức độ hoặc theo từng bài để tiến bộ đúng phần em còn thiếu."
            href="/student/exercises"
            cta="Vào luyện tập"
          />
          <PracticeCard
            title="Focus Room"
            description="Học tập trung theo phiên ngắn, giữ nhịp học ổn định và chủ động hơn."
            href="/student/focus-room"
            cta="Bắt đầu focus"
          />
          <PracticeCard
            title="Kết quả học tập"
            description="Xem điểm, tiến độ, mức độ cải thiện và những phần kiến thức cần ôn thêm."
            href="/student/results"
            cta="Xem kết quả"
          />
        </section>

        {/* STUDY JOURNEY */}
        <section className={`${CARD_BASE} p-6 sm:p-8`}>
          <p className="text-sm font-medium text-blue-600">Hành trình học tập</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Em sẽ đi theo tiến trình này
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {[
              "Test đầu vào",
              "Học theo bài",
              "Luyện theo mức",
              "Focus Room",
              "Kiểm tra nhanh",
              "Xem kết quả",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${BUTTON_PRIMARY} font-bold">
                  {index + 1}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}