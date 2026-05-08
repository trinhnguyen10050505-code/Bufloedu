import Link from "next/link";

type QueueCardProps = {
  title: string;
  items: string[];
  href?: string;
  icon?: string;
  actionLabel?: string;
};

export default function QueueCard({
  title,
  items,
  href,
  icon = "✨",
  actionLabel = "Bắt đầu",
}: QueueCardProps) {
  const content = (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-800">
            {title}
          </h3>

          <ul className="mt-3 space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"></span>
                {item}
              </li>
            ))}
          </ul>

          {href && (
            <div className="mt-4 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-600 hover:text-white">
              {actionLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block transition hover:-translate-y-1 hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return content;
}