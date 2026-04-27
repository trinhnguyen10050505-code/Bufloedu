import Image from "next/image";
import Link from "next/link";

type BuLogoProps = {
  showText?: boolean;
  size?: number;
  href?: string;
};

export default function BuLogo({
  showText = true,
  size = 44,
  href = "/",
}: BuLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <div
        className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logos/bu-logo.png"
          alt="Bu logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-600">
            Website học tập
          </p>
          <p className="text-sm font-bold text-slate-800">
            Khoa học tự nhiên cùng Bu
          </p>
        </div>
      )}
    </Link>
  );
}