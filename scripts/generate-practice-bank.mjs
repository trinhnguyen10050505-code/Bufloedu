import fs from "fs";
import path from "path";
import mammoth from "mammoth";

const DOCX_PATH = path.join(process.cwd(), "content", "BÀI TẬP final.docx");
const OUT_PATH = path.join(process.cwd(), "src", "data", "practice-bank.generated.ts");

const LESSON_MAP = [
  { marker: "BÀI 2", lessonId: "lesson-2", lessonOrder: 2, lessonTitle: "Phản ứng hóa học" },
  { marker: "BÀI 3", lessonId: "lesson-3", lessonOrder: 3, lessonTitle: "Mol và tỉ khối của chất khí" },
  { marker: "BÀI 4", lessonId: "lesson-4", lessonOrder: 4, lessonTitle: "Nồng độ dung dịch" },
  { marker: "BÀI 5", lessonId: "lesson-5", lessonOrder: 5, lessonTitle: "Định luật bảo toàn khối lượng và phương trình hóa học" },
  { marker: "BÀI 6", lessonId: "lesson-6", lessonOrder: 6, lessonTitle: "Tính theo phương trình hóa học" },
  { marker: "BÀI 7", lessonId: "lesson-7", lessonOrder: 7, lessonTitle: "Tốc độ phản ứng và chất xúc tác" },
  { marker: "BÀI 8", lessonId: "lesson-8", lessonOrder: 8, lessonTitle: "Acid" },
  { marker: "BÀI 9", lessonId: "lesson-9", lessonOrder: 9, lessonTitle: "Base – thang đo pH" },
  { marker: "BÀI 10", lessonId: "lesson-10", lessonOrder: 10, lessonTitle: "Oxide" },
  { marker: "BÀI 11", lessonId: "lesson-11", lessonOrder: 11, lessonTitle: "Muối" },
  { marker: "BÀI 12", lessonId: "lesson-12", lessonOrder: 12, lessonTitle: "Phân bón hóa học" },
];

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ ]+\n/g, "\n")
    .replace(/\t+/g, "\t")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function detectLesson(line) {
  const upper = line.toUpperCase();
  return LESSON_MAP.find((lesson) => upper.includes(lesson.marker));
}

function detectLevel(line, currentLevel) {
  const value = line.toLowerCase();

  if (
    value.includes("mức độ 3") ||
    value.includes("vận dụng")
  ) {
    return "vandung";
  }

  if (
    value.includes("mức độ 2") ||
    value.includes("thông hiểu")
  ) {
    return "thonghieu";
  }

  if (
    value.includes("mức độ 1") ||
    value.includes("nhận biết")
  ) {
    return "nhanbiet";
  }

  return currentLevel;
}

function optionPositions(text) {
  const matches = [];
  const regex = /(?:^|\s|\t)([ABCD])\.\s*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      id: match[1],
      index: match.index + match[0].indexOf(match[1]),
      end: regex.lastIndex,
    });
  }

  return matches.filter((item, index, arr) => {
    if (index === 0) return true;
    return item.id.charCodeAt(0) > arr[index - 1].id.charCodeAt(0);
  });
}

function parseQuestionBlock(block, lesson, level, questionNumber) {
  const answerMatch = block.match(/Đáp\s*án\s*:\s*([ABCD])/i);
  if (!answerMatch) return null;

  const correctOptionId = answerMatch[1].toUpperCase();
  const withoutAnswer = block.replace(/Đáp\s*án\s*:\s*[ABCD].*/is, "").trim();

  const qMatch = withoutAnswer.match(/^Câu\s+(\d+)\.\s*/i);
  if (!qMatch) return null;

  const afterQuestionNumber = withoutAnswer.replace(/^Câu\s+\d+\.\s*/i, "").trim();
  const positions = optionPositions(afterQuestionNumber);

  if (positions.length < 4) {
    return null;
  }

  const questionText = afterQuestionNumber.slice(0, positions[0].index).trim();

  const options = positions.slice(0, 4).map((pos, index) => {
    const next = positions[index + 1];
    const raw = afterQuestionNumber.slice(pos.end, next ? next.index : afterQuestionNumber.length);
    const cleaned = raw.replace(/\s+/g, " ").trim();

    return {
      id: pos.id,
      text: cleaned || `Lựa chọn ${pos.id}`,
    };
  });

  const needsReview =
    options.some((option) => option.text === `Lựa chọn ${option.id}`) ||
    questionText.length < 5;

  return {
    id: `${lesson.lessonId}-q${String(questionNumber).padStart(3, "0")}`,
    lessonId: lesson.lessonId,
    lessonOrder: lesson.lessonOrder,
    lessonTitle: lesson.lessonTitle,
    level,
    question: questionText || "Câu hỏi có công thức/hình trong file gốc",
    options,
    correctOptionId,
    source: "BAI_TAP_FINAL_DOCX",
    needsReview,
  };
}

