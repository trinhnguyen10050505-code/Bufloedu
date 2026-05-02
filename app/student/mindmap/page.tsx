"use client";

import { useEffect, useState } from "react";
import { getLessonImages, getMindmapByLesson, getMindmapPuzzleByLesson } from "@/lib/mindmap";
import { saveStudentProgress } from "@/lib/progress";
import { useCurrentUser } from "@/hook/useCurrentUser";

export default function StudentMindmapPage() {
  const { profile } = useCurrentUser();
  const [lessonId, setLessonId] = useState("lesson-2");
  const [mindmap, setMindmap] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [puzzle, setPuzzle] = useState<any>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function run() {
      const [mindmapData, imageData, puzzleData] = await Promise.all([
        getMindmapByLesson(lessonId),
        getLessonImages(lessonId),
        getMindmapPuzzleByLesson(lessonId),
      ]);
      setMindmap(mindmapData);
      setImages(imageData);
      setPuzzle(puzzleData);
      setMatches({});
      setStatus("");
    }

    void run();
  }, [lessonId]);

  async function handleCheckPuzzle() {
    if (!puzzle || !profile?.uid) return;

    let correct = 0;
    for (const target of puzzle.targets || []) {
      const selectedPieceId = matches[target.id];
      if (target.accepts.includes(selectedPieceId)) {
        correct += 1;
      }
    }

    const total = (puzzle.targets || []).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    await saveStudentProgress({
      studentId: profile.uid,
      lessonId,
      activityType: "practice",
      score: correct,
      totalQuestions: total,
      accuracy,
      level: accuracy >= 80 ? "gioi" : accuracy >= 50 ? "kha" : "trungbinh",
    });

    setStatus(`Bu thấy em ghép đúng ${correct}/${total} mảnh (${accuracy}%).`);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Mindmap thông minh
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu giúp em nhớ bài bằng sơ đồ và ghép nối kiến thức
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Em có thể xem mindmap theo bài, nhìn ảnh minh họa trực quan và tự ghép các
          mảnh kiến thức để kiểm tra xem mình đã nắm bài thật sự chưa.
        </p>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <label className="text-sm font-medium text-slate-700">Chọn bài học</label>
        <select
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          <option value="lesson-2">Bài 2</option>
          <option value="lesson-3">Bài 3</option>
          <option value="lesson-4">Bài 4</option>
          <option value="lesson-5">Bài 5</option>
        </select>
      </section>

      {mindmap ? (
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">{mindmap.title}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(mindmap.nodes || []).map((node: any) => (
              <div key={node.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-lg font-bold text-slate-800">{node.label}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Loại nhánh: {node.type}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {images.length > 0 ? (
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Ảnh minh họa theo bài</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <img
                  src={img.imageUrl}
                  alt={img.label}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold text-slate-800">{img.label}</p>
                  <p className="mt-1 text-sm text-slate-600">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {puzzle ? (
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">{puzzle.title}</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-800">Mảnh kiến thức</p>
              <div className="mt-4 grid gap-3">
                {(puzzle.pieces || []).map((piece: any) => (
                  <div key={piece.id} className="rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm">
                    {piece.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-800">Ghép nối đúng vị trí</p>
              <div className="mt-4 grid gap-3">
                {(puzzle.targets || []).map((target: any, index: number) => (
                  <div key={target.id} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">Ô ghép {index + 1}</p>
                    <select
                      value={matches[target.id] || ""}
                      onChange={(e) =>
                        setMatches((prev) => ({
                          ...prev,
                          [target.id]: e.target.value,
                        }))
                      }
                      className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      <option value="">Chọn mảnh ghép</option>
                      {(puzzle.pieces || []).map((piece: any) => (
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
            onClick={handleCheckPuzzle}
            className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Bu kiểm tra phần ghép nối cho em
          </button>

          {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
        </section>
      ) : null}
    </div>
  );
}