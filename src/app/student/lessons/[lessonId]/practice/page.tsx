"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { lessonsContent } from "@/data/lessons.content";
import { questionBank } from "@/data/question-bank";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { saveStudentProgress } from "@/lib/progress";
import { StudentLevel } from "@/types";
import BuChatWidget from "@/components/student/BuChatWidget";

type PracticeFilter = "tatca" | "nhanbiet" | "thonghieu" | "vandung";
type AnswerMap = Record<string, string>;

function mapAccuracyToLevel(accuracy: number): StudentLevel {
  if (accuracy >= 80) return "gioi";
  if (accuracy >= 50) return "kha";
  return "trungbinh";
}

export default function LessonPracticePage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const lesson = lessonsContent[lessonId];

  const [filter, setFilter] = useState<PracticeFilter>("tatca");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const lessonQuestions = useMemo(() => {
    const all = questionBank.filter((q) => q.lessonId === lessonId);

    if (filter === "tatca") return all;
    return all.filter((q) => q.level === filter);
  }, [lessonId, filter]);

  const score = lessonQuestions.reduce((total, question) => {
    return total + (answers[question.id] === question.correctAnswerId ? 1 : 0);
  }, 0);

  const accuracy =
    lessonQuestions.length > 0
      ? Math.round((score / lessonQuestions.length) * 100)
      : 0;

  const derivedLevel = mapAccuracyToLevel(accuracy);
  const buMeta = getBuLevelMeta(derivedLevel);

  const wrongQuestions = lessonQuestions.filter(
    (q) => answers[q.id] && answers[q.id] !== q.correctAnswerId
  );

  const resetPractice = (nextFilter?: PracticeFilter) => {
    if (nextFilter) setFilter(nextFilter);
    setAnswers({});
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    try {
      setIsSaving(true);

      await saveStudentProgress({
        studentId: "demo-student-id",
        lessonId,
        activityType: "practice",
        score,
        totalQuestions: lessonQuestions.length,
        accuracy,
        level: derivedLevel,
      });
    } catch (error) {
      console.error("Lưu tiến độ practice thất bại:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Không tìm thấy bài học</h1>
          <p className="mt-2 text-slate-600">
            Hãy quay lại dashboard và chọn lại bài học.
          </p>
        </div>
      </div>
    );
  }

  const filterLabel =
    filter === "tatca"
      ? "Tất cả mức"
      : filter === "nhanbiet"
      ? "Nhận biết"
      : filter === "thonghieu"
      ? "Thông hiểu"
      : "Vận dụng";

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* HEADER */}
          <section className="overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
              Luyện tập theo bài
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{lesson.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-blue-50">
              Bu sẽ cùng em luyện tập theo từng mức độ để hiểu bài chắc hơn,
              quen dạng bài hơn và biết mình cần ôn thêm ở đâu.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/student/lessons/${lessonId}`}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Quay lại lý thuyết
              </Link>

              <Link
                href={`/student/lessons/${lessonId}/quick-test`}
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Sang kiểm tra nhanh
              </Link>
            </div>
          </section>

          {/* TOOLBAR */}
          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Chế độ luyện tập</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  Chọn mức độ em muốn luyện
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Bu chia bài tập theo đúng cấu trúc: Nhận biết → Thông hiểu → Vận dụng.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {(["tatca", "nhanbiet", "thonghieu", "vandung"] as PracticeFilter[]).map((item) => {
                  const label =
                    item === "tatca"
                      ? "Tất cả"
                      : item === "nhanbiet"
                      ? "Nhận biết"
                      : item === "thonghieu"
                      ? "Thông hiểu"
                      : "Vận dụng";

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => resetPractice(item)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        filter === item
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Mức đang chọn</p>
                <p className="mt-2 text-xl font-bold text-slate-800">{filterLabel}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Số câu hiện có</p>
                <p className="mt-2 text-xl font-bold text-slate-800">
                  {lessonQuestions.length} câu
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Mục tiêu</p>
                <p className="mt-2 text-xl font-bold text-slate-800">
                  Hiểu bài thật chắc
                </p>
              </div>
            </div>
          </section>

          {lessonQuestions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = selectedAnswer === question.correctAnswerId;

            const levelBadgeClass =
              question.level === "nhanbiet"
                ? "bg-amber-100 text-amber-700"
                : question.level === "thonghieu"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700";

            const levelLabel =
              question.level === "nhanbiet"
                ? "Nhận biết"
                : question.level === "thonghieu"
                ? "Thông hiểu"
                : "Vận dụng";

            return (
              <section key={question.id} className="rounded-[28px] bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Câu {index + 1}</p>
                    <h3 className="mt-1 text-lg font-bold leading-7 text-slate-800">
                      {question.question}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${levelBadgeClass}`}
                  >
                    {levelLabel}
                  </span>
                </div>

                <div className="grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const showCorrect = submitted && option.id === question.correctAnswerId;
                    const showWrong =
                      submitted && isSelected && option.id !== question.correctAnswerId;

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
                          showCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : showWrong
                            ? "border-red-500 bg-red-50 text-red-700"
                            : isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-semibold">{option.id}.</span> {option.text}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                    <p
                      className={`text-sm font-semibold ${
                        isCorrect ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "Bu thấy em làm đúng câu này." : "Bu thấy câu này em cần xem lại."}
                    </p>

                    <p className="mt-2 text-slate-700">
                      <span className="font-semibold">Đáp án đúng:</span>{" "}
                      {question.correctAnswerId}
                    </p>

                    <p className="mt-2 leading-7 text-slate-600">
                      <span className="font-semibold text-slate-800">Bu giải thích:</span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                )}
              </section>
            );
          })}

          {/* ACTIONS */}
          {lessonQuestions.length > 0 && (
            <section className="sticky bottom-4 z-10">
              <div className="rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Tiến trình hiện tại</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {submitted
                        ? `Bu ghi nhận em đúng ${score}/${lessonQuestions.length} câu`
                        : `Em đã chọn ${Object.keys(answers).length}/${lessonQuestions.length} câu`}
                    </p>
                    {submitted && isSaving && (
                      <p className="mt-1 text-sm text-blue-600">Bu đang lưu tiến độ của em...</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!submitted ? (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Bu xem kết quả cho em
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => resetPractice(filter)}
                          className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
                        >
                          Làm lại
                        </button>

                        <Link
                          href={`/student/lessons/${lessonId}/quick-test`}
                          className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Sang kiểm tra nhanh
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* RESULT SUMMARY */}
          {submitted && lessonQuestions.length > 0 && (
            <section className="rounded-[28px] bg-white p-8 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Kết quả luyện tập</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                Bu thấy em đúng {score}/{lessonQuestions.length} câu ({accuracy}%)
              </h2>

              <div className={`mt-5 rounded-3xl border p-5 ${buMeta.cardClass}`}>
                <p className="font-semibold text-slate-800">{buMeta.label}</p>
                <p className="mt-2 leading-7 text-slate-700">{buMeta.shortDescription}</p>
              </div>
            </section>
          )}
        </div>
      </div>

      <BuChatWidget
        lessonTitle={lesson.title}
        currentLevelLabel={buMeta.label}
        weakTopics={wrongQuestions.length > 0 ? [lesson.title] : []}
      />
    </>
  );
}