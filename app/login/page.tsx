"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import BuLogo from "@/components/common/BuLogo";
import { loginWithEmail, resetPassword } from "@/lib/auth-service";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setMessageType("error");
      setMessage("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const user = await loginWithEmail(email, password);

      if (user.role === "student") {
        router.push(redirect.startsWith("/student") ? redirect : "/student");
        return;
      }

      if (user.role === "teacher") {
        router.push(
          redirect.startsWith("/teacher") ? redirect : "/teacher/dashboard"
        );
        return;
      }

      router.push("/");
    } catch (error: any) {
      setMessageType("error");
      setMessage(
        error?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email.trim()) {
      setMessageType("error");
      setMessage("Em cần nhập email trước để Bu gửi link đặt lại mật khẩu.");
      return;
    }

    try {
      setResetting(true);
      await resetPassword(email);

      setMessageType("success");
      setMessage(
        "Bu đã gửi email đặt lại mật khẩu. Em kiểm tra hộp thư hoặc mục spam nhé."
      );
    } catch (error: any) {
      setMessageType("error");
      setMessage(
        error?.message ||
          "Bu chưa gửi được email đặt lại mật khẩu. Em kiểm tra lại email nhé."
      );
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-7xl">
        <BuLogo href="/" />
      </div>

      <main className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl md:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-cyan-300/20" />

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Đăng nhập hệ thống
            </p>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
              Vào lớp học thông minh cùng Bu
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50">
              Học sinh học theo bài, luyện tập, quick-test, nhận bài giáo viên giao.
              Giáo viên quản lý lớp, giao bài và theo dõi tiến độ học sinh.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["🧪", "Test đầu vào", "Xác định mức học"],
                ["🎥", "E-learning", "Học theo từng bài"],
                ["📊", "Theo dõi", "Lịch sử và tiến bộ"],
              ].map(([icon, title, desc]) => (
                <div key={title} className="rounded-3xl bg-white/12 p-5">
                  <p className="text-3xl">{icon}</p>
                  <p className="mt-3 font-bold">{title}</p>
                  <p className="mt-1 text-sm text-blue-50">{desc}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-10 h-56 w-full max-w-md">
              <Image
                src="/bu-mascot.png"
                alt="Bu"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        <section className="rounded-[36px] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-blue-600">Chào mừng trở lại</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Đăng nhập tài khoản
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Nếu là học sinh, tài khoản của em sẽ tự liên kết với lớp qua mã lớp đã
            nhập khi đăng ký. Nếu là giáo viên, em sẽ vào bảng quản lý lớp học.
          </p>

          <div className="mt-6 grid gap-4">
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

            {message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            ) : null}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetting}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
            >
              {resetting ? "Đang gửi email..." : "Quên mật khẩu?"}
            </button>

            <p className="text-sm text-slate-600">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-blue-600">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}