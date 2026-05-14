"use client";

import Image from "next/image";
import { StudentLevel } from "@/types/practice-final";
import { getBuLevelMeta } from "@/lib/Bu-level";

type Props = {
  level: StudentLevel;
  studyMinutes: number;
  completedLessons: number;
  practiceTimes: number;
  quickTests: number;
  averageAccuracy?: number;
};

export default function GardenProgressWide({
  level,
  studyMinutes,
  completedLessons,
  practiceTimes,
  quickTests,
  averageAccuracy = 0,
}: Props) {
  const meta = getBuLevelMeta(level);

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-lime-50 to-sky-50 p-6 shadow-sm">
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-lime-200/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 text-3xl opacity-80">
        🌱 🌿 🌱 🌼 🌱 🌿 🌱 🌼 🌱 🌿 🌱 🌼 🌱 🌿 🌱 🌼
      </div>

      <div className="relative grid gap-6 xl:grid-cols-[1.05fr_1.8fr] xl:items-center">
        <div className="flex items-center gap-5">
          <div className="relative hidden h-36 w-36 shrink-0 sm:block">
            <div className="absolute inset-0 rounded-[32px] bg-white shadow-sm" />
            <Image
              src="/bu-macost.png"
              alt="Bu"
              fill
              className="object-contain p-3"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-emerald-700">
              Khu vườn học tập của Bu
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
              {meta.gardenLabel || "Khu vườn mới nảy mầm"}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Càng học đều, luyện chắc và quick-test tốt, khu vườn càng xanh,
              Bu càng lớn lên nhờ dữ liệu học tập của em.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-[24px] bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Thời gian học</p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {studyMinutes}p
            </p>
            <p className="mt-1 text-xs text-slate-500">Hôm nay</p>
          </div>

          <div className="rounded-[24px] bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Bài đã học</p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {completedLessons}
            </p>
            <p className="mt-1 text-xs text-slate-500">Bài</p>
          </div>

          <div className="rounded-[24px] bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Luyện tập</p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {practiceTimes}
            </p>
            <p className="mt-1 text-xs text-slate-500">Lượt</p>
          </div>

          <div className="rounded-[24px] bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Quick-test</p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {quickTests}
            </p>
            <p className="mt-1 text-xs text-slate-500">Lượt</p>
          </div>

          <div className="rounded-[24px] bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Điểm TB</p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {averageAccuracy || 0}%
            </p>
            <p className="mt-1 text-xs text-slate-500">Tổng hợp</p>
          </div>

          <div className="rounded-[24px] bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Mức hiện tại</p>
            <p className="mt-2 text-xl font-black text-slate-800">
              {meta.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bu đang theo sát em
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}