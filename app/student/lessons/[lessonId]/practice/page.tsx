"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { lessonsContent } from "@/data/lessons-content";
import { questionBank } from "@/data/question-bank";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { saveStudentProgress } from "@/lib/progress";
import { StudentLevel } from "@/types";
import { useCurrentUser } from "@/hook/useCurrentUser";
import BuChatWidget from "@/components/student/BuChatWidget";

type AnswerMap = Record<string, string>;

function mapAccuracyToLevel(accuracy: number): StudentLevel {
  if (accuracy >= 80) return "gioi";
  if (accuracy >= 50) return "kha";
  return "trungbinh";
}

export default function PracticePage() {
  const params = useParams();
  const lessonId = params.lessonId as keyof typeof lessonsContent;
  const lesson = lessonsContent[lessonId];
  const { profile } = useCurrentUser();

  const questions = useMemo(() => {
    return questionBank.filter((q) => q.lessonId === lessonId);
  }, [lessonId]);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const score = questions.reduce((total, q) => {
    return total + (answers[q.id] === q.correctAnswerId ? 1 : 0);
  }, 0);

  const accuracy =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const derivedLevel = mapAccuracyToLevel(accuracy);
  const buMeta = getBuLevelMeta(derivedLevel);

  async function handleSubmit() {
    if (!profile?.uid) return;

    setSubmitted(true);

    try {
      setIsSaving(true);

      await saveStudentProgress({
        studentId: profile.uid,
        lessonId,
        activityType: "practice",
        score,
        totalQuestions: questions.length,
        accuracy,
        level: derivedLevel,
      });
    } catch (error) {
      console.error("Lưu tiến độ luyện tập thất bại:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (!lesson) {
    return <div className="p-10 text-red-500">Không tìm thấy bài học</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Luyện tập theo bài
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Luyện tập - {lesson.title}
            </h1>
            <p className="mt-3 max-w-3xl text-blue-50">
              Bu đã chuẩn bị toàn bộ câu hỏi của bài này để em luyện từ nền tảng
              đến vận dụng. Học chắc từng bước sẽ giúp em tiến bộ thật sự.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/student/lessons/${lessonId}`}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Quay lại bài học
              </Link>
              <Link
                href={`/student/lessons/${lessonId}/quick-test`}
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Làm kiểm tra nhanh
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Tổng số câu</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{questions.length}</p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Mức phù hợp sau khi làm</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{buMeta.label}</p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Mục tiêu</p>
              <p className="mt-2 text-base font-semibold text-slate-800">
                Làm chắc kiến thức và nhận biết phần còn yếu
              </p>
            </div>
          </section>

          {questions.map((q, index) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correctAnswerId;

            return (
              <div key={q.id} className="rounded-[28px] bg-white p-6 shadow-sm">
                <p className="text-lg font-semibold text-slate-800">
                  Câu {index + 1}. {q.question}
                </p>

                <div className="mt-4 grid gap-3">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt.id;
                    const correct = submitted && opt.id === q.correctAnswerId;
                    const wrong =
                      submitted && isSelected && opt.id !== q.correctAnswerId;

                    return (
                      <button
                        key={opt.id}
                        disabled={submitted}
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.id]: opt.id,
                          }))
                        }
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          correct
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : wrong
                            ? "border-red-500 bg-red-50 text-red-700"
                            : isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-semibold">{opt.id}.</span> {opt.text}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className={isCorrect ? "text-emerald-600" : "text-red-600"}>
                      {isCorrect
                        ? "Bu thấy em làm đúng câu này."
                        : "Bu thấy câu này em cần xem lại kỹ hơn."}
                    </p>
                    <p className="mt-2 text-slate-600">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
            >
              Bu xem kết quả luyện tập cho em
            </button>
          ) : (
            <section className="rounded-[28px] bg-white p-8 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Kết quả luyện tập</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                Bu thấy em đúng {score}/{questions.length} câu ({accuracy}%)
              </h2>

              <div className={`mt-5 rounded-3xl border p-5 ${buMeta.cardClass}`}>
                <p className="font-semibold text-slate-800">{buMeta.label}</p>
                <p className="mt-2 text-slate-700">{buMeta.shortDescription}</p>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-800">Bu gợi ý tiếp theo</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                  {accuracy < 60 ? (
                    <>
                      <li>Ôn lại phần lý thuyết của bài này trước.</li>
                      <li>Làm lại bài luyện tập để chắc hơn từng câu.</li>
                      <li>Sau đó mới chuyển sang kiểm tra nhanh.</li>
                    </>
                  ) : accuracy < 80 ? (
                    <>
                      <li>Em đã khá ổn rồi, nên làm thêm quick-test để kiểm tra tốc độ nắm bài.</li>
                      <li>Bu gợi ý luyện thêm các câu thông hiểu và vận dụng.</li>
                    </>
                  ) : (
                    <>
                      <li>Em đang làm rất tốt bài này.</li>
                      <li>Hãy sang quick-test và bài tiếp theo để giữ nhịp học.</li>
                    </>
                  )}
                </ul>
              </div>

              {isSaving && (
                <p className="mt-4 text-sm text-blue-600">
                  Bu đang lưu tiến độ luyện tập của em...
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                  }}
                  className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
                >
                  Làm lại
                </button>

                <Link
                  href={`/student/lessons/${lessonId}/quick-test`}
                  className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  Sang kiểm tra nhanh
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>

      <BuChatWidget
        lessonTitle={lesson.title}
        currentLevelLabel={buMeta.label}
        weakTopics={accuracy < 60 ? [lesson.title] : []}
      />
    </>
  );
}