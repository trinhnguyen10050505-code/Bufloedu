"use client";

import { useMemo, useState } from "react";
import { questionBank } from "@/data/question-bank-raw";
import { Question } from "@/types";

type StudentLevel = "trung_binh" | "kha" | "gioi";
type AnswerMap = Record<string, string>;

export default function ExercisesPage() {
  const [activeMode, setActiveMode] = useState<"theo_muc" | "theo_bai">("theo_muc");
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel>("trung_binh");
  const [selectedLesson, setSelectedLesson] = useState("lesson-2");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (activeMode === "theo_muc") {
      return questionBank.filter((q: Question) => q.targetLevel === selectedLevel).slice(0, 8);
    }

    return questionBank.filter((q: Question) => q.lessonId === selectedLesson).slice(0, 8);
  }, [activeMode, selectedLevel, selectedLesson]);

  const score = filteredQuestions.reduce((total: number, question: Question) => {
    return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);

  const resetState = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Luyện tập cá nhân hóa</h1>
          <p className="mt-2 text-slate-600">
            Em có thể luyện theo mức độ hoặc chọn đúng bài mình muốn ôn tập.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveMode("theo_muc");
                resetState();
              }}
              className={`rounded-2xl px-4 py-3 font-semibold ${
                activeMode === "theo_muc"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Luyện theo mức
            </button>

            <button
              onClick={() => {
                setActiveMode("theo_bai");
                resetState();
              }}
              className={`rounded-2xl px-4 py-3 font-semibold ${
                activeMode === "theo_bai"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Luyện theo bài
            </button>
          </div>

          {activeMode === "theo_muc" ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {(["trung_binh", "kha", "gioi"] as StudentLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSelectedLevel(level);
                    resetState();
                  }}
                  className={`rounded-2xl px-4 py-2 ${
                    selectedLevel === level
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {level === "trung_binh" ? "Trung bình" : level === "kha" ? "Khá" : "Giỏi"}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <select
                value={selectedLesson}
                onChange={(e) => {
                  setSelectedLesson(e.target.value);
                  resetState();
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-700"
              >
                <option value="lesson-2">Bài 2 - Phản ứng hóa học</option>
                <option value="lesson-3">Bài 3 - Mol và tỉ khối chất khí</option>
                <option value="lesson-4">Bài 4 - Nồng độ dung dịch</option>
                <option value="lesson-5">Bài 5 - Bảo toàn khối lượng</option>
              </select>
            </div>
          )}
        </div>

        {filteredQuestions.map((question: Question, index: number) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctAnswer;

          return (
            <div key={question.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-800">
                  Câu {index + 1}. {question.question}
                </p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  {question.level}
                </span>
              </div>

              <div className="grid gap-3">
                {question.options.map((optionText: string, optionIndex: number) => {
                  const optionId = String.fromCharCode(65 + optionIndex);
                  const isSelected = selected === optionId;
                  const showCorrect = submitted && optionText === question.correctAnswer;
                  const showWrong = submitted && isSelected && optionText !== question.correctAnswer;

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
            Nộp bài luyện tập
          </button>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">
              Kết quả: {score}/{filteredQuestions.length}
            </h2>
            <p className="mt-2 text-slate-600">
              Hệ thống sẽ dùng kết quả này để gợi ý nội dung tiếp theo phù hợp với em.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}