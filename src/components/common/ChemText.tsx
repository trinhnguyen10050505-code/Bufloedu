import { normalizeChemicalText } from "@/lib/chemistry-language";

export default function ChemText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return <span className={className}>{normalizeChemicalText(children)}</span>;
}