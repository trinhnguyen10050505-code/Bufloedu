"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  buildQuickTestSet,
  calculateResult,
} from "@/lib/practice-system";
import {
  hasDoneQuickTest,
  savePracticeProgress,
  updateStudentAfterAssessment,
} from "@/lib/practice-progress";
import { PracticeQuestion } from "@/types/practice-final";

type AnswerMap = Record<string, string>;

export default function QuickTestPage() {
  const params = useParams();
  const lessonId = String(params.lessonId || "");
  const { profile, loading: profileLoading } = useCurrentUser();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    async function check() {
      if (!profile?.uid || !lessonId) {
        setCheckingStatus(false);
        return;
      }

      try {
        const done = await hasDoneQuickTest({
          studentId: profile.uid,
          lessonId,
        });

        setAlreadyDone(done);
      } catch (error) {
        console.error("Kiểm tra quick-test thất bại:", error);
      } finally {
        setCheckingStatus(false);
      }
    }

    void check();
  }, [profile?.uid, lessonId]);

  const lessonTitle = useMemo(() => {
    const sample = questions[0];
    return sample?.lessonTitle || lessonId;
  }, [questions, lessonId]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const tempResult = useMemo(() => {
    return calculateResult(questions, answers);
  }, [questions, answers]);

  const buMeta = getBuLevelMeta(tempResult.level);

  function handleStartQuickTest() {
    const set = buildQuickTestSet(lessonId);

    setQuestions(set);
    setAnswers({});
    setSubmitted(false);
    setResultMessage("");
    setConfirmed(true);
  }

  async function handleSubmit() {
    if (!profile?.uid || questions.length === 0 || isSaving) return;

    if (!allAnswered) {
      setResultMessage("Bu thấy em vẫn còn câu chưa chọn. Em kiểm tra lại trước khi nộp nhé.");
      return;
    }

    const result = calculateResult(questions, answers);

    try {
      setIsSaving(true);

      await savePracticeProgress({
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
            ? "Em đã nắm bài khá chắc. Bu gợi ý em chuyển sang bài tiếp theo hoặc luyện câu vận dụng."
            : result.accuracy >= 50
            ? "Em đã hiểu một phần. Bu gợi ý luyện thêm một bộ câu khác để chắc hơn."
            : "Em nên quay lại E-learning, xem lý thuyết và luyện tập thêm trước khi học bài mới.",
      });

      setSubmitted(true);
      setAlreadyDone(true);

      setResultMessage(
        `Bu đã lưu quick-test. Em đúng ${result.score}/${result.totalQuestions} câu, đạt ${result.accuracy}%.`
      );
    } catch (error) {
      console.error("Lưu quick-test thất bại:", error);
      setResultMessage("Bu chưa lưu được kết quả. Em thử lại sau nhé.");
    } finally {
      setIsSaving(false);
    }
  }

  if (profileLoading || checkingStatus) {
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
          Quick-test dùng để cập nhật mức học nên Bu cần biết em là ai để lưu kết quả.
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
            Em vẫn có thể luyện tập nhiều lần với các bộ câu hỏi được xáo trộn.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/student/exercises?lessonId=${lessonId}&mode=by_lesson`}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Luyện tập thêm
            </Link>

            <Link
              href={`/student/lessons/${lessonId}`}
              className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
            >
              Ôn lại bài học
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
            Quick-test 1 lần
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Em đã chắc chắn muốn làm quick-test bài này chưa?
          </h1>

          <p className="mt-4 max-w-3xl text-blue-50">
            Bài quick-test này chỉ được làm một lần cho mỗi bài để cập nhật mức học
            của em. Nếu chưa chắc, Bu khuyên em luyện thêm trước.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/student/exercises?lessonId=${lessonId}&mode=by_lesson`}
            className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-3xl">✍️</p>
            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Luyện thêm trước
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Practice được làm nhiều lần và Bu sẽ xáo trộn bộ câu hỏi cho em.
            </p>
          </Link>

          <button
            onClick={handleStartQuickTest}
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
            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Ôn lại bài học
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Xem lại E-learning và lý thuyết trước khi vào bài kiểm tra.
            </p>
          </Link>
        </section>

        <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-700">Bu nhắc nhỏ</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Quick-test dùng để đánh giá mức học gần nhất. Nếu em chỉ muốn luyện,
            hãy chọn “Luyện thêm trước”, không nên dùng quick-test để thử nhiều lần.
          </p>
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
          Bu chưa tìm thấy câu hỏi trong dữ liệu mới nhất cho bài này. Em kiểm tra lại
          file sinh `practice-bank.generated.ts`.
        </p>
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
          Bu sẽ dùng kết quả quick-test này để cập nhật mức học của em và gợi ý bước
          tiếp theo phù hợp hơn.
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
            <p className="text-sm text-blue-100">Bài học</p>
            <p className="mt-1 text-base font-semibold">{lessonTitle}</p>
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
                    Câu {index + 1}. {question.question}
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
                    {isCorrect ? "Đúng" : "Cần xem lại"}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;
                  const correct = submitted && option.id === question.correctOptionId;
                  const wrong =
                    submitted &&
                    isSelected &&
                    option.id !== question.correctOptionId;

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
              onClick={handleSubmit}
              disabled={isSaving || !allAnswered}
              className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? "Bu đang lưu..." : "Nộp quick-test"}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Kết quả quick-test
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                Bu thấy em đúng {tempResult.score}/{tempResult.totalQuestions} câu
                ({tempResult.accuracy}%)
              </h2>
            </div>

            <div className={`rounded-3xl border p-5 ${buMeta.cardClass}`}>
              <p className="font-semibold text-slate-800">{buMeta.label}</p>
              <p className="mt-2 text-slate-700">{buMeta.shortDescription}</p>
            </div>

            {resultMessage ? (
              <p className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-slate-700">
                {resultMessage}
              </p>
            ) : null}

            <div className="grid gap-3 md:grid-cols-3">
              <Link
                href="/student/results"
                className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Xem kết quả
              </Link>

              <Link
                href={`/student/exercises?lessonId=${lessonId}&mode=by_lesson`}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-200"
              >
                Luyện thêm bài này
              </Link>

              <Link
                href="/student/lessons"
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white hover:bg-emerald-700"
              >
                Học bài tiếp theo
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}