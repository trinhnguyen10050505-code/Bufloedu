"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStudent, registerTeacher } from "@/lib/auth-service";
import { GRADIENT_PRIMARY, CARD_BASE, BUTTON_PRIMARY } from "@/lib/theme";

type RoleTab = "student" | "teacher";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleTab>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    password: "",
    school: "",
    grade: "",
  });

  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    password: "",
    school: "",
    subject: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      if (role === "student") {
        await registerStudent(studentForm);
        router.push("/student");
      } else {
        await registerTeacher(teacherForm);
        router.push("/teacher/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className={`${GRADIENT_PRIMARY} rounded-[32px] p-8 text-white shadow-lg md:p-10`}>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
            Tạo tài khoản mới
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Bắt đầu sử dụng nền tảng học tập Khoa học tự nhiên
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50">
            Hệ thống sẽ hiển thị giao diện và tính năng phù hợp theo đúng đối tượng
            đăng nhập là học sinh hoặc giáo viên.
          </p>
        </section>

        <section className={`${CARD_BASE} p-6 sm:p-8`}>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`rounded-2xl px-4 py-3 font-semibold ${
                role === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Học sinh
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`rounded-2xl px-4 py-3 font-semibold ${
                role === "teacher"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Giáo viên
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {role === "student" ? (
              <>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Họ và tên"
                  value={studentForm.fullName}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, fullName: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Email"
                  value={studentForm.email}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Mật khẩu"
                  value={studentForm.password}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, password: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Trường học"
                  value={studentForm.school}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, school: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Lớp"
                  value={studentForm.grade}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, grade: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Họ và tên"
                  value={teacherForm.fullName}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, fullName: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Email"
                  value={teacherForm.email}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Mật khẩu"
                  value={teacherForm.password}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, password: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Trường học"
                  value={teacherForm.school}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, school: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Bộ môn"
                  value={teacherForm.subject}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, subject: e.target.value })
                  }
                />
              </>
            )}

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${BUTTON_PRIMARY} w-full rounded-2xl px-5 py-3 font-semibold disabled:opacity-60`}
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}