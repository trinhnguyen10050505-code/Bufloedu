"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth-service";
import { GRADIENT_PRIMARY, CARD_BASE, BUTTON_PRIMARY } from "@/lib/theme";
import BuLogo from "@/components/common/BuLogo";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const profile = await loginUser(email, password);

      if (profile.role === "student") {
        router.push("/student");
      } else {
        router.push("/teacher/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Bu chưa thể đăng nhập cho em lúc này.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* LEFT */}
        <section className={`${GRADIENT_PRIMARY} overflow-hidden rounded-[32px] p-8 text-white shadow-lg md:p-10`}>
          <div className="mb-6">
            <BuLogo showText={false} size={52} />
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
                Chào mừng trở lại
              </p>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Bu đang đợi em quay lại hệ thống học tập
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50">
                Đăng nhập để Bu tiếp tục đồng hành cùng em trong bài test chẩn đoán,
                luyện tập cá nhân hóa, Focus Room, mindmap và theo dõi tiến bộ học tập.
              </p>

              <div className="mt-6 space-y-3 text-sm text-white">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Học sinh: học theo bài, luyện tập, Focus Room, mindmap, kết quả
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  Giáo viên: quản lý lớp, giao bài, theo dõi tiến độ học sinh
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[220px]">
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-white/10 p-4 backdrop-blur">
                <div className="relative h-full w-full">
                  <Image
                    src="/logos/bu-login.png"
                    alt="Bu linh vật"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="mt-3 text-center text-sm font-medium text-blue-100">
                Bu luôn ở đây để hỗ trợ em
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className={`${CARD_BASE} p-6 sm:p-8`}>
          <h2 className="text-2xl font-bold text-slate-800">Đăng nhập</h2>
          <p className="mt-2 text-slate-600">
            Nhập thông tin để Bu đưa em quay lại đúng khu vực học tập của mình.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                placeholder="nhapemail@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                placeholder="••••••••"
              />
            </div>

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
              {loading ? "Bu đang đăng nhập cho em..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}