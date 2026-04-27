"use client";

import { useMemo, useState } from "react";
import { questionBank } from "@/data/question-bank";
import { buildDiagnosticResult } from "@/lib/level-engine";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { GRADIENT_PRIMARY, BUTTON_PRIMARY, CARD_BASE } from "@/lib/theme";
import { Question } from "@/types/question";
import { saveStudentProgress } from "@/lib/progress";

type AnswerMap = Record<string, string>;

export default function DiagnosticTestPage() {
  const diagnosticQuestions = useMemo<Question[]>(() => {
    return questionBank.slice(0, 8);
  }, []);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const correctCount = diagnosticQuestions.reduce((total: number, question: Question) => {
    return total + (answers[question.id] === question.correctAnswerId ? 1 : 0);
  }, 0);

  const hardCorrect = diagnosticQuestions.reduce((total: number, question: Question) => {
    const isHard = question.level === "vandung";
    const isCorrect = answers[question.id] === question.correctAnswerId;
    return total + (isHard && isCorrect ? 1 : 0);
  }, 0);

  const correctRate =
    diagnosticQuestions.length > 0
      ? (correctCount / diagnosticQuestions.length) * 100
      : 0;

  const result = buildDiagnosticResult({
    correctRate,
    hardCorrect,
    completionTime: 850,
    weakLessons: ["lesson-2", "lesson-3"],
  });

  const buMeta = getBuLevelMeta(result.level);

  const handleSubmit = async () => {
    setSubmitted(true);

    try {
      setIsSaving(true);

      await saveStudentProgress({
        studentId: "demo-student-id",
        lessonId: "diagnostic-test",
        activityType: "diagnostic_test",
        score: correctCount,
        totalQuestions: diagnosticQuestions.length,
        accuracy: Math.round(correctRate),
        level: result.level,
      });
    } catch (error) {
      console.error("Lưu tiến độ diagnostic thất bại:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* HEADER */}
        <section className={`${GRADIENT_PRIMARY} rounded-[32px] p-8 text-white shadow-lg`}>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
            Bài test chẩn đoán
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Bu sẽ giúp em xác định điểm bắt đầu
          </h1>
          <p className="mt-3 max-w-2xl text-blue-50">
            Làm bài test này để Bu hiểu rõ em đang mạnh ở đâu, còn thiếu phần nào
            và nên học theo lộ trình nào tiếp theo.
          </p>
        </section>

        {/* QUESTIONS */}
        {diagnosticQuestions.map((question: Question, index: number) => (
          <section key={question.id} className={`${CARD_BASE} p-6`}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <p className="text-lg font-semibold leading-7 text-slate-800">
                Câu {index + 1}. {question.question}
              </p>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  question.level === "nhanbiet"
                    ? "bg-amber-100 text-amber-700"
                    : question.level === "thonghieu"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {question.level === "nhanbiet"
                  ? "Nhận biết"
                  : question.level === "thonghieu"
                  ? "Thông hiểu"
                  : "Vận dụng"}
              </span>
            </div>

            <div className="grid gap-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: option.id,
                      }))
                    }
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold">{option.id}.</span> {option.text}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* ACTION */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className={`${BUTTON_PRIMARY} rounded-2xl px-6 py-4 font-semibold`}
          >
            Bu xem kết quả cho em
          </button>
        ) : (
          <section className={`${CARD_BASE} p-8`}>
            <p className="text-sm font-medium text-blue-600">Kết quả chẩn đoán</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              Bu thấy em đang ở mức {buMeta.label}
            </h2>

            <div className={`mt-5 rounded-3xl border p-5 ${buMeta.cardClass}`}>
              <p className="font-semibold text-slate-800">{buMeta.shortDescription}</p>
              <p className="mt-2 leading-7 text-slate-700">{buMeta.longDescription}</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Số câu đúng</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {correctCount}/{diagnosticQuestions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Tỉ lệ đúng</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {Math.round(correctRate)}%
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Câu vận dụng đúng</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {hardCorrect}
                </p>
              </div>
            </div>

            {isSaving && (
              <p className="mt-4 text-sm text-blue-600">
                Bu đang lưu kết quả chẩn đoán của em...
              </p>
            )}

            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-800">Bu gợi ý bước tiếp theo cho em</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                <li>Học theo bài mà Bu đang gợi ý trên dashboard</li>
                <li>Luyện tập đúng mức độ hiện tại để học chắc hơn</li>
                <li>Làm kiểm tra nhanh sau mỗi bài để xem em đã tiến bộ chưa</li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}