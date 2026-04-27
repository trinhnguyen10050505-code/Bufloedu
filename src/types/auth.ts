export type UserRole = "student" | "teacher";

export interface AppUserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  school?: string;
  grade?: string;
  subject?: string;
  createdAt: string;
}

export interface RegisterStudentPayload {
  fullName: string;
  email: string;
  password: string;
  school: string;
  grade: string;
}

export interface RegisterTeacherPayload {
  fullName: string;
  email: string;
  password: string;
  school: string;
  subject: string;
}