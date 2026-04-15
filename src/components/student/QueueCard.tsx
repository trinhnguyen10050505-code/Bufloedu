type QueueCardProps = {
  title: string;
  items: string[];
};

export default function QueueCard({ title, items }: QueueCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}