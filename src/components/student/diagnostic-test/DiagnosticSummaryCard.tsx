type DiagnosticSummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function DiagnosticSummaryCard({
  title,
  value,
  subtitle,
}: DiagnosticSummaryCardProps) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      {subtitle ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  );
}