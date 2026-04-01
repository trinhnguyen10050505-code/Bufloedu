type Props = {
  level: "trungbinh" | "kha" | "gioi";
};

export default function LevelBadge({ level }: Props) {
  const config = {
    trungbinh: {
      label: "Trung bình",
      className: "bg-yellow-100 text-yellow-700 border-yellow-300"
    },
    kha: {
      label: "Khá",
      className: "bg-blue-100 text-blue-700 border-blue-300"
    },
    gioi: {
      label: "Giỏi",
      className: "bg-green-100 text-green-700 border-green-300"
    }
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${config[level].className}`}
    >
      {config[level].label}
    </span>
  );
}