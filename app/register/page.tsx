"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BuLogo from "@/components/common/BuLogo";
import { registerUser, UserRole } from "@/lib/auth-service";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [subject, setSubject] = useState("Khoa học tự nhiên");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setMessage("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }

    if (password.length < 6) {
      setMessage("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }

    if (role === "student" && !classCode.trim()) {
      setMessage("Học sinh cần nhập mã lớp do giáo viên cung cấp.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await registerUser({
        email,
        password,
        fullName,
        role,
        school,
        grade,
        className,
        classCode,
        subject,
      });

      if (result.role === "student") {
        router.push("/student");
      } else {
        router.push("/teacher/dashboard");
      }
    } catch (error: any) {
      setMessage(error?.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-7xl">
        <BuLogo href="/" />
      </div>

      <main className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="rounded-[40px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            Tạo tài khoản
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            Tham gia lớp học thông minh cùng Bu
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-blue-50">
            Học sinh cần mã lớp để vào đúng lớp giáo viên đã tạo. Giáo viên có thể
            tạo lớp, đặt mã lớp và giao bài cho học sinh.
          </p>

          <div className="relative mt-10 h-64">
            <Image
              src="/bu-mascot.png"
              alt="Bu"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </section>

        <section className="rounded-[36px] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex gap-3">
            <button
              onClick={() => setRole("student")}
              className={`rounded-2xl px-5 py-3 font-semibold ${
                role === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Học sinh
            </button>

            <button
              onClick={() => setRole("teacher")}
              className={`rounded-2xl px-5 py-3 font-semibold ${
                role === "teacher"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Giáo viên
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Họ và tên"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mật khẩu"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={school}
              onChange={(event) => setSchool(event.target.value)}
              placeholder="Trường học"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            {role === "student" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={grade}
                    onChange={(event) => setGrade(event.target.value)}
                    placeholder="Khối"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <input
                    value={className}
                    onChange={(event) => setClassName(event.target.value)}
                    placeholder="Tên lớp ở trường"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <input
                  value={classCode}
                  onChange={(event) => setClassCode(event.target.value.toUpperCase())}
                  placeholder="Mã lớp giáo viên cung cấp, ví dụ: KHTN8A1"
                  className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold uppercase outline-none focus:border-blue-500"
                />

                <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-600">
                  Bu nhắc: Mã lớp giúp em nhận đúng bài giáo viên giao và được giáo
                  viên theo dõi tiến độ.
                </div>
              </>
            ) : (
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Môn phụ trách"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            )}

            {message ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            ) : null}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>

            <p className="text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-bold text-blue-600">
                Đăng nhập
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}