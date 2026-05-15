"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  buildPracticeSet,
  calculateResult,
} from "@/lib/practice-system";
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
    desc: "Chỉ luyện đúng một bài em chọn, phù hợp khi muốn ôn một bài cụ thể.",
    icon: "📘",
    color: "from-slate-50 to-white border-slate-200",
  },
  {
    mode: "by_level",
    title: "Luyện theo mức",
    desc: "Không phụ thuộc bài. Bu chọn câu theo mức Bu Chăm chỉ, Vững vàng hoặc Thông thái.",
    icon: "🎯",
    color: "from-emerald-50 to-white border-emerald-200",
  },
  {
    mode: "weak_part",
    title: "Ôn phần yếu",
    desc: "Không phụ thuộc bài đang chọn. Bu chỉ tập trung vào phần em từng sai.",
    icon: "🧩",
    color: "from-amber-50 to-white border-amber-200",
  },
];

function getModeGuide(mode: PracticeMode, levelLabel: string) {
  if (mode === "recommended") {
    return {
      title: "Bu đang tự đề xuất bộ câu cho em",
      text: `Bu ưu tiên phần em từng sai, bài được đề xuất và mức hiện tại là ${levelLabel}. Em không cần chọn bài, Bu sẽ tự chọn câu phù hợp.`,
    };
  }

  if (mode === "by_lesson") {
    return {
      title: "Em đang luyện đúng bài đã chọn",
      text: "Chế độ này chỉ lấy câu hỏi trong bài em chọn ở ô bên dưới. Phù hợp khi em muốn ôn kỹ một bài cụ thể.",
    };
  }

  if (mode === "by_level") {
    return {
      title: "Bu đang luyện theo mức hiện tại của em",
      text: `Chế độ này không phụ thuộc bài đang chọn. Bu lấy câu trong toàn bộ ngân hàng câu hỏi theo mức ${levelLabel}.`,
    };
  }

  return {
    title: "Bu đang tập trung vào phần em còn yếu",
    text: "Chế độ này không phụ thuộc bài đang chọn. Bu ưu tiên các bài em từng sai trong practice hoặc quick-test.",
  };
}

