"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import BuLogo from "@/components/common/BuLogo";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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
                src="/logos/bu-login.png"
                alt="Bu"
                fill
                sizes="448px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="rounded-[36px] bg-white p-8 text-center">Đang tải...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}