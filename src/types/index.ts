export type UserRole = "student" | "teacher";

export type StudentLevel = "trungbinh" | "kha" | "gioi";

export type PracticeLevel = "nhanbiet" | "thonghieu" | "vandung";

export type ProgressActivityType =
  | "practice"
  | "quick_test"
  | "focus_room"
  | "diagnostic_test";

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  school: string;
  grade?: string;
  subject?: string;
  diagnosticCompleted?: boolean;
  currentLevel?: StudentLevel;
  weakLessonIds?: string[];
  recommendedLessonIds?: string[];
  recommendedPracticeLevels?: PracticeLevel[];
  nextAction?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type DiagnosticResultDoc = {
  studentId: string;
  score: number;
  totalQuestions: number;
  correctRate: number;
  hardCorrect: number;
  completionTime: number;
  level: StudentLevel;
  weakLessonIds: string[];
  recommendedLessonIds: string[];
  recommendedPracticeLevels: PracticeLevel[];
  nextAction: string;
  createdAt?: unknown;
};

export type StudentProgressDoc = {
  studentId: string;
  lessonId: string;
  activityType: ProgressActivityType;
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  level?: StudentLevel;
  durationInSeconds?: number;
  createdAt?: unknown;
};

export type TeacherClassDoc = {
  id?: string;
  teacherId: string;
  className: string;
  grade: string;
  school: string;
  createdAt?: unknown;
};

export type AssignmentDoc = {
  id?: string;
  teacherId: string;
  classId: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt?: unknown;
};

export type StudentRecommendation = {
  recommendedLessonIds: string[];
  recommendedPracticeLevels: PracticeLevel[];
  nextAction: string;
};