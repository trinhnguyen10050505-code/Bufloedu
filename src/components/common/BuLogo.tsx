import Image from "next/image";
import Link from "next/link";

type BuLogoProps = {
  href?: string;
};

export default function BuLogo({ href = "/" }: BuLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-blue-50 shadow-sm">
        <Image
          src="/bu-mascot.png"
          alt="Bu"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          Website học tập
        </p>
        <p className="text-base font-bold text-slate-900">
          Khoa học tự nhiên cùng Bu
        </p>
      </div>
    </Link>
  );
}