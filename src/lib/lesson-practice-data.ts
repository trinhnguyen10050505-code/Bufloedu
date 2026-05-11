import { practiceBank } from "@/data/practice-bank.generated";

export type LessonPracticeStats = {
  total: number;
  nhanbiet: number;
  thonghieu: number;
  vandung: number;
};

export function getLessonPracticeStats(lessonId: string): LessonPracticeStats {
  const questions = practiceBank.filter(q => q.lessonId === lessonId);

  const stats: LessonPracticeStats = {
    total: questions.length,
    nhanbiet: 0,
    thonghieu: 0,
    vandung: 0,
  };

  for (const question of questions) {
    stats[question.level]++;
  }

  return stats;
}