function parseQuestions(rawText) {
  const text = normalizeText(rawText);
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  let currentLesson = null;
  let currentLevel = "nhanbiet";
  let currentBlock = "";
  let counterByLesson = {};
  const questions = [];

  function flush() {
    if (!currentBlock || !currentLesson) {
      currentBlock = "";
      return;
    }

    const lessonCounter = (counterByLesson[currentLesson.lessonId] || 0) + 1;
    const question = parseQuestionBlock(
      currentBlock,
      currentLesson,
      currentLevel,
      lessonCounter
    );

    if (question) {
      counterByLesson[currentLesson.lessonId] = lessonCounter;
      questions.push(question);
    }

    currentBlock = "";
  }

  for (const line of lines) {
    const lesson = detectLesson(line);

    if (lesson) {
      flush();
      currentLesson = lesson;
      currentLevel = "nhanbiet";
      continue;
    }

    const newLevel = detectLevel(line, currentLevel);
    if (newLevel !== currentLevel) {
      flush();
      currentLevel = newLevel;
      continue;
    }

    if (/^Câu\s+\d+\./i.test(line)) {
      flush();
      currentBlock = line;
      continue;
    }

    if (currentBlock) {
      currentBlock += "\n" + line;
    }
  }

  flush();

  return questions;
}

function buildOutput(questions) {
  const reviewCount = questions.filter((q) => q.needsReview).length;

  return `import { PracticeQuestion } from "@/types/practice-final";

export const practiceBank: PracticeQuestion[] = ${JSON.stringify(questions, null, 2)} as PracticeQuestion[];

export const practiceBankMeta = {
  totalQuestions: ${questions.length},
  needsReview: ${reviewCount},
  generatedAt: "${new Date().toISOString()}"
};

export function getPracticeQuestionsByLesson(lessonId: string) {
  return practiceBank.filter((question) => question.lessonId === lessonId);
}

export function getPracticeLessons() {
  const map = new Map<string, { lessonId: string; lessonOrder: number; lessonTitle: string; total: number }>();

  practiceBank.forEach((question) => {
    const current = map.get(question.lessonId);

    if (!current) {
      map.set(question.lessonId, {
        lessonId: question.lessonId,
        lessonOrder: question.lessonOrder,
        lessonTitle: question.lessonTitle,
        total: 1,
      });
      return;
    }

    current.total += 1;
  });

  return Array.from(map.values()).sort((a, b) => a.lessonOrder - b.lessonOrder);
}
`;
}

async function main() {
  if (!fs.existsSync(DOCX_PATH)) {
    console.error("Không tìm thấy file:", DOCX_PATH);
    process.exit(1);
  }

  const result = await mammoth.extractRawText({ path: DOCX_PATH });
  const questions = parseQuestions(result.value);

  if (questions.length === 0) {
    console.error("Không tách được câu hỏi nào. Kiểm tra lại định dạng file Word.");
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, buildOutput(questions), "utf8");

  console.log(`Đã tạo ${questions.length} câu hỏi.`);
  console.log(`Cần rà soát do công thức/hình ảnh: ${questions.filter((q) => q.needsReview).length}`);
  console.log(`Output: ${OUT_PATH}`);
}

main();