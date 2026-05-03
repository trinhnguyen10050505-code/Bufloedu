export type UserRole = "student" | "teacher";

export type StudentLevel = "trungbinh" | "kha" | "gioi";

export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface StudentProfile {
  uid: string;
  currentLevel: StudentLevel;
  strengths: string[];
  weaknesses: string[];
  recommendedLessonIds: string[];
  totalStudyMinutes: number;
  streakDays: number;
}

export interface TeacherProfile {
  uid: string;
  schoolName?: string;
  subject?: string;
  classIds: string[];
}