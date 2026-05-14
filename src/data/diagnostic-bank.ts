import { StudentLevel } from "@/types/practice-final";

export type DiagnosticQuestionLevel =
  | "nhanbiet"
  | "thonghieu"
  | "vandung"
  | "vandungcao";

export type DiagnosticOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type DiagnosticQuestion = {
  id: string;
  lessonId: string;
  source: "kiem-tra-dau-vao-lop-7";
  topic: string;
  question: string;
  options: DiagnosticOption[];
  correctOptionId: "A" | "B" | "C" | "D";
  level: DiagnosticQuestionLevel;
  explanation: string;
};

export const diagnosticBank: DiagnosticQuestion[] = [
  {
    id: "diagnostic-7-q1",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Nguyên tử",
    question: "Nguyên tử được cấu tạo từ các hạt nào sau đây?",
    options: [
      { id: "A", text: "Proton và neutron." },
      { id: "B", text: "Proton và electron." },
      { id: "C", text: "Proton, neutron và electron." },
      { id: "D", text: "Chỉ có electron và neutron." },
    ],
    correctOptionId: "C",
    level: "nhanbiet",
    explanation:
      "Nguyên tử gồm hạt nhân chứa proton, neutron và lớp vỏ chứa electron.",
  },
  {
    id: "diagnostic-7-q2",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Nguyên tử",
    question: "Hạt nào trong nguyên tử mang điện tích âm?",
    options: [
      { id: "A", text: "Proton." },
      { id: "B", text: "Neutron." },
      { id: "C", text: "Electron." },
      { id: "D", text: "Hạt nhân." },
    ],
    correctOptionId: "C",
    level: "nhanbiet",
    explanation: "Electron là hạt mang điện tích âm trong nguyên tử.",
  },
  {
    id: "diagnostic-7-q3",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Hạt nhân nguyên tử",
    question: "Hạt nhân nguyên tử được cấu tạo từ",
    options: [
      { id: "A", text: "proton và electron." },
      { id: "B", text: "proton và neutron." },
      { id: "C", text: "electron và neutron." },
      { id: "D", text: "chỉ có proton." },
    ],
    correctOptionId: "B",
    level: "nhanbiet",
    explanation: "Hạt nhân nguyên tử gồm proton và neutron.",
  },
  {
    id: "diagnostic-7-q4",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Cấu tạo nguyên tử",
    question: "Điện tích của neutron là",
    options: [
      { id: "A", text: "+1." },
      { id: "B", text: "−1." },
      { id: "C", text: "0." },
      { id: "D", text: "+2." },
    ],
    correctOptionId: "C",
    level: "nhanbiet",
    explanation: "Neutron là hạt không mang điện.",
  },
  {
    id: "diagnostic-7-q5",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Nguyên tố hóa học",
    question: "Nguyên tố hóa học là tập hợp các nguyên tử có cùng",
    options: [
      { id: "A", text: "số khối." },
      { id: "B", text: "số neutron." },
      { id: "C", text: "số proton." },
      { id: "D", text: "số lớp electron." },
    ],
    correctOptionId: "C",
    level: "nhanbiet",
    explanation:
      "Các nguyên tử thuộc cùng một nguyên tố hóa học có cùng số proton.",
  },
  {
    id: "diagnostic-7-q6",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Số hiệu nguyên tử",
    question:
      "Nguyên tử oxygen (O) có số hiệu nguyên tử là 8. Trong nguyên tử O có bao nhiêu electron?",
    options: [
      { id: "A", text: "6." },
      { id: "B", text: "8." },
      { id: "C", text: "10." },
      { id: "D", text: "16." },
    ],
    correctOptionId: "B",
    level: "thonghieu",
    explanation:
      "Nguyên tử trung hòa có số electron bằng số proton. Oxygen có Z = 8 nên có 8 electron.",
  },
  {
    id: "diagnostic-7-q7",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Khối lượng nguyên tử",
    question:
      "Nguyên tử Carbon có 6 proton và 6 neutron. Khối lượng phân tử của Carbon là",
    options: [
      { id: "A", text: "6 amu." },
      { id: "B", text: "8 amu." },
      { id: "C", text: "12 amu." },
      { id: "D", text: "14 amu." },
    ],
    correctOptionId: "C",
    level: "thonghieu",
    explanation:
      "Khối lượng gần đúng của nguyên tử bằng tổng số proton và neutron: 6 + 6 = 12 amu.",
  },
  {
    id: "diagnostic-7-q8",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Bảng tuần hoàn",
    question:
      "Các nguyên tố trong cùng một chu kỳ của bảng tuần hoàn có điểm chung là",
    options: [
      { id: "A", text: "cùng số electron lớp ngoài cùng." },
      { id: "B", text: "cùng số lớp electron." },
      { id: "C", text: "cùng số neutron." },
      { id: "D", text: "cùng số khối." },
    ],
    correctOptionId: "B",
    level: "thonghieu",
    explanation:
      "Các nguyên tố cùng chu kỳ có cùng số lớp electron trong nguyên tử.",
  },
  {
    id: "diagnostic-7-q9",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Cấu hình electron đơn giản",
    question:
      "Nguyên tử Sodium (Na) có số hiệu nguyên tử là 11. Biết electron phân bố vào các lớp theo thứ tự từ trong ra ngoài (lớp 1 tối đa 2e, lớp 2 tối đa 8e, lớp 3 tối đa 8e). Số electron ở lớp ngoài cùng của Na là",
    options: [
      { id: "A", text: "1." },
      { id: "B", text: "2." },
      { id: "C", text: "8." },
      { id: "D", text: "11." },
    ],
    correctOptionId: "A",
    level: "vandung",
    explanation:
      "Na có 11 electron, phân bố 2, 8, 1 nên lớp ngoài cùng có 1 electron.",
  },
  {
    id: "diagnostic-7-q10",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Bài toán hạt trong nguyên tử",
    question:
      "Nguyên tử X có tổng số hạt proton, neutron và electron là 28. Số neutron nhiều hơn số proton là 1 hạt. Nguyên tố X là:",
    options: [
      { id: "A", text: "Nitrogen (Z = 7)." },
      { id: "B", text: "Fluorine (Z = 9)." },
      { id: "C", text: "Oxygen (Z = 8)." },
      { id: "D", text: "Neon (Z = 10)." },
    ],
    correctOptionId: "B",
    level: "vandungcao",
    explanation:
      "Gọi proton là p, electron = p, neutron = p + 1. Tổng: p + p + p + 1 = 28 nên 3p = 27, p = 9. Z = 9 là Fluorine.",
  },
  {
    id: "diagnostic-7-q11",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Phân tử",
    question: "Phân tử là",
    options: [
      {
        id: "A",
        text: "hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau.",
      },
      { id: "B", text: "hạt nhân của nguyên tử." },
      { id: "C", text: "tập hợp các ion mang điện tích trái dấu." },
      { id: "D", text: "nhóm các electron tự do trong chất rắn." },
    ],
    correctOptionId: "A",
    level: "nhanbiet",
    explanation:
      "Phân tử là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau.",
  },
  {
    id: "diagnostic-7-q12",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Đơn chất",
    question: "Chất nào sau đây là đơn chất?",
    options: [
      { id: "A", text: "Nước (H2O)." },
      { id: "B", text: "Muối ăn (NaCl)." },
      { id: "C", text: "Khí hydrogen (H2)." },
      { id: "D", text: "Carbon dioxide (CO2)." },
    ],
    correctOptionId: "C",
    level: "nhanbiet",
    explanation:
      "H2 chỉ tạo từ một nguyên tố hydrogen nên là đơn chất.",
  },
  {
    id: "diagnostic-7-q13",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Liên kết cộng hóa trị",
    question: "Liên kết cộng hóa trị được hình thành do",
    options: [
      { id: "A", text: "sự cho và nhận electron giữa hai nguyên tử." },
      {
        id: "B",
        text: "sự góp chung một hay nhiều cặp electron giữa hai nguyên tử.",
      },
      { id: "C", text: "lực hút tĩnh điện giữa các ion trái dấu." },
      { id: "D", text: "sự va chạm trực tiếp giữa các nguyên tử." },
    ],
    correctOptionId: "B",
    level: "nhanbiet",
    explanation:
      "Liên kết cộng hóa trị hình thành khi các nguyên tử góp chung electron.",
  },
  {
    id: "diagnostic-7-q14",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Liên kết ion",
    question: "Liên kết ion thường được hình thành giữa",
    options: [
      { id: "A", text: "hai nguyên tử phi kim điển hình." },
      { id: "B", text: "hai nguyên tử kim loại." },
      { id: "C", text: "kim loại điển hình và phi kim điển hình." },
      { id: "D", text: "hai phân tử khác nhau." },
    ],
    correctOptionId: "C",
    level: "nhanbiet",
    explanation:
      "Liên kết ion thường hình thành giữa kim loại điển hình và phi kim điển hình.",
  },
  {
    id: "diagnostic-7-q15",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Hợp chất",
    question: "Hợp chất là chất được tạo thành từ",
    options: [
      { id: "A", text: "một nguyên tố hóa học duy nhất." },
      { id: "B", text: "hai hay nhiều nguyên tố hóa học." },
      { id: "C", text: "hỗn hợp của nhiều chất tinh khiết." },
      { id: "D", text: "chỉ gồm các nguyên tử kim loại." },
    ],
    correctOptionId: "B",
    level: "nhanbiet",
    explanation:
      "Hợp chất được tạo thành từ hai hay nhiều nguyên tố hóa học.",
  },
  {
    id: "diagnostic-7-q16",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Khối lượng phân tử",
    question:
      "Khối lượng phân tử của nước (H2O) là bao nhiêu amu? (Biết H = 1 amu, O = 16 amu)",
    options: [
      { id: "A", text: "16 amu." },
      { id: "B", text: "17 amu." },
      { id: "C", text: "18 amu." },
      { id: "D", text: "20 amu." },
    ],
    correctOptionId: "C",
    level: "thonghieu",
    explanation: "H2O có khối lượng phân tử = 2 × 1 + 16 = 18 amu.",
  },
  {
    id: "diagnostic-7-q17",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Liên kết hóa học",
    question: "Trong phân tử HCl, loại liên kết hóa học được hình thành là",
    options: [
      { id: "A", text: "liên kết ion." },
      { id: "B", text: "liên kết cộng hóa trị." },
      { id: "C", text: "liên kết kim loại." },
      { id: "D", text: "cả liên kết ion và cộng hóa trị." },
    ],
    correctOptionId: "B",
    level: "thonghieu",
    explanation:
      "HCl gồm hai phi kim nên liên kết trong phân tử là liên kết cộng hóa trị.",
  },
  {
    id: "diagnostic-7-q18",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Liên kết ion",
    question: "Hợp chất nào dưới đây có liên kết ion?",
    options: [
      { id: "A", text: "HCl." },
      { id: "B", text: "H2O." },
      { id: "C", text: "CO2." },
      { id: "D", text: "NaCl." },
    ],
    correctOptionId: "D",
    level: "thonghieu",
    explanation:
      "NaCl gồm kim loại Na và phi kim Cl nên có liên kết ion.",
  },
  {
    id: "diagnostic-7-q19",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Công thức hóa học",
    question:
      "Biết hóa trị của Calcium (Ca) là II và hóa trị của Chlorine (Cl) là I. Công thức hóa học đúng của hợp chất tạo từ Ca và Cl là",
    options: [
      { id: "A", text: "CaCl." },
      { id: "B", text: "Ca2Cl." },
      { id: "C", text: "CaCl2." },
      { id: "D", text: "Ca2Cl3." },
    ],
    correctOptionId: "C",
    level: "vandung",
    explanation:
      "Ca có hóa trị II, Cl có hóa trị I nên công thức đúng là CaCl2.",
  },
  {
    id: "diagnostic-7-q20",
    lessonId: "diagnostic-test",
    source: "kiem-tra-dau-vao-lop-7",
    topic: "Bài toán công thức hóa học",
    question:
      "Khối lượng phân tử của hợp chất X gấp 2,5 lần khối lượng phân tử của O2 (= 32 amu). Biết X được tạo từ S và O, trong đó nguyên tố S chiếm 40% về khối lượng. (S = 32 amu, O = 16 amu). Công thức hóa học của X là:",
    options: [
      { id: "A", text: "SO2." },
      { id: "B", text: "SO3." },
      { id: "C", text: "S2O3." },
      { id: "D", text: "S2O7." },
    ],
    correctOptionId: "B",
    level: "vandungcao",
    explanation:
      "M(X) = 2,5 × 32 = 80 amu. S chiếm 40% nên khối lượng S = 32 amu, tương ứng 1 nguyên tử S. Khối lượng O = 48 amu, tương ứng 3 nguyên tử O. Công thức là SO3.",
  },
];

