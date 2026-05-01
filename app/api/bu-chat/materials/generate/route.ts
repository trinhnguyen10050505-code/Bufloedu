import { NextResponse } from "next/server";
import { createGeneratedMaterialRecord } from "@/lib/materials";

function splitIntoSentences(text: string) {
  return text
    .split(/[\.\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildSummary(sourceText: string) {
  const sentences = splitIntoSentences(sourceText);
  return sentences.slice(0, 5).join(". ") + (sentences.length > 0 ? "." : "");
}

function buildReviewNotes(sourceText: string) {
  return splitIntoSentences(sourceText).slice(0, 6);
}

function buildFlashcards(sourceText: string) {
  const notes = splitIntoSentences(sourceText).slice(0, 5);

  return notes.map((item, index) => ({
    front: `Ý chính ${index + 1}`,
    back: item,
  }));
}

function buildMcqQuestions(sourceText: string) {
  const notes = splitIntoSentences(sourceText).slice(0, 5);

  return notes.map((item, index) => ({
    question: `Theo tài liệu, ý nào đúng nhất về nội dung số ${index + 1}?`,
    options: [
      item,
      "Phương án nhiễu 1",
      "Phương án nhiễu 2",
      "Phương án nhiễu 3",
    ],
    correctAnswer: item,
    explanation: `Đây là ý được lấy trực tiếp từ nội dung tài liệu nguồn.`,
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      sourceMaterialId,
      lessonId,
      title,
      sourceText,
    }: {
      sourceMaterialId: string;
      lessonId?: string;
      title: string;
      sourceText: string;
    } = body;

    if (!sourceMaterialId || !title || !sourceText?.trim()) {
      return NextResponse.json(
        { error: "Thiếu sourceMaterialId, title hoặc sourceText." },
        { status: 400 }
      );
    }

    const summary = buildSummary(sourceText);
    const reviewNotes = buildReviewNotes(sourceText);
    const mcqQuestions = buildMcqQuestions(sourceText);
    const flashcards = buildFlashcards(sourceText);

    const generatedId = await createGeneratedMaterialRecord({
      sourceMaterialId,
      lessonId,
      title: `${title} - Bộ nội dung học tập`,
      summary,
      reviewNotes,
      mcqQuestions,
      flashcards,
    });

    return NextResponse.json({
      ok: true,
      generatedId,
      summary,
      reviewNotes,
      mcqQuestions,
      flashcards,
    });
  } catch (error) {
    console.error("Generate material error:", error);
    return NextResponse.json(
      { error: "Không thể sinh nội dung học tập từ tài liệu." },
      { status: 500 }
    );
  }
}