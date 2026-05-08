"use client";

import { getBuLevelMeta } from "@/lib/Bu-level";
import { StudentLevel } from "@/types/practice-final";

type GardenProgressProps = {
  level: StudentLevel;
  studyMinutes: number;
  completedLessons: number;
  practiceTimes: number;
  quickTests: number;
};

export default function GardenProgress({
  level,
  studyMinutes,
  completedLessons,
  practiceTimes,
  quickTests,
}: GardenProgressProps) {
  const meta = getBuLevelMeta(level);

  const grassCount = Math.min(16, Math.max(4, Math.floor(studyMinutes / 10) + 4));
  const foodCount = Math.min(8, Math.max(1, practiceTimes + quickTests));
  const treeStage =
    completedLessons >= 6 ? "🌳" : completedLessons >= 3 ? "🌿" : "🌱";

  return (
    <section className="overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-100 via-lime-50 to-sky-100 p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Khu vườn học tập của Bu
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {meta.gardenLabel}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            {meta.gardenDescription} Càng học đều, luyện chắc và quick-test tốt,
            khu vườn càng xanh, Bu càng có nhiều thức ăn.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs text-slate-500">Thời gian học</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {studyMinutes}p
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs text-slate-500">Bài đạt</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {completedLessons}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs text-slate-500">Luyện tập</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {practiceTimes}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs text-slate-500">Quick-test</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {quickTests}
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[260px] rounded-[32px] bg-white/60 p-6 lg:w-[380px]">
          <div className="absolute left-6 top-6 text-6xl">{treeStage}</div>
          <div className="absolute right-8 top-8 text-7xl">🐮</div>

          <div className="absolute bottom-8 left-6 right-6 flex flex-wrap gap-2">
            {Array.from({ length: grassCount }).map((_, index) => (
              <span key={`grass-${index}`} className="text-2xl">
                🌱
              </span>
            ))}
          </div>

          <div className="absolute bottom-24 left-12 flex flex-wrap gap-2">
            {Array.from({ length: foodCount }).map((_, index) => (
              <span key={`food-${index}`} className="text-2xl">
                🥕
              </span>
            ))}
          </div>

          <div className="absolute bottom-4 left-6 right-6 rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white">
            {meta.label} đang được nuôi bằng dữ liệu học tập của em
          </div>
        </div>
      </div>
    </section>
  );
}