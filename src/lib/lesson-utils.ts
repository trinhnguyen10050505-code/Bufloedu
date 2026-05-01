import { lessonsContent } from "@/data/lessons-content";
import { questionBank } from "@/data/question-bank";
import { Question } from "@/types/question";

type LessonContentMap = typeof lessonsContent;
type LessonId = keyof LessonContentMap;

export function getLessonById(lessonId: string) {
  return lessonsContent[lessonId as LessonId] ?? null;
}

export function getAllLessons() {
  return Object.entries(lessonsContent).map(([lessonId, lesson]) => ({
    lessonId,
    ...lesson,
  }));
}

export function getQuestionsByLesson(lessonId: string): Question[] {
  return questionBank.filter((question: Question) => question.lessonId === lessonId);
}

export function getQuickTestQuestions(lessonId: string, count = 5): Question[] {
  return getQuestionsByLesson(lessonId).slice(0, count);
}

export function getQuestionsByLessonAndLevel(
  lessonId: string,
  level: Question["level"]
): Question[] {
  return getQuestionsByLesson(lessonId).filter(
    (question: Question) => question.level === level
  );
}

export function getLessonQuestionCount(lessonId: string): number {
  return getQuestionsByLesson(lessonId).length;
}

export function hasLesson(lessonId: string): boolean {
  return Boolean(getLessonById(lessonId));
}

export function getRelatedLessonSummary(lessonId: string) {
  const lesson = getLessonById(lessonId);
  const questions = getQuestionsByLesson(lessonId);

  if (!lesson) {
    return null;
  }

  return {
    lessonId,
    lesson,
    totalQuestions: questions.length,
    nhanbietCount: questions.filter((q) => q.level === "nhanbiet").length,
    thonghieuCount: questions.filter((q) => q.level === "thonghieu").length,
    vandungCount: questions.filter((q) => q.level === "vandung").length,
  };
}