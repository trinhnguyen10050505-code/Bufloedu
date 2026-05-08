import React from "react";
import Link from "next/link";

interface ExerciseOverviewPanelProps {
  lessonTitle: string;
  totalQuestions: number;
  levelLabel: string;
  practiceHref: string;
  quickTestHref: string;
}

export default function ExerciseOverviewPanel({
  lessonTitle,
  totalQuestions,
  levelLabel,
  practiceHref,
  quickTestHref,
}: ExerciseOverviewPanelProps) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">{lessonTitle}</h1>
      <p className="mt-2 text-slate-600">
        {totalQuestions} câu hỏi • Mức {levelLabel}
      </p>
      <div className="mt-4 flex gap-4">
        <Link href={practiceHref} className="rounded-lg bg-blue-500 px-4 py-2 text-white">
          Luyện tập
        </Link>
        <Link href={quickTestHref} className="rounded-lg bg-green-500 px-4 py-2 text-white">
          Kiểm tra nhanh
        </Link>
      </div>
    </div>
  );
}