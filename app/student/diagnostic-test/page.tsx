"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import { buildDiagnosticSet, calculateResult } from "@/lib/practice-system";
import { getBuLevelLabel } from "@/lib/Bu-level";
import {
  savePracticeProgress,
  updateStudentAfterAssessment,
} from "@/lib/practice-progress";
import { PracticeQuestion } from "@/types/practice-final";

export default function DiagnosticTestPage() {
  const { profile } = useCurrentUser();
  const lessons = useMemo(() => getPracticeLessons(), []);

  const [startLessonOrder, setStartLessonOrder] = useState(lessons[0]?.lessonOrder || 2);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  function generateDiagnostic() {
    setQuestions(buildDiagnosticSet(startLessonOrder));
    setAnswers({});
    setSubmitted(false);
    setMessage("");
  }

  async function submit() {
    if (!profile?.uid || questions.length === 0) return;

    const result = calculateResult(questions, answers);

    await savePracticeProgress({
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
        result.accuracy >= 75
          ? "Em có nền tốt. Bu gợi ý bắt đầu học bài mới và làm quick-test sau bài."
          : "Bu thấy em nên ôn lại các bài trước rồi mới học bài mới.",
    });

    setSubmitted(true);
    setMessage(
      `Bu đã chẩn đoán xong. Em đạt ${result.accuracy}%, mức hiện tại: ${getBuLevelLabel(result.level)}.`
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
          Nếu em muốn học từ bài nào, Bu sẽ lấy câu hỏi của các bài trước đó để
          xem em đã đủ nền chưa. Nếu bắt đầu từ bài đầu, Bu sẽ kiểm tra phần nền
          dễ hơn trong dữ liệu hiện có.
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

        <button
          onClick={generateDiagnostic}
          className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Bu tạo bài chẩn đoán
        </button>
      </section>

      {questions.length > 0 ? (
        <section className="space-y-5">
          {questions.map((question, index) => (
            <article key={question.id} className="rounded-[30px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">
                {question.lessonTitle} · {question.level}
              </p>
              <h2 className="mt-2 text-lg font-bold leading-7 text-slate-800">
                Câu {index + 1}. {question.question}
              </h2>

              <div className="mt-5 grid gap-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: option.id,
                      }))
                    }
                    className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                      answers[question.id] === option.id
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <b>{option.id}.</b> {option.text}
                  </button>
                ))}
              </div>
            </article>
          ))}

          <div className="rounded-[30px] bg-white p-5 shadow-sm">
            {!submitted ? (
              <button
                onClick={submit}
                className="w-full rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700"
              >
                Nộp bài chẩn đoán
              </button>
            ) : (
              <div>
                <p className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-slate-700">
                  {message}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/student/lessons"
                    className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Vào học bài
                  </Link>
                  <Link
                    href="/student/exercises"
                    className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Luyện phần Bu gợi ý
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}