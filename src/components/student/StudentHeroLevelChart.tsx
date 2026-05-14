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
import { StudentLevel } from "@/types/practice-final";
import {
  levelToNumber,
  QuickTestLevelPoint,
} from "@/lib/level-history-reader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

type Props = {
  currentLevel: StudentLevel;
  history: QuickTestLevelPoint[];
};

function formatDate(createdAt: any, index: number) {
  if (typeof createdAt?.seconds === "number") {
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  return `Lần ${index + 1}`;
}

function levelName(value: number) {
  if (value >= 3) return "Bu Thông thái";
  if (value >= 2) return "Bu Vững vàng";
  return "Bu Chăm chỉ";
}

export default function StudentHeroLevelChart({ currentLevel, history }: Props) {
  const labels =
    history.length > 0
      ? history.map((item, index) => formatDate(item.createdAt, index))
      : ["Bắt đầu"];

  const values =
    history.length > 0
      ? history.map((item) => levelToNumber(item.level))
      : [levelToNumber(currentLevel)];

  const data = {
    labels,
    datasets: [
      {
        label: "Mức Bu",
        data: values,
        tension: 0.42,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderColor: "rgba(255,255,255,0.96)",
        backgroundColor: "rgba(255,255,255,0.18)",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255,255,255,0.95)",
          font: { weight: "bold", size: 11 },
        },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        min: 1,
        max: 3,
        ticks: {
          stepSize: 1,
          color: "rgba(255,255,255,0.95)",
          font: { size: 11 },
          callback: (value: string | number) => levelName(Number(value)),
        },
        grid: {
          color: "rgba(255,255,255,0.18)",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1e293b",
        bodyColor: "#334155",
        padding: 12,
        cornerRadius: 14,
        callbacks: {
          label: (context: any) => {
            const point = history[context.dataIndex];
            const label = levelName(context.parsed.y);

            if (!point) return label;

            return `${label} · Độ chính xác: ${point.accuracy}%`;
          },
        },
      },
    },
  };

  return (
    <section className="h-[300px] w-full rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="max-w-[310px] text-[20px] font-black leading-snug text-white">
            Biểu đồ Mức Bu thay đổi theo thời gian
          </h2>
          <p className="mt-2 text-xs leading-5 text-blue-100">
            Mỗi điểm là một lần quick-test của em.
          </p>
        </div>

        <span className="shrink-0 rounded-2xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold text-white">
          30 ngày qua
        </span>
      </div>

      <div className="mt-3 h-[215px]">
        <Line data={data} options={options as any} />
      </div>
    </section>
  );
}