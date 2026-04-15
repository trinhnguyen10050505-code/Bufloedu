"use client";

import { useMemo, useState } from "react";
import { questionBank } from "@/data/question-bank-raw";
import { Question } from "@/types";

type AnswerMap = Record<string, string>;

export default function DiagnosticTestPage() {
  const diagnosticQuestions = useMemo(() => {
    return questionBank.slice(0, 8);
  }, []);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const score = diagnosticQuestions.reduce((total: number, question: Question) => {
    return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);

  const level =
    score <= 3 ? "Trung bình" : score <= 6 ? "Khá" : "Giỏi";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Bài test chẩn đoán</h1>
          <p className="mt-2 text-slate-600">
            Làm bài để hệ thống xác định mức độ hiện tại và đề xuất cách học phù hợp cho em.
          </p>
        </div>

        {diagnosticQuestions.map((question: Question, index: number) => (
          <div key={question.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-lg font-semibold text-slate-800">
              Câu {index + 1}. {question.question}
            </p>

            <div className="grid gap-3">
              {question.options.map((optionText: string, optionIndex: number) => {
                const optionId = String.fromCharCode(65 + optionIndex);
                const isSelected = answers[question.id] === optionId;

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
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
            className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
          >
            Nộp bài test
          </button>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">Kết quả chẩn đoán</h2>
            <p className="mt-3 text-lg text-slate-700">
              Em đúng <span className="font-bold">{score}</span> / {diagnosticQuestions.length} câu
            </p>
            <p className="mt-2 text-slate-600">
              Mức đề xuất hiện tại của em là: <span className="font-semibold">{level}</span>
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-800">Gợi ý tiếp theo</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
                <li>Ôn lại các phần em còn sai</li>
                <li>Luyện tập theo mức độ phù hợp</li>
                <li>Làm kiểm tra nhanh sau khi học xong</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}