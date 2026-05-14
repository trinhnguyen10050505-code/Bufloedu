export type ChemicalFormulaToken = {
  raw: string;
  html: string;
  plainText: string;
};

const ELEMENT_SYMBOLS = new Set([
  "H", "He",
  "Li", "Be", "B", "C", "N", "O", "F", "Ne",
  "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar",
  "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Ga", "Ge", "As", "Se", "Br", "Kr",
  "Rb", "Sr", "Ag", "Cd", "Sn", "I", "Ba", "Pt", "Au", "Hg", "Pb",
]);

const COMMON_FORMULA_REPLACEMENTS: Record<string, string> = {
  H2: "H₂",
  O2: "O₂",
  N2: "N₂",
  Cl2: "Cl₂",
  H2O: "H₂O",
  CO2: "CO₂",
  SO2: "SO₂",
  SO3: "SO₃",
  NH3: "NH₃",
  CH4: "CH₄",
  HCl: "HCl",
  NaCl: "NaCl",
  CaCO3: "CaCO₃",
  CaCl2: "CaCl₂",
  H2SO4: "H₂SO₄",
  HNO3: "HNO₃",
  NaOH: "NaOH",
  CaOH2: "Ca(OH)₂",
  "Ca(OH)2": "Ca(OH)₂",
  Fe2O3: "Fe₂O₃",
  Al2O3: "Al₂O₃",
};

const SUBSCRIPT_MAP: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
};

function toSubscript(value: string) {
  return value
    .split("")
    .map((char) => SUBSCRIPT_MAP[char] ?? char)
    .join("");
}

function toSuperscript(value: string) {
  return value
    .split("")
    .map((char) => SUPERSCRIPT_MAP[char] ?? char)
    .join("");
}

export function normalizeChemicalFormula(formula: string): string {
  const trimmed = formula.trim();

  if (COMMON_FORMULA_REPLACEMENTS[trimmed]) {
    return COMMON_FORMULA_REPLACEMENTS[trimmed];
  }

  return trimmed.replace(/([A-Z][a-z]?|\))(\d+)/g, (_match, atom, number) => {
    return `${atom}${toSubscript(number)}`;
  });
}

export function chemicalFormulaToHtml(formula: string): string {
  const normalized = formula.trim();

  return normalized.replace(/([A-Z][a-z]?|\))(\d+)/g, (_match, atom, number) => {
    return `${atom}<sub>${number}</sub>`;
  });
}

export function normalizeChemicalText(text: string): string {
  let output = text;

  Object.entries(COMMON_FORMULA_REPLACEMENTS).forEach(([raw, pretty]) => {
    const regex = new RegExp(`\\b${raw.replace(/[()]/g, "\\$&")}\\b`, "g");
    output = output.replace(regex, pretty);
  });

  output = output.replace(
    /\b([A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+)\b/g,
    (match) => normalizeChemicalFormula(match)
  );

  output = output.replace(/(\d+)\s*e-/g, (_match, number) => {
    return `${number}e⁻`;
  });

  output = output.replace(/([A-Z][a-z]?)(\d*)([+-])/g, (_match, el, count, charge) => {
    const sub = count ? toSubscript(count) : "";
    return `${el}${sub}${toSuperscript(charge)}`;
  });

  return output;
}

export function isLikelyChemicalFormula(value: string): boolean {
  const text = value.trim();

  if (!text) return false;

  if (COMMON_FORMULA_REPLACEMENTS[text]) return true;

  const formulaPattern =
    /^([A-Z][a-z]?\d*|\([A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)*\)\d*)+([+-])?$/;

  return formulaPattern.test(text);
}

export function validateChemicalFormula(formula: string): {
  valid: boolean;
  reason?: string;
} {
  const text = formula.trim();

  if (!text) {
    return {
      valid: false,
      reason: "Công thức đang trống.",
    };
  }

  const elementMatches = text.match(/[A-Z][a-z]?/g) || [];

  if (elementMatches.length === 0) {
    return {
      valid: false,
      reason: "Bu chưa thấy ký hiệu nguyên tố trong công thức.",
    };
  }

  const invalidElements = elementMatches.filter(
    (symbol) => !ELEMENT_SYMBOLS.has(symbol)
  );

  if (invalidElements.length > 0) {
    return {
      valid: false,
      reason: `Ký hiệu nguyên tố chưa đúng: ${invalidElements.join(", ")}.`,
    };
  }

  if (/[a-z][a-z]/.test(text)) {
    return {
      valid: false,
      reason:
        "Ký hiệu nguyên tố cần viết hoa chữ cái đầu, ví dụ Na, Cl, Fe.",
    };
  }

  return {
    valid: true,
  };
}

export function renderReactionText(text: string): string {
  return normalizeChemicalText(text)
    .replace(/->/g, "→")
    .replace(/=>/g, "→")
    .replace(/<->/g, "⇌")
    .replace(/\+/g, " + ");
}

export function buildChemistryPromptGuard() {
  return [
    "Quy tắc ngôn ngữ Hóa học bắt buộc:",
    "1. Không tự ý đổi công thức hóa học, hệ số, chỉ số dưới hoặc điện tích.",
    "2. Viết công thức đúng dạng: H2O, CO2, Ca(OH)2, H2SO4 trước khi hiển thị.",
    "3. Khi giải thích cho học sinh, có thể đọc H2O là nước, CO2 là carbon dioxide.",
    "4. Không bịa phản ứng hóa học nếu không chắc.",
    "5. Nếu cân bằng phương trình, phải kiểm tra số nguyên tử hai vế.",
    "6. Nếu dữ liệu đề bài có công thức lạ, giữ nguyên công thức và hỏi lại nếu cần.",
  ].join("\n");
}