export function getDiagnosticQuestions() {
  return diagnosticBank;
}

export function mapDiagnosticAccuracyToLevel(accuracy: number): StudentLevel {
  if (accuracy >= 80) return "gioi";
  if (accuracy >= 50) return "kha";
  return "trungbinh";
}

export function getDiagnosticWeakTopics(
  wrongQuestionIds: string[]
): string[] {
  const wrongQuestions = diagnosticBank.filter((question) =>
    wrongQuestionIds.includes(question.id)
  );

  return Array.from(new Set(wrongQuestions.map((question) => question.topic)));
}

export function getDiagnosticRecommendedLessons(
  weakTopics: string[]
): string[] {
  const lessons = new Set<string>();

  weakTopics.forEach((topic) => {
    if (
      topic.includes("Nguyên tử") ||
      topic.includes("Hạt nhân") ||
      topic.includes("Số hiệu") ||
      topic.includes("Bảng tuần hoàn")
    ) {
      lessons.add("lesson-1");
    }

    if (
      topic.includes("Phân tử") ||
      topic.includes("Đơn chất") ||
      topic.includes("Hợp chất") ||
      topic.includes("Liên kết") ||
      topic.includes("Công thức")
    ) {
      lessons.add("lesson-2");
    }
  });

  return Array.from(lessons).length > 0
    ? Array.from(lessons)
    : ["lesson-1", "lesson-2"];
}