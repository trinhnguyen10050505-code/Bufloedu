import Link from "next/link";

type PracticeCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export default function PracticeCard({
  title,
  description,
  href,
  cta,
}: PracticeCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-block rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        {cta}
      </Link>
    </div>
  );
}