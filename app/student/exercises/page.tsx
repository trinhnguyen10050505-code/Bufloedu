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
import { PracticeMode, PracticeQuestion, StudentLevel } from "@/types/practice-final";

const modeCards: Array<{
  mode: PracticeMode;
  title: string;
  desc: string;
  icon: string;
}> = [
  {
    mode: "recommended",
    title: "Bu đề xuất",
    desc: "Bu tự chọn bài và mức phù hợp nhất với em.",
    icon: "✨",
  },
  {
    mode: "by_lesson",
    title: "Luyện theo bài",
    desc: "Chọn một bài cụ thể, trộn câu nhiều lần.",
    icon: "📘",
  },
  {
    mode: "by_level",
    title: "Luyện theo mức",
    desc: "Câu hỏi khớp với mức hiện tại của em.",
    icon: "🎯",
  },
  {
    mode: "weak_part",
    title: "Ôn phần yếu",
    desc: "Ưu tiên bài em từng sai hoặc chưa chắc.",
    icon: "🧩",
  },
];

export default function ExercisesPage() {
  const searchParams = useSearchParams();
  const { profile } = useCurrentUser();

  const lessons = useMemo(() => getPracticeLessons(), []);
  const initialLesson = searchParams.get("lessonId") || lessons[0]?.lessonId || "lesson-2";
  const initialMode = (searchParams.get("mode") as PracticeMode) || "by_lesson";

  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [lessonId, setLessonId] = useState(initialLesson);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const studentLevel = (profile?.currentLevel || "trungbinh") as StudentLevel;
  const buMeta = getBuLevelMeta(studentLevel);

  useEffect(() => {
    async function load() {
      if (!profile?.uid) return;
      const ids = await getRecentQuestionIds(profile.uid);
      setRecentIds(ids);
    }

    void load();
  }, [profile?.uid]);

  const currentLesson = lessons.find((lesson) => lesson.lessonId === lessonId);

  function generate() {
  const rotatedRecentIds =
    recentIds.length > 0
      ? recentIds.slice(Math.floor(Math.random() * recentIds.length))
      : [];

  const set = buildPracticeSet({
    mode,
    studentLevel,
    lessonId,
    weakLessonIds: profile?.weakLessonIds || [],
    recentQuestionIds: rotatedRecentIds,
    limit: 12,
  });

  setQuestions(set);
  setAnswers({});
  setSubmitted(false);
  setMessage("");
}

  async function submit() {
    if (!profile?.uid || questions.length === 0) return;

    const result = calculateResult(questions, answers);

    await saveLearningActivity({
      studentId: profile.uid,
      lessonId: mode === "by_lesson" ? lessonId : "mixed-practice",
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
          ? "Em làm rất tốt. Bu gợi ý làm quick-test nếu chưa làm hoặc học bài tiếp theo."
          : result.accuracy >= 50
          ? "Em đã hiểu một phần. Bu gợi ý luyện thêm một bộ câu mới và xem lại mindmap."
          : "Em đang hổng kiến thức ở bài này. Bu gợi ý quay lại lý thuyết và mindmap trước khi luyện tiếp.",
    });

    setSubmitted(true);

    setMessage(
      `Bu đã lưu lượt luyện tập. Em đúng ${result.score}/${result.totalQuestions}, đạt ${result.accuracy}%.`
    );
  }

  const result = calculateResult(questions, answers);
  const hasWeakness = submitted && result.accuracy < 60;
  const isOkayButNeedReview = submitted && result.accuracy >= 60 && result.accuracy < 80;

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Luyện tập thông minh
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Luyện nhiều lần, trộn câu theo bài và theo mức Bu
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Practice không giới hạn số lần. Nếu em sai nhiều, Bu sẽ dẫn em quay lại
          lý thuyết và mindmap của đúng bài đang vấp.
        </p>

        <div className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          Mức hiện tại: {buMeta.label}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modeCards.map((card) => (
          <button
            key={card.mode}
            onClick={() => setMode(card.mode)}
            className={`rounded-[28px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
              mode === card.mode
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="text-3xl">{card.icon}</div>
            <h3 className="mt-3 text-lg font-bold text-slate-800">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
          </button>
        ))}
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Bài học muốn luyện
            </label>

            <select
              value={lessonId}
              onChange={(event) => setLessonId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              {lessons.map((lesson) => (
                <option key={lesson.lessonId} value={lesson.lessonId}>
                  Bài {lesson.lessonOrder}. {lesson.lessonTitle} ({lesson.total} câu)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generate}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Bu trộn bộ câu mới
          </button>
        </div>

        {currentLesson ? (
          <div className="mt-5 rounded-3xl bg-blue-50 p-5">
            <p className="font-semibold text-blue-700">
              Bu đang luyện cho em: Bài {currentLesson.lessonOrder}.{" "}
              {currentLesson.lessonTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nếu em làm chưa tốt, Bu sẽ đưa em quay lại đúng lý thuyết và mindmap
              của bài này, không bắt em tự tìm lại.
            </p>
          </div>
        ) : null}
      </section>

      {questions.length === 0 ? (
        <section className="rounded-[30px] bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Hãy chọn chế độ và bấm “Bu trộn bộ câu mới” để bắt đầu luyện tập.
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
                        : "Bu thấy em cần xem lại phần này."}
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
                  Bu nhắc: Practice có thể làm nhiều lần nên em cứ luyện chắc từng bước.
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
                      Bu phát hiện em đang hổng kiến thức ở bài này
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Bu khuyên em chưa nên làm quick-test ngay. Hãy quay lại lý
                      thuyết và mindmap của bài này trước, rồi trộn một bộ luyện khác.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/student/lessons/${lessonId}`}
                        className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600"
                      >
                        Ôn lý thuyết bài này
                      </Link>

                      <Link
                        href={`/student/mindmap?lessonId=${lessonId}`}
                        className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                      >
                        Xem mindmap bài này
                      </Link>

                      <button
                        onClick={generate}
                        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Trộn bộ khác
                      </button>
                    </div>
                  </div>
                ) : isOkayButNeedReview ? (
                  <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                    <p className="font-semibold text-blue-700">
                      Bu thấy em đã hiểu một phần
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Em có thể luyện thêm một lượt hoặc xem mindmap để khóa kiến thức.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={generate}
                        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Luyện thêm bộ khác
                      </button>

                      <Link
                        href={`/student/mindmap?lessonId=${lessonId}`}
                        className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Xem mindmap
                      </Link>

                      <Link
                        href={`/student/lessons/${lessonId}/quick-test`}
                        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Làm quick-test
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="font-semibold text-emerald-700">
                      Bu thấy em đã khá chắc bài
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Em có thể làm quick-test nếu chưa làm, hoặc chuyển sang bài tiếp theo.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/student/lessons/${lessonId}/quick-test`}
                        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Làm quick-test
                      </Link>

                      <Link
                        href="/student/lessons"
                        className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Học bài tiếp theo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </section>
      )}
    </div>
  );
}