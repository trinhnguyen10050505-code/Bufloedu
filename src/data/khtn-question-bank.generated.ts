import fs from "fs";
import path from "path";
import mammoth from "mammoth";

const DOCX_PATH = path.join(process.cwd(), "content", "LÝ THUYẾT - BÀI TẬP final (1).docx");
const OUT_PATH = path.join(process.cwd(), "src", "data", "khtn-question-bank.generated.ts");

const lessonTitleMap: Record<string, { lessonId: string; title: string }> = {
  "BÀI 2": { lessonId: "lesson-2", title: "Phản ứng hóa học" },
  "BÀI 3": { lessonId: "lesson-3", title: "Mol và tỉ khối của chất khí" },
  "BÀI 4": { lessonId: "lesson-4", title: "Nồng độ dung dịch" },
  "BÀI 5": { lessonId: "lesson-5", title: "Định luật bảo toàn khối lượng và phương trình hóa học",},
  "BÀI 6": { lessonId: "lesson-6", title: "Tính theo phương trình hóa học" },
  "BÀI 7": { lessonId: "lesson-7", title: "Tốc độ phản ứng và chất xúc tác" },
  "BÀI 8": { lessonId: "lesson-8", title: "Acid" },
  "BÀI 9": { lessonId: "lesson-9", title: "Base – thang đo pH" },
  "BÀI 10": { lessonId: "lesson-10", title: "Oxide" },
  "BÀI 11": { lessonId: "lesson-11", title: "Muối" },
  "BÀI 12": { lessonId: "lesson-12", title: "Phân bón hóa học" },
};

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ ]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getLevel(text: string): string | null {
  const lower = text.toLowerCase();

  if (
    lower.includes("mức độ 3") ||
    lower.includes("vận dụng") ||
    lower.includes("vận dụng cao")
  ) {
    return "vandung";
  }

  if (lower.includes("mức độ 2") || lower.includes("thông hiểu")) {
    return "thonghieu";
  }

  if (lower.includes("mức độ 1") || lower.includes("nhận biết")) {
    return "nhanbiet";
  }

  return null;
}

function inferSection(question: string): string {
  const q = question.toLowerCase();

  if (
    q.includes("công thức") ||
    q.includes("nồng độ") ||
    q.includes("số mol") ||
    q.includes("khối lượng") ||
    q.includes("thể tích") ||
    q.includes("hiệu suất") ||
    q.includes("tỉ khối")
  ) {
    return "calculation";
  }

  if (
    q.includes("phương trình") ||
    q.includes("cân bằng") ||
    q.includes("phản ứng")
  ) {
    return "reaction";
  }

  if (
    q.includes("ứng dụng") ||
    q.includes("thí nghiệm") ||
    q.includes("trường hợp") ||
    q.includes("quá trình")
  ) {
    return "application";
  }

  if (
    q.includes("khái niệm") ||
    q.includes("là") ||
    q.includes("định nghĩa")
  ) {
    return "concept";
  }

  return "mixed";
}

function slugQuestionId(lessonId: string, index: number): string {
  return `${lessonId}-q${String(index).padStart(3, "0")}`;
}

type ParsedQuestion = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  section: string;
  level: string;
  question: string;
  options: { id: string; text: string }[];
  source: string;
  verified: boolean;
};

function parseQuestions(text: string): ParsedQuestion[] {
  const lines = normalizeText(text)
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean);

  const questions: ParsedQuestion[] = [];
  let currentLesson: { lessonId: string; title: string } | null = null;
  let currentLevel = "nhanbiet";

  let currentQuestion: ParsedQuestion | null = null;
  let lessonQuestionCounter = 0;

  function pushQuestion() {
    if (!currentQuestion) return;

    if (
      currentQuestion.question &&
      currentQuestion.options.length >= 4 &&
      currentQuestion.lessonId
    ) {
      questions.push(currentQuestion);
    }

    currentQuestion = null;
  }

  for (const line of lines) {
    const upper = line.toUpperCase();

    const lessonKey = Object.keys(lessonTitleMap).find((key) =>
      upper.startsWith(key)
    );

    if (lessonKey) {
      pushQuestion();
      currentLesson = lessonTitleMap[lessonKey as keyof typeof lessonTitleMap];
      currentLevel = "nhanbiet";
      lessonQuestionCounter = 0;
      continue;
    }

    const detectedLevel = getLevel(line);
    if (detectedLevel) {
      pushQuestion();
      currentLevel = detectedLevel;
      continue;
    }

    const questionMatch = line.match(/^Câu\s+(\d+)\.\s*(.+)$/i);
    if (questionMatch && currentLesson) {
      pushQuestion();
      lessonQuestionCounter += 1;

      const questionText = questionMatch[2].trim();

      currentQuestion = {
        id: slugQuestionId(currentLesson.lessonId, lessonQuestionCounter),
        lessonId: currentLesson.lessonId,
        lessonTitle: currentLesson.title,
        section: inferSection(questionText),
        level: currentLevel,
        question: questionText,
        options: [],
        source: "docx-final",
        verified: false,
      };

      continue;
    }

    if (!currentQuestion) continue;

    const optionMatches = Array.from(
      line.matchAll(/([ABCD])\.\s*([^ABCD]+?)(?=\s+[ABCD]\.|$)/g)
    );

    if (optionMatches.length > 0) {
      for (const match of optionMatches) {
        const m = match as RegExpMatchArray;
        currentQuestion.options.push({
          id: m[1],
          text: m[2].trim(),
        });
      }
      continue;
    }

    currentQuestion.question = `${currentQuestion.question} ${line}`.trim();
    currentQuestion.section = inferSection(currentQuestion.question);
  }

  pushQuestion();

  return questions;
}

function buildTsFile(questions: ParsedQuestion[]): string {
  return `import { LearningQuestion } from "@/types/learning";
import { ANSWER_KEY } from "@/data/answer-key";

const RAW_QUESTIONS: Omit<LearningQuestion, "correctOptionId" | "verified">[] = ${JSON.stringify(
    questions,
    null,
    2
  )};

export const khtnQuestionBank: LearningQuestion[] = RAW_QUESTIONS.map((question) => ({
  ...question,
  correctOptionId: ANSWER_KEY[question.id],
  verified: Boolean(ANSWER_KEY[question.id]),
}));

export function getAllQuestions() {
  return khtnQuestionBank;
}

export function getQuestionsByLesson(lessonId: string) {
  return khtnQuestionBank.filter((question) => question.lessonId === lessonId);
}

export function getVerifiedQuestionsByLesson(lessonId: string) {
  return khtnQuestionBank.filter(
    (question) => question.lessonId === lessonId && question.verified
  );
}
`;
}

async function main() {
  if (!fs.existsSync(DOCX_PATH)) {
    console.error(`Không tìm thấy file: ${DOCX_PATH}`);
    console.error("Hãy đặt file docx vào thư mục content/ trước.");
    process.exit(1);
  }

  const result = await mammoth.extractRawText({ path: DOCX_PATH });
  const questions = parseQuestions(result.value);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, buildTsFile(questions), "utf8");

  console.log(`Đã tạo ${questions.length} câu hỏi.`);
  console.log(`Output: ${OUT_PATH}`);
}

main();