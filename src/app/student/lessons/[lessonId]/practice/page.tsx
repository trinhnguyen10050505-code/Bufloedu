"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getQuestionsByLesson } from "@/lib/lesson-utils";
import { Question } from "@/types";

type AnswerMap = Record<string, string>;

export default function LessonPracticePage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const questions = useMemo(() => getQuestionsByLesson(lessonId), [lessonId]);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const score = questions.reduce((total: number, question: Question) => {
    return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Luyện tập theo bài</h1>
          <p className="mt-2 text-slate-600">
            Làm bài rồi bấm nộp để xem đáp án và lời giải.
          </p>
        </div>

        {questions.map((question: Question, index: number) => {
          const selectedAnswer = answers[question.id];
          const isCorrect = selectedAnswer === question.correctAnswer;

          return (
            <div key={question.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-800">
                  Câu {index + 1}. {question.question}
                </p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  {question.level}
                </span>
              </div>

              <div className="grid gap-3">
                {question.options.map((optionText: string, index: number) => {
                  const optionId = String.fromCharCode(65 + index);
                  const isSelected = selectedAnswer === optionId;
                  const showCorrect = submitted && optionText === question.correctAnswer;
                  const showWrong =
                    submitted && isSelected && optionText !== question.correctAnswer;

                  return (
                    <button
                      key={optionId}
                      type="button"
                      onClick={() => handleSelect(question.id, optionId)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        showCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : showWrong
                          ? "border-red-500 bg-red-50 text-red-700"
                          : isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium">{optionId}.</span> {optionText}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className={`font-semibold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
                    {isCorrect ? "Đúng" : "Chưa đúng"}
                  </p>
                  <p className="mt-2 text-slate-600">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
          >
            Nộp bài
          </button>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">
              Kết quả: {score}/{questions.length}
            </h2>
            <p className="mt-2 text-slate-600">
              Em đã hoàn thành phần luyện tập của bài này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}