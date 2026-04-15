"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getQuickTestQuestions } from "@/lib/lesson-utils";
import { Question } from "@/types";

type AnswerMap = Record<string, string>;

export default function QuickTestPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const questions = useMemo(() => getQuickTestQuestions(lessonId, 5), [lessonId]);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total: number, question: Question) => {
    return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Kiểm tra nhanh</h1>
          <p className="mt-2 text-slate-600">Bài kiểm tra ngắn để xem em đã nắm bài đến đâu.</p>
        </div>

        {questions.map((question: Question, index: number) => (
          <div key={question.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-lg font-semibold text-slate-800">
              Câu {index + 1}. {question.question}
            </p>

            <div className="grid gap-3">
              {question.options.map((optionText: string, optionIndex: number) => {
                const optionId = String.fromCharCode(65 + optionIndex);
                return (
                  <button
                    key={optionId}
                    type="button"
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: optionId,
                      }))
                    }
                    className={`rounded-2xl border px-4 py-3 text-left ${
                      answers[question.id] === optionId
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{optionId}.</span> {optionText}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="rounded-2xl bg-emerald-600 px-6 py-4 font-semibold text-white hover:bg-emerald-700"
          >
            Xem kết quả
          </button>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">
              Em đúng {score}/{questions.length} câu
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}