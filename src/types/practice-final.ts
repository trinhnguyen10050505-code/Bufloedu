export type StudentLevel = "trungbinh" | "kha" | "gioi";

export type QuestionLevel = "nhanbiet" | "thonghieu" | "vandung";

export type PracticeMode =
  | "recommended"
  | "by_lesson"
  | "by_level"
  | "weak_part"
  | "diagnostic"
  | "quick_test";

export type OptionId = "A" | "B" | "C" | "D";

export type PracticeOption = {
  id: OptionId;
  text: string;
};

export type PracticeQuestion = {
  id: string;
  lessonId: string;
  lessonOrder: number;
  lessonTitle: string;
  level: QuestionLevel;
  question: string;
  options: PracticeOption[];
  correctOptionId: OptionId;
  source: "BAI_TAP_FINAL_DOCX";
  needsReview?: boolean;
};

export type PracticeResultDetail = {
  questionId: string;
  lessonId: string;
  level: QuestionLevel;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
};

export type PracticeResult = {
  score: number;
  totalQuestions: number;
  accuracy: number;
  level: StudentLevel;
  questionIds: string[];
  answerDetails: PracticeResultDetail[];
  weakLessonIds: string[];
};