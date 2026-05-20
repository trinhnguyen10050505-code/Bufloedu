"use client";

import Image from "next/image";
import {
  BookOpen,
  Clock3,
  Leaf,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { StudentLevel } from "@/types/practice-final";
import { getBuLevelMeta } from "@/lib/Bu-level";

type StudentGardenWideProps = {
  level: StudentLevel;
  studyMinutes: number;
  completedLessons: number;
  practiceTimes: number;
  quickTests: number;
  averageAccuracy?: number;
};

export default function StudentGardenWide({
  level,
  studyMinutes,
  completedLessons,
  practiceTimes,
  quickTests,
  averageAccuracy = 0,
}: StudentGardenWideProps) {
  const meta = getBuLevelMeta(level);

  const stats = [
    {
      label: "Tích lũy",
      value: `${studyMinutes}p`,
      sub: "Thời gian học",
      icon: Clock3,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Bài đã học",
      value: String(completedLessons),
      sub: "Bài",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Luyện tập",
      value: String(practiceTimes),
      sub: "Lượt",
      icon: Target,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Quick-test",
      value: String(quickTests),
      sub: "Lượt",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Điểm trung bình",
      value: `${averageAccuracy || 0}%`,
      sub: "Tổng hợp",
      icon: Star,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Mức hiện tại",
      value: meta.label,
      sub: "Bạn đang chăm chỉ học!",
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[38px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-lime-50 to-sky-50 p-6 shadow-sm">
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-lime-200/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 text-3xl leading-none opacity-80">
        🌱🌿🌱🌼🌱🌿🌱🌼🌱🌿🌱🌼🌱🌿🌱🌼🌱🌿🌱🌼
      </div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-lg font-black text-emerald-700">
            <Leaf size={22} />
            Khu vườn học tập của Bu
          </p>
        </div>

        <a
          href="/student/results"
          className="hidden text-sm font-bold text-blue-600 hover:text-blue-700 md:inline-flex"
        >
          Xem chi tiết vườn học tập →
        </a>
      </div>

      <div className="relative mt-6 grid gap-6 xl:grid-cols-[330px_1fr] xl:items-center">
        <div className="flex items-center gap-5">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[34px] bg-white/70 shadow-sm">
            <Image
              src="/bu-macost.png"
              alt="Bu"
              fill
              className="object-contain p-3"
            />
          </div>

          <div className="rounded-[22px] bg-emerald-600 px-5 py-4 text-center text-sm font-black leading-6 text-white shadow-lg">
            {meta.label} <br />
            đang lớn lên <br />
            nhờ dữ liệu <br />
            học tập của em
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="text-sm text-slate-600">{item.label}</p>
                </div>

                <p className="mt-4 text-3xl font-black text-slate-900">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}