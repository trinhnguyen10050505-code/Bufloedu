import { lessonsContent } from "@/data/lessons.content";
import { questionBank } from "@/data/question-bank";
import { Question } from "@/types/question";

export function getLessonById(lessonId: string) {
  return lessonsContent[lessonId];
}

export function getQuestionsByLesson(lessonId: string): Question[] {
  return questionBank.filter((q: Question) => q.lessonId === lessonId);
}

export function getQuickTestQuestions(lessonId: string, count = 5): Question[] {
  return questionBank
    .filter((q: Question) => q.lessonId === lessonId)
    .slice(0, count);
}