export type UserRole = "student" | "teacher";

export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
}