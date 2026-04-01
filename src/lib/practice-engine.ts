import { Question, StudentLevel } from "../types";
import { questionBank } from "../data/question-bank";

export function getQuestionsByLesson(lessonId: string): Question[] {
  return questionBank.filter((q) => q.lessonId === lessonId);
}

export function getPersonalizedQuestions(
  lessonId: string,
  level: StudentLevel
): Question[] {
  const all = questionBank.filter((q) => q.lessonId === lessonId);

  const nhanBiet = all.filter((q) => q.level === "nhanbiet");
  const thongHieu = all.filter((q) => q.level === "thonghieu");
  const vanDung = all.filter((q) => q.level === "vandung");

  if (level === "trungbinh") {
    return [
      ...nhanBiet.slice(0, 4),
      ...thongHieu.slice(0, 2),
      ...vanDung.slice(0, 1),
    ];
  }

  if (level === "kha") {
    return [
      ...nhanBiet.slice(0, 2),
      ...thongHieu.slice(0, 3),
      ...vanDung.slice(0, 2),
    ];
  }

  return [
    ...nhanBiet.slice(0, 1),
    ...thongHieu.slice(0, 2),
    ...vanDung.slice(0, 4),
  ];
}