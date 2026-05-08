import React from "react";

interface DiagnosticSummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export default function DiagnosticSummaryCard({
  title,
  value,
  subtitle,
}: DiagnosticSummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}