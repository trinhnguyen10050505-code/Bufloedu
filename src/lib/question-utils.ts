import { Question, QuestionLevel, StudentTargetLevel } from "@/types/question";
import { RawQuestion } from "@/types/question-raw";

function mapTargetLevel(level: QuestionLevel): StudentTargetLevel {
  if (level === "nhanbiet") return "trung_binh";
  if (level === "thonghieu") return "kha";
  return "gioi";
}

function mapDifficulty(level: QuestionLevel): "easy" | "medium" | "hard" {
  if (level === "nhanbiet") return "easy";
  if (level === "thonghieu") return "medium";
  return "hard";
}

function generateTags(question: RawQuestion): string[] {
  const text = `${question.question} ${question.explanation}`.toLowerCase();
  const tags: string[] = [];

  if (text.includes("biến đổi vật lí")) tags.push("bien-doi-vat-li");
  if (text.includes("biến đổi hóa học")) tags.push("bien-doi-hoa-hoc");
  if (text.includes("phản ứng")) tags.push("phan-ung-hoa-hoc");
  if (text.includes("mol")) tags.push("mol");
  if (text.includes("tỉ khối")) tags.push("ti-khoi");
  if (text.includes("nồng độ")) tags.push("nong-do");
  if (text.includes("bảo toàn khối lượng")) tags.push("bao-toan-khoi-luong");
  if (text.includes("phương trình hóa học")) tags.push("phuong-trinh-hoa-hoc");

  if (tags.length === 0) tags.push("general");

  return tags;
}

export function normalizeQuestionBank(rawQuestions: RawQuestion[]): Question[] {
  return rawQuestions.map((q) => {
    const options = q.options.map((text, index) => ({
      id: String.fromCharCode(65 + index),
      text,
    }));

    const correctIndex = q.options.findIndex((opt) => opt === q.correctAnswer);

    return {
      id: q.id,
      lessonId: q.lessonId,
      level: q.level,
      targetLevel: mapTargetLevel(q.level),
      type: "practice",
      difficulty: mapDifficulty(q.level),
      question: q.question,
      options,
      correctAnswerId: correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : "A",
      explanation: q.explanation,
      tags: generateTags(q),
    };
  });
}