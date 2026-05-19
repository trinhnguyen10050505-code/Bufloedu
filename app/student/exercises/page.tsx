"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useCurrentUser } from "@/hook/useCurrentUser";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import PracticeMotivationPanel from "@/components/student/PracticeMotivationPanel";
import { buildAdaptiveRecommendation } from "@/lib/adaptive-learning";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { buildPracticeSet, calculateResult } from "@/lib/practice-system";
import {
  getRecentQuestionIds,
  saveLearningActivity,
  updateStudentAfterAssessment,
} from "@/lib/practice-progress";
import {
  getStudentLearningHistorySummary,
  StudentLearningHistorySummary,
} from "@/lib/student-history-reader";
import {
  PracticeMode,
  PracticeQuestion,
  StudentLevel,
} from "@/types/practice-final";
import ChemText from "@/lib/ChemText";

type AnswerMap = Record<string, string>;

const modeCards: Array<{
  mode: PracticeMode;
  title: string;
  desc: string;
  icon: string;
  color: string;
}> = [
  {
    mode: "recommended",
    title: "Bu đề xuất",
    desc: "Bu tự chọn câu hỏi theo mức hiện tại, phần yếu và dữ liệu học gần đây.",
    icon: "✨",
    color: "from-blue-50 to-cyan-50 border-blue-200",
  },
  {
    mode: "by_lesson",
    title: "Luyện theo bài",
    desc: "Chỉ luyện đúng một bài em chọn.",
    icon: "📘",
    color: "from-slate-50 to-white border-slate-200",
  },
  {
    mode: "by_level",
    title: "Luyện theo mức",
    desc: "Bu chọn câu theo mức học hiện tại.",
    icon: "🎯",
    color: "from-emerald-50 to-white border-emerald-200",
  },
  {
    mode: "weak_part",
    title: "Ôn phần yếu",
    desc: "Bu tập trung đúng phần em đang hổng.",
    icon: "🧩",
    color: "from-amber-50 to-white border-amber-200",
  },
];

function getQuestionLevelLabel(level: string) {
  if (level === "nhanbiet") return "Nhận biết";
  if (level === "thonghieu") return "Thông hiểu";
  if (level === "vandung") return "Vận dụng";
  return "Chưa phân mức";
}

function getQuestionLevelShortLabel(level: string) {
  if (level === "nhanbiet") return "NB";
  if (level === "thonghieu") return "TH";
  if (level === "vandung") return "VD";
  return "?";
}

function getQuestionLevelClass(level: string) {
  if (level === "nhanbiet") {
    return {
      badge: "bg-sky-100 text-sky-700 border-sky-200",
      dot: "bg-sky-500",
      panel: "bg-sky-50 border-sky-100 text-sky-700",
    };
  }

  if (level === "thonghieu") {
    return {
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
      panel: "bg-blue-50 border-blue-100 text-blue-700",
    };
  }

  if (level === "vandung") {
    return {
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      panel: "bg-amber-50 border-amber-100 text-amber-700",
    };
  }

  return {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    panel: "bg-rose-50 border-rose-100 text-rose-700",
  };
}

