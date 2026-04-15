type LevelBadgeProps = {
  level: "trung_binh" | "kha" | "gioi";
};

const levelMap = {
  trung_binh: {
    label: "Trung bình",
    className: "bg-amber-100 text-amber-700",
  },
  kha: {
    label: "Khá",
    className: "bg-blue-100 text-blue-700",
  },
  gioi: {
    label: "Giỏi",
    className: "bg-emerald-100 text-emerald-700",
  },
};

export default function LevelBadge({ level }: LevelBadgeProps) {
  const config = levelMap[level];

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}