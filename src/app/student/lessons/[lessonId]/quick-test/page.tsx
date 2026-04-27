"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { lessonsContent } from "@/data/lessons-content";
import { questionBank } from "@/data/question-bank";
import { getBuLevelMeta } from "@/lib/bu-level";
import { saveStudentProgress } from "@/lib/progress";
import { StudentLevel } from "@/types";
import BuChatWidget from "@/components/student/BuChatWidget";

type AnswerMap = Record<string, string>;

function mapAccuracyToLevel(accuracy: number): StudentLevel {
  if (accuracy >= 80) return "gioi";
  if (accuracy >= 50) return "kha";
  return "trungbinh";
}

export default function QuickTestPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const lesson = lessonsContent[lessonId];

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
    questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0;

  const derivedLevel = mapAccuracyToLevel(accuracy);
  const buMeta = getBuLevelMeta(derivedLevel);

  const handleSubmit = async () => {
    setSubmitted(true);

    try {
      setIsSaving(true);

      await saveStudentProgress({
        studentId: "demo-student-id",
        lessonId,
        activityType: "quick_test",
        score,
        totalQuestions: questions.length,
        accuracy,
        level: derivedLevel,
      });
    } catch (error) {
      console.error("Lưu tiến độ quick test thất bại:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!lesson) {
    return <div className="p-10 text-red-500">Không tìm thấy bài học</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* HEADER */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold">
              Kiểm tra nhanh - {lesson.title}
            </h1>
            <p className="mt-2 text-blue-100">
              Bu chuẩn bị cho em 5 câu để kiểm tra em đã nắm bài đến đâu rồi nhé
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/student/lessons/${lessonId}`}
                className="rounded-xl bg-white px-4 py-2 font-semibold text-blue-700"
              >
                Quay lại bài học
              </Link>
            </div>
          </div>

          {/* QUESTIONS */}
          {questions.map((q, index) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correctAnswerId;

            return (
              <div key={q.id} className="rounded-3xl bg-white p-6 shadow-sm">
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
                        className={`rounded-2xl border px-4 py-4 text-left ${
                          correct
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : wrong
                            ? "border-red-500 bg-red-50 text-red-700"
                            : isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">{opt.id}.</span> {opt.text}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className={isCorrect ? "text-emerald-600" : "text-red-600"}>
                      {isCorrect ? "Bu thấy em làm đúng câu này." : "Bu thấy câu này em cần xem lại."}
                    </p>
                    <p className="mt-2 text-slate-600">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* ACTION */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
            >
              Bu xem kết quả cho em
            </button>
          ) : (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">
                Bu thấy em đúng {score}/{questions.length} câu ({accuracy}%)
              </h2>

              <div className={`mt-4 rounded-3xl border p-5 ${buMeta.cardClass}`}>
                <p className="font-semibold text-slate-800">{buMeta.label}</p>
                <p className="mt-2 text-slate-700">{buMeta.shortDescription}</p>
              </div>

              <p className="mt-4 text-slate-600">
                {accuracy >= 80
                  ? "Bu thấy em đã nắm khá chắc bài rồi!"
                  : accuracy >= 50
                  ? "Bu thấy em cần luyện thêm một chút để chắc hơn."
                  : "Bu gợi ý em xem lại lý thuyết trước khi học tiếp nhé."}
              </p>

              {isSaving && (
                <p className="mt-2 text-sm text-blue-600">Bu đang lưu tiến độ của em...</p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                  }}
                  className="rounded-xl bg-slate-200 px-4 py-3"
                >
                  Làm lại
                </button>

                <Link
                  href={`/student/lessons/${lessonId}/practice`}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-white"
                >
                  Sang luyện tập
                </Link>
              </div>
            </div>
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