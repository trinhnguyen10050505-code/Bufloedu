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
  numberToLevelLabel,
  QuickTestLevelPoint,
} from "@/lib/level-history-reader";
import { StudentLevel } from "@/types/practice-final";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type LevelTrendChartProps = {
  currentLevel: StudentLevel;
  history: QuickTestLevelPoint[];
};

export default function LevelTrendChart({
  currentLevel,
  history,
}: LevelTrendChartProps) {
  const meta = getBuLevelMeta(currentLevel);

  const labels =
    history.length > 0
      ? history.map((item, index) => `QT ${index + 1}`)
      : ["Chưa có"];

  const values =
    history.length > 0
      ? history.map((item) => levelToNumber(item.level))
      : [levelToNumber(currentLevel)];

  const data = {
    labels,
    datasets: [
      {
        label: "Mức học qua quick-test",
        data: values,
        tension: 0.4,
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
      y: {
        min: 1,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => numberToLevelLabel(Number(value)),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = history[context.dataIndex];
            const levelLabel = numberToLevelLabel(context.parsed.y);

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
            Tiến bộ qua quick-test
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bu dùng các lần quick-test để theo dõi em đang ở mức Trung bình, Khá
            hay Giỏi.
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
          1 · Trung bình
        </div>
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          2 · Khá
        </div>
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          3 · Giỏi
        </div>
      </div>

      {history.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Em chưa có quick-test nào. Sau khi làm quick-test, biểu đồ sẽ tự cập nhật.
        </p>
      ) : null}
    </section>
  );
}