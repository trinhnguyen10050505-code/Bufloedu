"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { questionBank } from "@/data/question-bank";
import { buildDiagnosticResult } from "@/lib/level-engine";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  saveDiagnosticResult,
  saveStudentProgress,
  updateStudentPersonalization,
} from "@/lib/progress";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { lessonsContent } from "@/data/lessons-content";
import DiagnosticSummaryCard from "@/components/student/diagnostic-test/DiagnosticSummaryCard";

type AnswerMap = Record<string, string>;

export default function DiagnosticTestPage() {
  const { profile, loading } = useCurrentUser();
  const router = useRouter();

  const diagnosticQuestions = useMemo(() => {
    return questionBank.slice(0, 8);
  }, []);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const correctCount = diagnosticQuestions.reduce((total, question) => {
    return total + (answers[question.id] === question.correctAnswerId ? 1 : 0);
  }, 0);

  const hardCorrect = diagnosticQuestions.reduce((total, question) => {
    const isHard = question.level === "vandung";
    const isCorrect = answers[question.id] === question.correctAnswerId;
    return total + (isHard && isCorrect ? 1 : 0);
  }, 0);

  const correctRate =
    diagnosticQuestions.length > 0
      ? (correctCount / diagnosticQuestions.length) * 100
      : 0;

  const weakLessonIds = Array.from(
    new Set(
      diagnosticQuestions
        .filter((q) => answers[q.id] && answers[q.id] !== q.correctAnswerId)
        .map((q) => q.lessonId)
    )
  );

  const result =
    profile?.uid
      ? buildDiagnosticResult({
          studentId: profile.uid,
          correctRate,
          hardCorrect,
          completionTime: 850,
          weakLessonIds,
          totalQuestions: diagnosticQuestions.length,
        })
      : null;

  const buMeta = result ? getBuLevelMeta(result.level) : null;

  async function handleSubmit() {
    if (!profile?.uid || !result || saving) return;

    setSubmitted(true);
    setSaving(true);

    try {
      await saveDiagnosticResult(result);

      await saveStudentProgress({
        studentId: profile.uid,
        lessonId: "diagnostic-test",
        activityType: "diagnostic_test",
        score: result.score,
        totalQuestions: result.totalQuestions,
        accuracy: Math.round(result.correctRate),
        level: result.level,
      });

      await updateStudentPersonalization({
        studentId: profile.uid,
        currentLevel: result.level,
        weakLessonIds: result.weakLessonIds,
        recommendedLessonIds: result.recommendedLessonIds,
        recommendedPracticeLevels: result.recommendedPracticeLevels,
        nextAction: result.nextAction,
      });

      router.refresh();
    } catch (error) {
      console.error("Lưu kết quả chẩn đoán thất bại:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <p className="text-slate-600">Bu đang chuẩn bị bài test cho em...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Chưa đăng nhập</h1>
        <p className="mt-3 text-slate-600">
          Em cần đăng nhập để Bu lưu hồ sơ chẩn đoán và cá nhân hóa lộ trình học.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Bài test chẩn đoán
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu sẽ xác định điểm bắt đầu phù hợp cho em
        </h1>
        <p className="mt-3 max-w-2xl text-blue-50">
          Sau bài test này, Bu sẽ xác định mức học hiện tại, những bài còn yếu
          và đề xuất bước học tiếp theo phù hợp nhất cho em.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DiagnosticSummaryCard
          title="Số câu chẩn đoán"
          value={String(diagnosticQuestions.length)}
        />
        <DiagnosticSummaryCard
          title="Mục tiêu"
          value="Cá nhân hóa"
          subtitle="Xác định mức học và lộ trình phù hợp cho em."
        />
        <DiagnosticSummaryCard
          title="Bu sẽ dùng kết quả để"
          value="Gợi ý học tiếp"
          subtitle="Đề xuất bài nên học, mức luyện tập và việc làm tiếp theo."
        />
      </section>

      {diagnosticQuestions.map((question, index) => (
        <section key={question.id} className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="mb-4 text-lg font-semibold leading-7 text-slate-800">
            Câu {index + 1}. {question.question}
          </p>

          <div className="grid gap-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.id;

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
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-semibold">{option.id}.</span> {option.text}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Bu đang lưu kết quả..." : "Bu xem kết quả cho em"}
        </button>
      ) : result && buMeta ? (
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Kết quả chẩn đoán</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            Bu thấy em đang ở mức {buMeta.label}
          </h2>

          <div className={`mt-5 rounded-3xl border p-5 ${buMeta.cardClass}`}>
            <p className="font-semibold text-slate-800">{buMeta.shortDescription}</p>
            <p className="mt-2 leading-7 text-slate-700">{buMeta.longDescription}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DiagnosticSummaryCard
              title="Số câu đúng"
              value={`${correctCount}/${diagnosticQuestions.length}`}
            />
            <DiagnosticSummaryCard
              title="Tỉ lệ đúng"
              value={`${Math.round(correctRate)}%`}
            />
            <DiagnosticSummaryCard
              title="Câu vận dụng đúng"
              value={String(hardCorrect)}
            />
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="font-semibold text-slate-800">Bu gợi ý bước tiếp theo</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              <li>{result.nextAction}</li>
              <li>
                Bài nên học trước:{" "}
                <span className="font-semibold">
                  {result.recommendedLessonIds
                    .map(
                      (lessonId) =>
                        lessonsContent[lessonId as keyof typeof lessonsContent]?.title || lessonId
                    )
                    .join(", ")}
                </span>
              </li>
              <li>
                Mức luyện tập phù hợp:{" "}
                <span className="font-semibold">
                  {result.recommendedPracticeLevels.join(", ")}
                </span>
              </li>
              <li>
                Bài còn yếu:{" "}
                <span className="font-semibold">
                  {result.weakLessonIds.length > 0
                    ? result.weakLessonIds
                        .map(
                          (lessonId) =>
                            lessonsContent[lessonId as keyof typeof lessonsContent]?.title ||
                            lessonId
                        )
                        .join(", ")
                    : "Chưa có phần yếu nổi bật"}
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/student"
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Về dashboard
            </Link>

            {result.recommendedLessonIds[0] ? (
              <Link
                href={`/student/lessons/${result.recommendedLessonIds[0]}`}
                className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Học bài Bu gợi ý
              </Link>
            ) : null}

            {result.recommendedLessonIds[0] ? (
              <Link
                href={`/student/lessons/${result.recommendedLessonIds[0]}/practice`}
                className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-amber-600"
              >
                Luyện tập ngay
              </Link>
            ) : null}
          </div>

          {saving ? (
            <p className="mt-4 text-sm text-blue-600">
              Bu đang hoàn tất cập nhật hồ sơ học tập của em...
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}