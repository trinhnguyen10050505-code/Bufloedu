import { StudentLevel } from "@/types";
import { getBuLevelMeta } from "@/lib/Bu-level";

type LevelBadgeProps = {
  level: StudentLevel;
};

export default function LevelBadge({ level }: LevelBadgeProps) {
  const meta = getBuLevelMeta(level);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
}