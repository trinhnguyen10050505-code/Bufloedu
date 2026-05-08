import { normalizeQuestionBank } from "@/lib/question-utils";
import { rawQuestionBank } from "./question-bank-raw";
import { lessonCatalog, type LessonId } from "./lesson-catalog";
import type { OptionId, PracticeQuestion } from "@/types/practice-final";

export const questionBank = normalizeQuestionBank(rawQuestionBank);

const lessonMetaMap = new Map(lessonCatalog.map((lesson) => [lesson.id, lesson]));

export const practiceBank: PracticeQuestion[] = questionBank.map((question) => {
  const lessonMeta = lessonMetaMap.get(question.lessonId as LessonId);

  return {
    id: question.id,
    lessonId: question.lessonId,
    lessonOrder: lessonMeta?.order ?? 0,
    lessonTitle: lessonMeta?.title ?? question.lessonId,
    level: question.level,
    question: question.question,
    options: question.options.map((option) => ({
      id: option.id as OptionId,
      text: option.text,
    })),
    correctOptionId: question.correctAnswerId as OptionId,
    source: "BAI_TAP_FINAL_DOCX",
  };
});

export type PracticeLesson = {
  lessonId: string;
  lessonOrder: number;
  lessonTitle: string;
  total: number;
};

export function getPracticeLessons(): PracticeLesson[] {
  const lessonMap: Record<string, PracticeLesson> = {};

  for (const question of practiceBank) {
    if (!lessonMap[question.lessonId]) {
      lessonMap[question.lessonId] = {
        lessonId: question.lessonId,
        lessonOrder: question.lessonOrder,
        lessonTitle: question.lessonTitle,
        total: 0,
      };
    }

    lessonMap[question.lessonId].total += 1;
  }

  return Object.values(lessonMap).sort((a, b) => a.lessonOrder - b.lessonOrder);
}