export default function ExercisesPage() {
  const searchParams = useSearchParams();
  const { profile } = useCurrentUser();

  const lessons = useMemo(() => getPracticeLessons(), []);
  const initialLesson =
    searchParams.get("lessonId") || lessons[0]?.lessonId || "lesson-2";
  const initialMode = (searchParams.get("mode") as PracticeMode) || "recommended";

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

  const studentLevel = (summary?.currentLevel ||
    profile?.currentLevel ||
    "trungbinh") as StudentLevel;

  const buMeta = getBuLevelMeta(studentLevel);
  const currentLesson = lessons.find((lesson) => lesson.lessonId === lessonId);

  const weakLessonIds = summary?.weakLessonIds || profile?.weakLessonIds || [];
  const recommendedLessonIds = profile?.recommendedLessonIds || [];

  const modeGuide = getModeGuide(mode, buMeta.label);

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
    const rotatedRecentIds =
      recentIds.length > 0
        ? recentIds.slice(Math.floor(Math.random() * recentIds.length))
        : [];

    const set = buildPracticeSet({
      mode,
      studentLevel,
      lessonId: mode === "by_lesson" ? lessonId : undefined,
      weakLessonIds,
      recommendedLessonIds,
      recentQuestionIds: rotatedRecentIds,
      limit: 12,
    });

    setQuestions(set);
    setAnswers({});
    setSubmitted(false);
    setMessage("");
    setSetCount((prev) => prev + 1);
  }

  const result = calculateResult(questions, answers);

  async function submit() {
    if (!profile?.uid || questions.length === 0) return;

    await saveLearningActivity({
      studentId: profile.uid,
      lessonId: mode === "by_lesson" ? lessonId : "adaptive-practice",
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
          ? "Em làm rất tốt. Bu gợi ý em học bài tiếp theo hoặc làm quick-test nếu chưa làm."
          : result.accuracy >= 50
          ? "Em đã hiểu một phần. Bu gợi ý luyện thêm bộ câu mới và xem mindmap."
          : "Em đang hổng kiến thức. Bu gợi ý quay lại lý thuyết và mindmap trước khi luyện tiếp.",
    });

    setSubmitted(true);
    setMessage(
      `Bu đã lưu lượt luyện tập. Em đúng ${result.score}/${result.totalQuestions}, đạt ${result.accuracy}%.`
    );
  }

  const hasWeakness = submitted && result.accuracy < 60;
  const shouldReview = submitted && result.accuracy >= 60 && result.accuracy < 80;
  const shouldAdvance = submitted && result.accuracy >= 80;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            Luyện tập thông minh
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
            Mỗi chế độ luyện tập là một cách học riêng
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-blue-50">
            Bu không chỉ trộn câu theo bài. Bu còn tự đề xuất, luyện theo mức và ôn phần yếu
            dựa trên dữ liệu học thật của em.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            Mức hiện tại: {buMeta.label}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
              className={`rounded-[30px] border bg-gradient-to-br p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                active
                  ? `${card.color} ring-2 ring-blue-500`
                  : "from-white to-white border-slate-200"
              }`}
            >
              <div className="text-4xl">{card.icon}</div>

              <h3 className="mt-5 text-2xl font-bold text-slate-800">
                {card.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {card.desc}
              </p>

              {active ? (
                <div className="mt-5 rounded-2xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white">
                  Đang chọn
                </div>
              ) : null}
            </button>
          );
        })}
      </section>

      <section className="rounded-[34px] bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-600">{modeGuide.title}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              {mode === "by_lesson"
                ? "Chọn bài muốn luyện"
                : "Bu sẽ tự chọn câu hỏi, không cần chọn bài"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {modeGuide.text}
            </p>

            {mode === "by_lesson" ? (
              <select
                value={lessonId}
                onChange={(event) => setLessonId(event.target.value)}
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg outline-none focus:border-blue-500"
              >
                {lessons.map((lesson) => (
                  <option key={lesson.lessonId} value={lesson.lessonId}>
                    Bài {lesson.lessonOrder}. {lesson.lessonTitle} ({lesson.total} câu)
                  </option>
                ))}
              </select>
            ) : (
              <div className="mt-5 rounded-3xl bg-blue-50 p-5">
                <p className="font-semibold text-blue-700">
                  Bu đang dùng dữ liệu cá nhân hóa
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Phần yếu:{" "}
                  {weakLessonIds.length > 0
                    ? weakLessonIds.join(", ")
                    : "chưa có dữ liệu yếu rõ ràng"}{" "}
                  · Số câu đã làm gần đây: {recentIds.length}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={generate}
            className="rounded-2xl bg-blue-600 px-7 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Bu tạo bộ câu #{setCount + 1}
          </button>
        </div>
      </section>

      {questions.length > 0 ? (
        <section className="rounded-[30px] bg-slate-900 p-5 text-white">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Chế độ</p>
              <p className="mt-1 font-bold">
                {modeCards.find((item) => item.mode === mode)?.title}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Số câu</p>
              <p className="mt-1 font-bold">{questions.length}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Bài xuất hiện</p>
              <p className="mt-1 font-bold">
                {new Set(questions.map((q) => q.lessonId)).size}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Mức Bu</p>
              <p className="mt-1 font-bold">{buMeta.label}</p>
            </div>
          </div>
        </section>
      ) : null}

      {questions.length === 0 ? (
        <section className="rounded-[34px] bg-white p-10 text-center shadow-sm">
          <p className="text-5xl">🐃</p>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">
            Chọn chế độ rồi để Bu tạo bộ câu phù hợp
          </h2>
          <p className="mt-3 text-slate-600">
            Mỗi lần bấm tạo bộ câu, Bu sẽ cố gắng tránh lặp lại câu em vừa làm gần đây.
          </p>
        </section>
      ) : (
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
                      {isCorrect ? "Đúng" : "Cần xem lại"}
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
                  Bu nhắc: Practice làm được nhiều lần, mỗi lần có thể là một bộ câu khác.
                </p>

                <button
                  onClick={submit}
                  className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
                >
                  Nộp lượt luyện tập
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-slate-700">
                  {message}
                </p>

                {hasWeakness ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <p className="font-semibold text-amber-700">
                      Bu phát hiện em đang hổng kiến thức
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Bu khuyên em quay lại lý thuyết và mindmap trước, sau đó luyện một bộ khác.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/student/mindmap?lessonId=${result.weakLessonIds[0] || lessonId}`}
                        className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600"
                      >
                        Ôn bằng mindmap
                      </Link>

                      <button
                        onClick={generate}
                        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Bu tạo bộ khác
                      </button>
                    </div>
                  </div>
                ) : shouldReview ? (
                  <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                    <p className="font-semibold text-blue-700">
                      Em đã hiểu một phần
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Bu gợi ý em luyện thêm một bộ câu khác để chắc hơn.
                    </p>

                    <button
                      onClick={generate}
                      className="mt-4 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Luyện thêm bộ khác
                    </button>
                  </div>
                ) : shouldAdvance ? (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="font-semibold text-emerald-700">
                      Em đã khá chắc kiến thức
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Bu gợi ý em chuyển sang bài học tiếp theo hoặc làm quick-test nếu chưa làm.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/student/lessons"
                        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Học bài tiếp theo
                      </Link>

                      {mode === "by_lesson" ? (
                        <Link
                          href={`/student/lessons/${lessonId}/quick-test`}
                          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Làm quick-test
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </section>
      )}
    </div>
  );
}