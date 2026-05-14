"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { useCurrentUser } from "@/hook/useCurrentUser";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  getDiagnosticQuestions,
  getDiagnosticRecommendedLessons,
  getDiagnosticWeakTopics,
  mapDiagnosticAccuracyToLevel,
} from "@/data/diagnostic-bank";
import {
  saveLearningActivity,
  updateStudentAfterAssessment,
} from "@/lib/practice-progress";

type AnswerMap = Record<string, string>;

export default function DiagnosticTestPage() {
  const { profile } = useCurrentUser();

  const questions = useMemo(() => getDiagnosticQuestions(), []);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const totalQuestions = questions.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const derivedLevel = mapDiagnosticAccuracyToLevel(accuracy);
  const buMeta = getBuLevelMeta(derivedLevel);

  const wrongQuestionIds = useMemo(() => {
    return questions
      .filter((question) => answers[question.id] !== question.correctOptionId)
      .map((question) => question.id);
  }, [answers, questions]);

  const weakTopics = useMemo(() => {
    if (!submitted) return [];
    return getDiagnosticWeakTopics(wrongQuestionIds);
  }, [submitted, wrongQuestionIds]);

  const recommendedLessonIds = useMemo(() => {
    return getDiagnosticRecommendedLessons(weakTopics);
  }, [weakTopics]);

  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === questions.length;

  async function handleSubmit() {
    if (!profile?.uid || !canSubmit) return;

    try {
      setSaving(true);
      setSubmitted(true);

      const answerDetails = questions.map((question) => ({
        questionId: question.id,
        lessonId: question.lessonId,
        level: question.level,
        selectedOptionId: answers[question.id],
        correctOptionId: question.correctOptionId,
        isCorrect: answers[question.id] === question.correctOptionId,
      }));

      await saveLearningActivity({
        studentId: profile.uid,
        lessonId: "diagnostic-test",
        activityType: "diagnostic_test",
        score,
        totalQuestions,
        accuracy,
        level: derivedLevel,
        questionIds: questions.map((question) => question.id),
        answerDetails,
      });

      await updateStudentAfterAssessment({
        studentId: profile.uid,
        currentLevel: derivedLevel,
        weakLessonIds: recommendedLessonIds,
        recommendedLessonIds,
        lastAccuracy: accuracy,
        nextAction:
          accuracy >= 80
            ? "Em có nền kiến thức lớp 7 khá chắc. Bu gợi ý em bắt đầu học bài 2 và luyện thêm câu vận dụng."
            : accuracy >= 50
            ? "Em đã có nền tảng nhưng còn vài phần cần củng cố. Bu gợi ý ôn nhanh kiến thức nền trước khi học bài 2."
            : "Em cần ôn lại kiến thức nền lớp 7 trước. Bu gợi ý xem mindmap bài 1 và luyện các câu nhận biết, thông hiểu.",
      });
    } catch (error) {
      console.error("Lưu bài test chẩn đoán thất bại:", error);
    } finally {
      setSaving(false);
    }
  }

  function resetTest() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)]">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <p className="text-caption-pro text-blue-100">
              Test chẩn đoán đầu vào
            </p>

            <h1 className="text-hero-pro mt-4 max-w-4xl text-white">
              Kiểm tra nền kiến thức lớp 7 trước khi bắt đầu Hóa học 8
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-blue-50">
              Bài test này dùng khi em bắt đầu từ bài 2. Bu sẽ xem em còn chắc
              phần nguyên tử, phân tử, liên kết, công thức hóa học hay chưa để
              đề xuất lộ trình phù hợp.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                20 câu
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                Nhận biết → Vận dụng cao
              </span>
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                Chỉ dùng để chẩn đoán nền
              </span>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <ClipboardList size={34} className="text-white" />
            <h2 className="mt-4 text-2xl font-black">
              Bu sẽ dùng kết quả để làm gì?
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-blue-50">
              <li>• Xác định mức Bu Chăm chỉ, Vững vàng hoặc Thông thái.</li>
              <li>• Tìm chủ đề nền lớp 7 em còn yếu.</li>
              <li>• Gợi ý học bài 1, bài 2, mindmap hoặc luyện tập phù hợp.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tiến độ trả lời</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {answeredCount}/{totalQuestions}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Số câu đúng</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {submitted ? score : "--"}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Độ chính xác</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {submitted ? `${accuracy}%` : "--"}
          </p>
        </div>

        <div className={`rounded-[28px] border p-6 shadow-sm ${submitted ? buMeta.cardClass : "border-slate-200 bg-white"}`}>
          <p className="text-sm text-slate-500">Mức Bu dự kiến</p>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {submitted ? buMeta.label : "Chưa chấm"}
          </p>
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
                  <p className="text-sm font-bold text-blue-600">
                    {question.topic} · {question.level}
                  </p>

                  <h2 className="mt-2 text-xl font-black leading-8 text-slate-900">
                    Câu {index + 1}. {question.question}
                  </h2>
                </div>

                {submitted ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
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
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        correct
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : wrong
                          ? "border-red-500 bg-red-50 text-red-700"
                          : isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-black">{option.id}.</span>{" "}
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p
                    className={
                      isCorrect ? "text-emerald-600" : "text-red-600"
                    }
                  >
                    {isCorrect
                      ? "Bu thấy em làm đúng câu này."
                      : "Bu thấy em cần xem lại kiến thức ở câu này."}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {question.explanation}
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
            <p className="text-sm font-semibold text-slate-600">
              Bu nhắc: hãy trả lời đủ 20 câu để Bu chẩn đoán chính xác hơn.
            </p>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || saving}
              className={`rounded-2xl px-6 py-4 font-bold text-white ${
                canSubmit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              {saving ? "Bu đang lưu..." : "Bu chấm bài test đầu vào"}
            </button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold text-blue-600">
                Kết quả chẩn đoán
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Em đúng {score}/{totalQuestions} câu · {accuracy}% ·{" "}
                {buMeta.label}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bu phát hiện các chủ đề cần chú ý:{" "}
                {weakTopics.length > 0 ? weakTopics.join(", ") : "chưa có phần yếu rõ ràng"}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetTest}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 hover:bg-slate-200"
              >
                <RotateCcw size={18} />
                Làm lại
              </button>

              <Link
                href="/student/mindmap?lessonId=lesson-1"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-bold text-white hover:bg-amber-600"
              >
                <Sparkles size={18} />
                Ôn nền lớp 7
              </Link>

              <Link
                href="/student/lessons/lesson-2"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                <ArrowRight size={18} />
                Bắt đầu bài 2
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}