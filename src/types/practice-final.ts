export type StudentLevel = "trungbinh" | "kha" | "gioi";

export type QuestionLevel =
  | "nhanbiet"
  | "thonghieu"
  | "vandung";

export type PracticeMode =
  | "recommended"
  | "by_lesson"
  | "by_level"
  | "weak_part"
  | "diagnostic"
  | "quick_test";

export type OptionId = "A" | "B" | "C" | "D";

export type PracticeSource = "BAI_TAP_FINAL_DOCX";

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

  source: PracticeSource;

  /**
   * Sư phạm và cá nhân hóa
   */
  topic?: string;
  learningGoal?: string;
  requiredSkill?: string;

  /**
   * Hiển thị ngay sau câu hỏi
   */
  hint?: string;
  reviewNote?: string;
  formula?: string;
  explanation?: string;

  /**
   * Kết nối ôn tập
   */
  mindmapNode?: string;
  relatedTheoryId?: string;
  relatedLessonPart?: string;

  /**
   * Hỗ trợ học sinh yếu / khá giỏi
   */
  needsReview?: boolean;
  foundationQuestion?: boolean;
  forWeakStudents?: boolean;
  forAdvancedStudents?: boolean;

  /**
   * Đặc thù bài tính toán Hóa học
   */
  isCalculation?: boolean;
  allowCalculator?: boolean;
  recommendedTimeSeconds?: number;

  /**
   * Adaptive learning
   */
  difficultyScore?: number;
  adaptiveWeight?: number;
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

export type StudentProgressItem = {
  id: string;
  studentId: string;
  mode: PracticeMode;
  result: PracticeResult;
};

export type StudentProgressSummary = {
  currentLevel: StudentLevel;
  completedLessonsCount: number;
  totalFocusMinutes: number;
  recentResults: StudentProgressItem[];
  suggestedLessons: string[];
  suggestedActions: string[];
  weakTopics: string[];
  recentlyAnsweredQuestionIds: string[];
};