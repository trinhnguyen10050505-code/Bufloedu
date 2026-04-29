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

export default function QuickTestPage() {
  const params = useParams();
  const lessonId = params.lessonId as keyof typeof lessonsContent;
  const lesson = lessonsContent[lessonId];
  const { profile } = useCurrentUser();

  const questions = useMemo(() => {
    return questionBank.filter((q) => q.lessonId === lessonId).slice(0, 5);
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
        activityType: "quick_test",
        score,
        totalQuestions: questions.length,
        accuracy,
        level: derivedLevel,
      });
    } catch (error) {
      console.error("Lưu quick test thất bại:", error);
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
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Kiểm tra nhanh
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Quick test - {lesson.title}
            </h1>
            <p className="mt-3 max-w-3xl text-blue-50">
              Bu chuẩn bị cho em 5 câu để kiểm tra em đã nắm bài đến đâu rồi.
              Đây là bước ngắn gọn để xác nhận em đã thật sự chắc bài.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/student/lessons/${lessonId}`}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Quay lại bài học
              </Link>
              <Link
                href={`/student/lessons/${lessonId}/practice`}
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Quay lại luyện tập
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Số câu kiểm tra</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{questions.length}</p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Mục tiêu</p>
              <p className="mt-2 text-base font-semibold text-slate-800">
                Kiểm tra nhanh mức độ nắm bài hiện tại
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Bu sẽ đánh giá</p>
              <p className="mt-2 text-base font-semibold text-slate-800">
                Độ chắc bài và bước học tiếp theo của em
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
                        : "Bu thấy em cần xem lại ý này."}
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
              Bu chấm quick test cho em
            </button>
          ) : (
            <section className="rounded-[28px] bg-white p-8 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Kết quả kiểm tra nhanh</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                Bu thấy em đúng {score}/{questions.length} câu ({accuracy}%)
              </h2>

              <div className={`mt-5 rounded-3xl border p-5 ${buMeta.cardClass}`}>
                <p className="font-semibold text-slate-800">{buMeta.label}</p>
                <p className="mt-2 text-slate-700">{buMeta.shortDescription}</p>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-800">Bu gợi ý bước tiếp theo</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                  {accuracy < 60 ? (
                    <>
                      <li>Quay lại phần luyện tập để củng cố bài này thêm một lần nữa.</li>
                      <li>Đọc lại lý thuyết và chú ý các câu em vừa sai.</li>
                    </>
                  ) : accuracy < 80 ? (
                    <>
                      <li>Em đã khá ổn, Bu gợi ý học tiếp bài sau hoặc luyện thêm 1 lượt ngắn.</li>
                      <li>Giữ nhịp Focus Room để học đều hơn mỗi ngày.</li>
                    </>
                  ) : (
                    <>
                      <li>Em đã nắm bài khá chắc rồi.</li>
                      <li>Bu gợi ý chuyển sang bài tiếp theo để duy trì đà học tốt.</li>
                    </>
                  )}
                </ul>
              </div>

              {isSaving && (
                <p className="mt-4 text-sm text-blue-600">
                  Bu đang lưu kết quả quick test của em...
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
                  href="/student"
                  className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  Về dashboard
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