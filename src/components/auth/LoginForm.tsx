"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginWithEmail, resetPassword } from "@/lib/auth-service";

export default function LoginForm() {
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
  );
}