export default function ExercisesPage() {
  const searchParams = useSearchParams();
  const { profile } = useCurrentUser();

  const lessons = useMemo(() => getPracticeLessons(), []);

  const initialLesson =
    searchParams.get("lessonId") || lessons[0]?.lessonId || "lesson-2";

  const initialMode =
    (searchParams.get("mode") as PracticeMode) || "recommended";

  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [lessonId, setLessonId] = useState(initialLesson);
  const [summary, setSummary] =
    useState<StudentLearningHistorySummary | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [setCount, setSetCount] = useState(0);

  const studentLevel = (
    summary?.currentLevel ||
    profile?.currentLevel ||
    "trungbinh"
  ) as StudentLevel;

  const buMeta = getBuLevelMeta(studentLevel);

  const weakLessonIds = summary?.weakLessonIds || profile?.weakLessonIds || [];
  const recommendedLessonIds = profile?.recommendedLessonIds || [];

  useEffect(() => {
    async function load() {
      if (!profile?.uid) return;

      const [ids, historySummary] = await Promise.all([
        getRecentQuestionIds(profile.uid),
        getStudentLearningHistorySummary(profile.uid),
      ]);

      setRecentIds(ids);
      setSummary(historySummary);
    }

    void load();
  }, [profile?.uid]);

  function generate() {
    const set = buildPracticeSet({
      mode,
      studentLevel,
      lessonId: mode === "by_lesson" ? lessonId : undefined,
      weakLessonIds,
      recommendedLessonIds,
      recentQuestionIds: recentIds,
      limit: 12,
    });

    setQuestions(set);
    setAnswers({});
    setSubmitted(false);
    setMessage("");
    setSetCount((prev) => prev + 1);
  }

  const result = calculateResult(questions, answers);

  const recommendation = buildAdaptiveRecommendation({
    accuracy: result.accuracy,
    weakLessonIds: result.weakLessonIds,
    studentLevel,
    questions,
  });

  async function submit() {
    if (!profile?.uid || questions.length === 0) return;

    await saveLearningActivity({
      studentId: profile.uid,
      lessonId,
      activityType: "practice",
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
          ? "Bu gợi ý em học bài tiếp theo."
          : result.accuracy >= 50
          ? "Bu gợi ý luyện thêm bộ khác."
          : "Bu gợi ý quay lại lý thuyết và mindmap.",
    });

    setSubmitted(true);

    setMessage(
      `Bu đã lưu lượt luyện tập. Em đúng ${result.score}/${result.totalQuestions}, đạt ${result.accuracy}%.`
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 overflow-hidden pb-8 lg:space-y-8">
      <section className="mobile-safe-section relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-5 py-6 text-white shadow-lg sm:rounded-[40px] sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <p className="text-caption-pro text-blue-100">
            Luyện tập thông minh
          </p>

          <h1 className="text-hero-pro mt-3 max-w-4xl text-white">
            Mỗi chế độ luyện tập là một cách học riêng
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
            Bu không chỉ trộn câu theo bài. Bu còn phân tầng từ Nhận biết →
            Thông hiểu → Vận dụng để học đúng logic sư phạm.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            Mức hiện tại: {buMeta.label}
          </div>

          <div className="mt-5 max-w-4xl rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-100">
              Mục tiêu học tập của lượt luyện này
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-sm font-bold text-white">
                  1. Đi từ dễ đến khó
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-50">
                  Bu sắp câu theo Nhận biết → Thông hiểu → Vận dụng.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-sm font-bold text-white">
                  2. Phát hiện phần hổng
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-50">
                  Câu sai sẽ được dùng để gợi ý bài cần ôn lại.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-sm font-bold text-white">
                  3. Ôn đúng điểm vấp
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-50">
                  Nếu chưa chắc, Bu dẫn em về mindmap và lý thuyết đúng bài.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {modeCards.map((card) => {
          const active = mode === card.mode;

          return (
            <button
              key={card.mode}
              onClick={() => {
                setMode(card.mode);
                setQuestions([]);
                setAnswers({});
                setSubmitted(false);
                setMessage("");
              }}
              className={`mobile-safe-section rounded-[24px] border bg-gradient-to-br p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[30px] sm:p-6 ${
                active
                  ? `${card.color} ring-2 ring-blue-500`
                  : "from-white to-white border-slate-200"
              }`}
            >
              <div className="text-4xl">{card.icon}</div>

              <h3 className="mt-5 text-xl font-black leading-snug text-slate-800 sm:text-2xl">
                {card.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {card.desc}
              </p>
            </button>
          );
        })}
      </section>

      <section className="mobile-safe-section rounded-[28px] bg-white p-5 shadow-sm sm:rounded-[34px] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Chọn cách luyện tập
            </h2>

            {mode === "by_lesson" ? (
              <select
                value={lessonId}
                onChange={(event) => setLessonId(event.target.value)}
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg outline-none focus:border-blue-500"
              >
                {lessons.map((lesson) => (
                  <option key={lesson.lessonId} value={lesson.lessonId}>
                    Bài {lesson.lessonOrder}. {lesson.lessonTitle}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <button
            onClick={generate}
            className="btn-pro bg-blue-600 text-white hover:bg-blue-700"
          >
            Bu tạo bộ câu #{setCount + 1}
          </button>
        </div>
      </section>

      {questions.length > 0 ? (
        <section className="mobile-safe-section overflow-hidden rounded-[24px] bg-slate-900 p-4 text-white sm:rounded-[30px] sm:p-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {["nhanbiet", "thonghieu", "vandung"].map((level) => {
              const count = questions.filter((q) => q.level === level).length;
              const style = getQuestionLevelClass(level);

              return (
                <div
                  key={level}
                  className={`rounded-2xl border px-3 py-3 text-sm font-bold ${style.panel}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                    <span>{getQuestionLevelShortLabel(level)}</span>
                  </div>

                  <p className="mt-1 text-xs font-semibold opacity-80">
                    {getQuestionLevelLabel(level)}
                  </p>

                  <p className="mt-2 text-xl font-black">{count} câu</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/10 p-4">
            <p className="text-sm font-bold text-blue-100">
              Minh chứng sư phạm
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              Bộ câu được Bu sắp xếp theo thứ tự:
              <span className="font-bold text-white">
                {" "}
                Nhận biết → Thông hiểu → Vận dụng
              </span>
              .
            </p>
          </div>
        </section>
      ) : null}

      {questions.length === 0 ? (
        <section className="mobile-safe-section rounded-[28px] bg-white p-6 text-center shadow-sm sm:rounded-[34px] sm:p-10">
          <p className="text-5xl">🐃</p>

          <h2 className="mt-4 text-2xl font-bold text-slate-800">
            Chọn chế độ rồi để Bu tạo bộ câu phù hợp
          </h2>
        </section>
      ) : (
        <section className="space-y-5">
          {questions.map((question, index) => {
            const selected = answers[question.id];
            const isCorrect = selected === question.correctOptionId;

            return (
              <article
                key={question.id}
                className="mobile-safe-section rounded-[24px] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
                          getQuestionLevelClass(question.level).badge
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            getQuestionLevelClass(question.level).dot
                          }`}
                        />
                        Câu {index + 1} ·{" "}
                        {getQuestionLevelLabel(question.level)}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {question.lessonTitle}
                      </span>
                    </div>

                    <h2 className="mt-3 text-base font-black leading-7 text-slate-800 sm:text-lg">
                      <ChemText>{question.question}</ChemText>
                    </h2>
                  </div>

                  {submitted ? (
                    <span
                      className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
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
                    const correct =
                      submitted && option.id === question.correctOptionId;
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
                        className={`rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition sm:py-4 ${
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
              </article>
            );
          })}

          <section className="sticky bottom-[96px] z-20 rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur lg:bottom-4 lg:rounded-[28px]">
            {!submitted ? (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-medium text-slate-600">
                  Practice được phân tầng theo trình tự từ dễ → khó.
                </p>

                <button
                  onClick={submit}
                  className="btn-pro bg-blue-600 text-white hover:bg-blue-700"
                >
                  Nộp lượt luyện tập
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-slate-700">
                  {message}
                </p>

                <div className="overflow-hidden rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-white shadow-sm">
                      🐃
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                        Bu tổng kết lộ trình học tiếp theo
                      </p>

                      <h3 className="mt-2 text-2xl font-black leading-tight text-slate-900">
                        {recommendation.levelMessage}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {recommendation.strategy}
                      </p>

                      {recommendation.weakestLesson ? (
                        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
                            Bài Bu khuyên em nên ôn lại
                          </p>

                          <p className="mt-2 text-lg font-black text-slate-900">
                            {recommendation.weakestLessonTitle}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            Đây là bài em đang vấp nhiều nhất trong lượt luyện
                            tập này.
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
                        {recommendation.shouldReviewMindmap ? (
                          <Link
                            href={`/student/mindmap?lessonId=${
                              recommendation.weakestLesson || lessonId
                            }`}
                            className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600"
                          >
                            Ôn bằng mindmap
                          </Link>
                        ) : null}

                        {recommendation.shouldPracticeAgain ? (
                          <button
                            onClick={generate}
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                          >
                            Luyện thêm bộ khác
                          </button>
                        ) : null}

                        {recommendation.shouldDoQuickTest ? (
                          <Link
                            href={`/student/lessons/${lessonId}/quick-test`}
                            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                          >
                            Làm quick-test
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <PracticeMotivationPanel
                  score={result.score}
                  totalQuestions={result.totalQuestions}
                  accuracy={result.accuracy}
                  level={result.level}
                  weakLessonId={result.weakLessonIds[0] || lessonId}
                  onGenerateAgain={generate}
                />
              </div>
            )}
          </section>
        </section>
      )}
    </div>
  );
}