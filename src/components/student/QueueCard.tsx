import Link from "next/link";

type QueueAction = {
  label: string;
  href: string;
};

type QueueCardProps = {
  title: string;
  subtitle?: string;
  items: string[];
  icon?: string;
  action?: QueueAction;
  tone?: "blue" | "emerald" | "amber" | "slate";
};

const toneMap = {
  blue: {
    wrapper: "border-blue-100 bg-blue-50",
    icon: "bg-blue-600 text-white",
    title: "text-blue-700",
    item: "bg-white text-slate-700",
    action: "bg-blue-600 text-white hover:bg-blue-700",
  },
  emerald: {
    wrapper: "border-emerald-100 bg-emerald-50",
    icon: "bg-emerald-600 text-white",
    title: "text-emerald-700",
    item: "bg-white text-slate-700",
    action: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  amber: {
    wrapper: "border-amber-100 bg-amber-50",
    icon: "bg-amber-500 text-white",
    title: "text-amber-700",
    item: "bg-white text-slate-700",
    action: "bg-amber-500 text-white hover:bg-amber-600",
  },
  slate: {
    wrapper: "border-slate-200 bg-white",
    icon: "bg-slate-900 text-white",
    title: "text-slate-800",
    item: "bg-slate-50 text-slate-700",
    action: "bg-slate-900 text-white hover:bg-slate-800",
  },
};

export default function QueueCard({
  title,
  subtitle,
  items,
  icon = "✨",
  action,
  tone = "blue",
}: QueueCardProps) {
  const style = toneMap[tone];

  return (
    <section className={`rounded-[30px] border p-6 shadow-sm ${style.wrapper}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${style.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${style.title}`}>Bu gợi ý</p>

          <h2 className="mt-1 text-2xl font-bold text-slate-800">{title}</h2>

          {subtitle ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${style.item}`}
            >
              <span className="mr-2 font-bold text-blue-600">{index + 1}.</span>
              {item}
            </div>
          ))
        ) : (
          <div className={`rounded-2xl px-4 py-3 text-sm ${style.item}`}>
            Bu chưa có gợi ý mới. Em hãy học bài hoặc luyện tập để Bu hiểu em hơn.
          </div>
        )}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={`mt-5 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold transition ${style.action}`}
        >
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}