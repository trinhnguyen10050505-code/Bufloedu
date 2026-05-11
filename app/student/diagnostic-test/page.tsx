"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { buildDiagnosticSet, calculateResult } from "@/lib/practice-system";
import {
  saveLearningActivity,
  updateStudentAfterAssessment,
} from "@/lib/practice-progress";
import { PracticeQuestion } from "@/types/practice-final";

type AnswerMap = Record<string, string>;

export default function DiagnosticTestPage() {
  const { profile } = useCurrentUser();
  const lessons = useMemo(() => getPracticeLessons(), []);

  const [startLessonOrder, setStartLessonOrder] = useState(
    lessons[0]?.lessonOrder || 2
  );
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;
  const result = calculateResult(questions, answers);
  const buMeta = getBuLevelMeta(result.level);

  function generateDiagnostic() {
    const set = buildDiagnosticSet(startLessonOrder);
    setQuestions(set);
    setAnswers({});
    setSubmitted(false);
    setMessage("");
  }

  async function submitDiagnostic() {
    if (!profile?.uid || questions.length === 0 || saving) return;

    if (!allAnswered) {
      setMessage("Bu thấy em vẫn còn câu chưa chọn. Em kiểm tra lại trước khi nộp nhé.");
      return;
    }

    try {
      setSaving(true);

      await saveLearningActivity({
        studentId: profile.uid,
        lessonId: `diagnostic-before-lesson-${startLessonOrder}`,
        activityType: "diagnostic_test",
        score: result.score,
        totalQuestions: result.totalQuestions,
        accuracy: result.accuracy,
        level: result.level,
        questionIds: result.questionIds,
        answerDetails: result.answerDetails,
      });

      await updateStudentAfterAssessment({
        studentId: profile.uid,
        currentLevel: result.level,
        weakLessonIds: result.weakLessonIds,
        recommendedLessonIds:
          result.weakLessonIds.length > 0
            ? result.weakLessonIds
            : [`lesson-${startLessonOrder}`],
        lastAccuracy: result.accuracy,
        nextAction:
          result.accuracy >= 80
            ? "Em có nền tốt. Bu gợi ý học bài mới và thử quick-test sau khi học."
            : result.accuracy >= 50
            ? "Em đã có nền khá ổn. Bu gợi ý học bài mới kết hợp luyện thêm bài trước."
            : "Bu thấy em nên ôn lại các bài nền trước khi học tiếp.",
      });

      setSubmitted(true);
      setMessage(
        `Bu đã lưu kết quả chẩn đoán. Em đúng ${result.score}/${result.totalQuestions} câu, đạt ${result.accuracy}%.`
      );
    } catch (error) {
      console.error("Lưu diagnostic thất bại:", error);
      setMessage("Bu chưa lưu được kết quả. Em thử lại sau nhé.");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Em cần đăng nhập</h1>
        <p className="mt-3 text-slate-600">
          Bài test chẩn đoán dùng để cá nhân hóa lộ trình nên Bu cần lưu kết quả cho em.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Test chẩn đoán
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu kiểm tra nền kiến thức trước khi em bắt đầu học
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Em chọn bài muốn bắt đầu học. Bu sẽ lấy câu hỏi của các bài trước đó để xem
          em đã đủ nền chưa, rồi cập nhật mức Trung bình, Khá hoặc Giỏi.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">
          Em muốn bắt đầu học từ bài nào?
        </label>

        <select
          value={startLessonOrder}
          onChange={(event) => setStartLessonOrder(Number(event.target.value))}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        >
          {lessons.map((lesson) => (
            <option key={lesson.lessonId} value={lesson.lessonOrder}>
              Bắt đầu từ bài {lesson.lessonOrder}. {lesson.lessonTitle}
            </option>
          ))}
        </select>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={generateDiagnostic}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Bu tạo bài chẩn đoán
          </button>

          <Link
            href="/student"
            className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
          >
            Quay lại dashboard
          </Link>
        </div>
      </section>

      {questions.length > 0 ? (
        <section className="space-y-5">
          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-slate-500">Số câu</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-slate-500">Đã chọn</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {answeredCount}/{questions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-slate-500">Mức tạm tính</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {buMeta.label}
                </p>
              </div>
            </div>
          </div>

          {questions.map((question, index) => {
            const selected = answers[question.id];
            const isCorrect = selected === question.correctOptionId;

            return (
              <article
                key={question.id}
                className="rounded-[30px] bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-blue-600">
                  {question.lessonTitle} · {question.level}
                </p>

                <h2 className="mt-2 text-lg font-bold leading-7 text-slate-800">
                  Câu {index + 1}. {question.question}
                </h2>

                <div className="mt-5 grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = selected === option.id;
                    const correct = submitted && option.id === question.correctOptionId;
                    const wrong =
                      submitted && isSelected && option.id !== question.correctOptionId;

                    return (
                      <button
                        key={option.id}
                        disabled={submitted}
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: option.id,
                          }))
                        }
                        className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                          correct
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : wrong
                            ? "border-red-500 bg-red-50 text-red-700"
                            : isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-semibold">{option.id}.</span>{" "}
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                {submitted ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className={isCorrect ? "text-emerald-600" : "text-red-600"}>
                      {isCorrect
                        ? "Bu thấy em làm đúng câu này."
                        : "Bu thấy em cần xem lại ý này."}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Đáp án đúng:{" "}
                      <span className="font-semibold">{question.correctOptionId}</span>
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}

          <section className="sticky bottom-4 z-20 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            {!submitted ? (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-medium text-slate-600">
                  Bu nhắc: hãy chọn đủ câu trước khi nộp để kết quả chẩn đoán chính xác.
                </p>

                <button
                  onClick={submitDiagnostic}
                  disabled={saving || !allAnswered}
                  className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Bu đang lưu..." : "Nộp bài chẩn đoán"}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-slate-700">
                  {message}
                </p>

                <div className={`rounded-3xl border p-5 ${buMeta.cardClass}`}>
                  <p className="font-semibold text-slate-800">{buMeta.label}</p>
                  <p className="mt-2 text-slate-700">{buMeta.shortDescription}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Link
                    href="/student/lessons"
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    Vào học bài
                  </Link>

                  <Link
                    href="/student/exercises"
                    className="rounded-2xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Luyện phần Bu gợi ý
                  </Link>

                  <Link
                    href="/student/results"
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white hover:bg-emerald-700"
                  >
                    Xem kết quả
                  </Link>
                </div>
              </div>
            )}
          </section>
        </section>
      ) : null}
    </div>
  );
}