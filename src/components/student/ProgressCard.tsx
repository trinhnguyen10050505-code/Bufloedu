type ProgressCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function ProgressCard({
  title,
  value,
  subtitle,
}: ProgressCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}