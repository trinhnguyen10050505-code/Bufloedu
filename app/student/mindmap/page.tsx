"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import {
  getMindmapByLesson,
  getMindmapPuzzleByLesson,
  MindmapDoc,
  MindmapPuzzleDoc,
} from "@/lib/mindmap-final";
import { saveLearningActivity } from "@/lib/practice-progress";
import { useCurrentUser } from "@/hook/useCurrentUser";

export default function MindmapPage() {
  const searchParams = useSearchParams();
  const { profile } = useCurrentUser();
  const lessons = useMemo(() => getPracticeLessons(), []);

  const initialLessonId = searchParams.get("lessonId") || lessons[0]?.lessonId || "lesson-2";

  const [lessonId, setLessonId] = useState(initialLessonId);
  const [mindmap, setMindmap] = useState<MindmapDoc | null>(null);
  const [puzzle, setPuzzle] = useState<MindmapPuzzleDoc | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setResultMessage("");
      setMatches({});

      const [mindmapData, puzzleData] = await Promise.all([
        getMindmapByLesson(lessonId),
        getMindmapPuzzleByLesson(lessonId),
      ]);

      setMindmap(mindmapData);
      setPuzzle(puzzleData);
      setLoading(false);
    }

    void load();
  }, [lessonId]);

  const centerNode = mindmap?.nodes?.find((node) => node.type === "center");
  const branchNodes = mindmap?.nodes?.filter((node) => node.type !== "center") || [];
  const selectedLesson = lessons.find((lesson) => lesson.lessonId === lessonId);

  async function checkPuzzle() {
    if (!puzzle || !profile?.uid) return;

    let correct = 0;
    const total = puzzle.targets.length;

    puzzle.targets.forEach((target) => {
      if (target.accepts.includes(matches[target.id])) {
        correct += 1;
      }
    });

    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    await saveLearningActivity({
      studentId: profile.uid,
      lessonId,
      activityType: "mindmap_puzzle",
      score: correct,
      totalQuestions: total,
      accuracy,
      level: accuracy >= 80 ? "gioi" : accuracy >= 50 ? "kha" : "trungbinh",
    });

    setResultMessage(
      `Bu thấy em ghép đúng ${correct}/${total} mảnh (${accuracy}%). ${
        accuracy >= 80
          ? "Em nhớ cấu trúc bài rất tốt."
          : accuracy >= 50
          ? "Em đã nhớ một phần, nên xem lại các nhánh còn sai."
          : "Em nên xem lại lý thuyết rồi ghép lại."
      }`
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Mindmap thông minh
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Nhớ bài bằng sơ đồ, ảnh minh họa và ghép nối kiến thức
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Mindmap được chia theo từng bài. Nếu em luyện tập bị sai nhiều, Bu sẽ dẫn
          em về đúng mindmap của bài đang vấp.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">Chọn bài</label>
        <select
          value={lessonId}
          onChange={(event) => setLessonId(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        >
          {lessons.map((lesson) => (
            <option key={lesson.lessonId} value={lesson.lessonId}>
              Bài {lesson.lessonOrder}. {lesson.lessonTitle}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <section className="rounded-[30px] bg-white p-8 shadow-sm">
          Bu đang tải mindmap...
        </section>
      ) : null}

      {!loading && !mindmap ? (
        <section className="rounded-[30px] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">
            Bài này chưa có mindmap
          </h2>
          <p className="mt-3 text-slate-600">
            Hãy tạo document trong Firestore collection <b>mindmaps</b> với
            lessonId là <b>{lessonId}</b>.
          </p>

          <Link
            href={`/student/lessons/${lessonId}`}
            className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Quay lại lý thuyết bài này
          </Link>
        </section>
      ) : null}

      {mindmap ? (
        <section className="rounded-[32px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">
            {selectedLesson?.lessonTitle || mindmap.title}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[30px] bg-blue-50 p-6">
              <p className="text-sm font-semibold text-blue-700">
                Trung tâm bài học
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {mindmap.centerText || centerNode?.label}
              </h2>

              {centerNode?.description ? (
                <p className="mt-3 leading-7 text-slate-600">
                  {centerNode.description}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/student/lessons/${lessonId}`}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Ôn lý thuyết
                </Link>

                <Link
                  href={`/student/exercises?lessonId=${lessonId}&mode=by_lesson`}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Luyện lại bài này
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {branchNodes.map((node) => (
                <article
                  key={node.id}
                  className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50"
                >
                  {node.imageUrl ? (
                    <img
                      src={node.imageUrl}
                      alt={node.label}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400">
                      Chưa có ảnh
                    </div>
                  )}

                  <div className="p-5">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {node.type}
                    </span>

                    <h3 className="mt-3 text-lg font-bold text-slate-800">
                      {node.label}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {node.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {puzzle ? (
        <section className="rounded-[32px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-emerald-600">
            Ghép nối kiến thức
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            {puzzle.title}
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[26px] bg-slate-50 p-5">
              <p className="font-semibold text-slate-800">Mảnh kiến thức</p>

              <div className="mt-4 grid gap-3">
                {puzzle.pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                  >
                    <span className="mr-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      {piece.type}
                    </span>
                    {piece.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] bg-slate-50 p-5">
              <p className="font-semibold text-slate-800">
                Chọn mảnh đúng cho từng ô
              </p>

              <div className="mt-4 grid gap-4">
                {puzzle.targets.map((target, index) => (
                  <div key={target.id} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="font-semibold text-slate-800">
                      Ô {index + 1}. {target.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{target.hint}</p>

                    <select
                      value={matches[target.id] || ""}
                      onChange={(event) =>
                        setMatches((prev) => ({
                          ...prev,
                          [target.id]: event.target.value,
                        }))
                      }
                      className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="">Chọn mảnh ghép</option>
                      {puzzle.pieces.map((piece) => (
                        <option key={piece.id} value={piece.id}>
                          {piece.text}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={checkPuzzle}
            className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Bu kiểm tra phần ghép nối
          </button>

          {resultMessage ? (
            <div className="mt-5 rounded-3xl bg-blue-50 p-5 text-sm font-semibold text-slate-700">
              {resultMessage}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}