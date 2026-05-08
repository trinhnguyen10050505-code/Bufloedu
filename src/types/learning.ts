export type StudentLevel = "trungbinh" | "kha" | "gioi";

export type ActivityType =
  | "lesson_view"
  | "elearning_view"
  | "practice"
  | "quick_test"
  | "diagnostic_test"
  | "focus_room"
  | "mindmap_puzzle"
  | "web_active_time";

export type LessonId =
  | "lesson-2"
  | "lesson-3"
  | "lesson-4"
  | "lesson-5"
  | "lesson-6"
  | "lesson-7"
  | "lesson-8"
  | "lesson-9"
  | "lesson-10"
  | "lesson-11"
  | "lesson-12";

export interface TheorySection {
  id: string;
  title: string;
  items: string[];
}

export interface LessonTheory {
  lessonId: string;
  title: string;
  shortTitle: string;
  description: string;
  chapter: string;
  elearningUrl: string;
  localEntry: string;
  theory: TheorySection[];
}