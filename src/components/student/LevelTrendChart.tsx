"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getBuLevelMeta } from "@/lib/Bu-level";
import {
  levelToNumber,
  QuickTestLevelPoint,
} from "@/lib/level-history-reader";
import { StudentLevel } from "@/types/practice-final";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type LevelTrendChartProps = {
  currentLevel: StudentLevel;
  history: QuickTestLevelPoint[];
};

function formatTime(createdAt: any, index: number) {
  if (typeof createdAt?.seconds === "number") {
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  return `Lần ${index + 1}`;
}

function numberToBuName(value: number) {
  if (value >= 3) return "Bu Thông thái";
  if (value >= 2) return "Bu Vững vàng";
  return "Bu Chăm chỉ";
}

export default function LevelTrendChart({
  currentLevel,
  history,
}: LevelTrendChartProps) {
  const meta = getBuLevelMeta(currentLevel);

  const labels =
    history.length > 0
      ? history.map((item, index) => formatTime(item.createdAt, index))
      : ["Chưa có quick-test"];

  const values =
    history.length > 0
      ? history.map((item) => levelToNumber(item.level))
      : [levelToNumber(currentLevel)];

  const data = {
    labels,
    datasets: [
      {
        label: "Mức Bu theo thời gian",
        data: values,
        tension: 0.45,
        fill: true,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian làm quick-test",
        },
      },
      y: {
        min: 1,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => numberToBuName(Number(value)),
        },
        title: {
          display: true,
          text: "Mức độ Bu",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = history[context.dataIndex];
            const levelLabel = numberToBuName(context.parsed.y);

            if (!point) return levelLabel;

            return `${levelLabel} · ${point.accuracy}% · ${point.lessonId}`;
          },
        },
      },
    },
  };

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Biểu đồ mức độ</p>
          <h2 className="mt-1 text-xl font-bold text-slate-800">
            Mức Bu thay đổi theo thời gian
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mỗi điểm trên biểu đồ là một lần quick-test. Trục ngang là thời gian,
            trục dọc là mức Bu.
          </p>
        </div>

        <div className={`rounded-2xl border px-4 py-3 ${meta.cardClass}`}>
          <p className="text-xs text-slate-500">Hiện tại</p>
          <p className="font-bold text-slate-800">{meta.label}</p>
        </div>
      </div>

      <div className="mt-5 h-56">
        <Line data={data} options={options as any} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          1 · Bu Chăm chỉ
        </div>
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          2 · Bu Vững vàng
        </div>
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          3 · Bu Thông thái
        </div>
      </div>
    </section>
  );
}