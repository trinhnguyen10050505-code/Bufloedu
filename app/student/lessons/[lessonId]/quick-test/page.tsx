"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { buildQuickTestSet, calculateResult } from "@/lib/practice-system";
import {
  hasDoneQuickTest,
  saveLearningActivity,
  updateStudentAfterAssessment,
} from "@/lib/practice-progress";
import { PracticeQuestion } from "@/types/practice-final";
import ChemText from "@/lib/ChemText";

type AnswerMap = Record<string, string>;

export default function QuickTestPage() {
  const params = useParams();
  const lessonId = String(params.lessonId || "");

  const { profile, loading: userLoading } = useCurrentUser();

  const [checking, setChecking] = useState(true);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkStatus() {
      if (!profile?.uid || !lessonId) {
        setChecking(false);
        return;
      }

      try {
        const done = await hasDoneQuickTest({
          studentId: profile.uid,
          lessonId,
        });

        setAlreadyDone(done);
      } catch (error) {
        console.error("Lỗi kiểm tra quick-test:", error);
      } finally {
        setChecking(false);
      }
    }

    void checkStatus();
  }, [profile?.uid, lessonId]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const result = useMemo(() => {
    return calculateResult(questions, answers);
  }, [questions, answers]);

  const buMeta = getBuLevelMeta(result.level);
  const lessonTitle = questions[0]?.lessonTitle || lessonId;

  function startQuickTest() {
    const set = buildQuickTestSet(lessonId);

    setQuestions(set);
    setAnswers({});
    setSubmitted(false);
    setMessage("");
    setConfirmed(true);
  }

  async function submitQuickTest() {
    if (!profile?.uid || questions.length === 0 || saving) return;

    if (!allAnswered) {
      setMessage("Bu thấy em vẫn còn câu chưa chọn. Em kiểm tra lại trước khi nộp nhé.");
      return;
    }

    try {
      setSaving(true);

      await saveLearningActivity({
        studentId: profile.uid,
        lessonId,
        activityType: "quick_test",
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
          result.weakLessonIds.length > 0 ? result.weakLessonIds : [lessonId],
        lastAccuracy: result.accuracy,
        nextAction:
          result.accuracy >= 80
            ? "Em đã nắm bài khá chắc. Bu gợi ý em học bài tiếp theo hoặc luyện thêm câu vận dụng."
            : result.accuracy >= 50
            ? "Em đã hiểu phần lớn bài. Bu gợi ý em luyện thêm một bộ câu mới và xem mindmap để chắc hơn."
            : "Bu thấy em còn hổng kiến thức. Em nên quay lại E-learning, lý thuyết và mindmap của bài này trước.",
      });

      setSubmitted(true);
      setAlreadyDone(true);

      setMessage(
        `Bu đã lưu quick-test. Em đúng ${result.score}/${result.totalQuestions} câu, đạt ${result.accuracy}%.`
      );
    } catch (error) {
      console.error("Lưu quick-test thất bại:", error);
      setMessage("Bu chưa lưu được kết quả. Em thử lại sau nhé.");
    } finally {
      setSaving(false);
    }
  }

  if (userLoading || checking) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        <p className="text-slate-600">Bu đang kiểm tra trạng thái quick-test...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Em cần đăng nhập</h1>
        <p className="mt-3 text-slate-600">
          Quick-test dùng để cập nhật mức học nên Bu cần lưu kết quả vào hồ sơ của em.
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

  if (alreadyDone && !submitted) {
    return (
      <div className="space-y-6">
        <section className="rounded-[36px] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Quick-test đã hoàn thành
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-800">
            Em đã làm quick-test bài này rồi
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Quick-test chỉ được làm một lần cho mỗi bài để kết quả nâng mức Bu công bằng.
            Em vẫn có thể luyện tập không giới hạn với nhiều bộ câu hỏi được trộn khác nhau.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/student/exercises?mode=by_lesson&lessonId=${lessonId}`}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Luyện tập thêm bài này
            </Link>

            <Link
              href={`/student/mindmap?lessonId=${lessonId}`}
              className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
            >
              Ôn bằng mindmap
            </Link>

            <Link
              href="/student/results"
              className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Xem kết quả
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!confirmed) {
    return (
      <div className="space-y-6">
        <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            Quick-test một lần
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Em chắc chắn muốn làm quick-test bài này chưa?
          </h1>

          <p className="mt-4 max-w-3xl text-blue-50">
            Quick-test là bài kiểm tra nhanh sau khi học xong một bài. Bu dùng kết quả
            này để cập nhật mức học gần nhất: Trung bình, Khá hoặc Giỏi.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/student/exercises?mode=by_lesson&lessonId=${lessonId}`}
            className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-3xl">✍️</p>
            <h2 className="mt-4 text-xl font-bold text-slate-800">Luyện thêm trước</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Practice có thể làm nhiều lần. Bu sẽ trộn bộ câu mới để em luyện chắc hơn.
            </p>
          </Link>

          <button
            onClick={startQuickTest}
            className="rounded-[28px] bg-blue-600 p-6 text-left text-white shadow-sm transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-md"
          >
            <p className="text-3xl">⚡</p>
            <h2 className="mt-4 text-xl font-bold">Tôi đã sẵn sàng</h2>
            <p className="mt-2 text-sm leading-6 text-blue-50">
              Bắt đầu quick-test và dùng kết quả để cập nhật mức Bu.
            </p>
          </button>

          <Link
            href={`/student/lessons/${lessonId}`}
            className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-3xl">🎥</p>
            <h2 className="mt-4 text-xl font-bold text-slate-800">Ôn lại bài học</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Xem lại E-learning, lý thuyết và phần trọng tâm trước khi kiểm tra.
            </p>
          </Link>
        </section>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">
          Bài này chưa có câu hỏi quick-test
        </h1>
        <p className="mt-3 text-slate-600">
          Bu chưa tìm thấy câu hỏi cho <b>{lessonId}</b>. Kiểm tra lại file{" "}
          <code>src/data/practice-bank.generated.ts</code>.
        </p>

        <Link
          href="/student/lessons"
          className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Quay lại danh sách bài học
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Quick-test
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Làm cẩn thận nhé, bài này chỉ tính một lần
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Bài: {lessonTitle}. Bu sẽ dùng kết quả này để cập nhật mức học và gợi ý
          bước học tiếp theo.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white/15 p-4">
            <p className="text-sm text-blue-100">Số câu</p>
            <p className="mt-1 text-3xl font-bold">{questions.length}</p>
          </div>

          <div className="rounded-3xl bg-white/15 p-4">
            <p className="text-sm text-blue-100">Đã chọn</p>
            <p className="mt-1 text-3xl font-bold">
              {answeredCount}/{questions.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white/15 p-4">
            <p className="text-sm text-blue-100">Mức tạm tính</p>
            <p className="mt-1 text-xl font-bold">{buMeta.label}</p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctOptionId;

          return (
            <article
              key={question.id}
              className="rounded-[30px] bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    {question.lessonTitle} · {question.level}
                  </p>

                  <h2 className="mt-2 text-lg font-bold leading-7 text-slate-800">
                    Câu {index + 1}. <ChemText>{question.question}</ChemText>
                  </h2>
                </div>

                {submitted ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isCorrect ? "Đúng" : "Cần ôn lại"}
                  </span>
                ) : null}
              </div>

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
                      <ChemText>{option.text}</ChemText>
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
                    <span className="font-semibold">
                      {question.correctOptionId}
                    </span>
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="sticky bottom-4 z-20 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        {!submitted ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-slate-600">
              Bu nhắc: hãy chọn đủ {questions.length} câu trước khi nộp.
            </p>

            <button
              onClick={submitQuickTest}
              disabled={saving || !allAnswered}
              className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Bu đang lưu..." : "Nộp quick-test"}
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
                href="/student/results"
                className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Xem kết quả
              </Link>

              <Link
                href={`/student/exercises?mode=by_lesson&lessonId=${lessonId}`}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-200"
              >
                Luyện thêm bài này
              </Link>

              <Link
                href={`/student/mindmap?lessonId=${lessonId}`}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white hover:bg-emerald-700"
              >
                Ôn bằng mindmap
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}