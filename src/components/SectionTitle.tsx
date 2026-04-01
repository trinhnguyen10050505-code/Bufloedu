export default function SectionTitle({
  badge,
  title,
  desc,
}: {
  badge: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
        {badge}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        {title}
      </h2>
      <p className="text-slate-600 text-base md:text-lg leading-8">{desc}</p>
    </div>
  );
}