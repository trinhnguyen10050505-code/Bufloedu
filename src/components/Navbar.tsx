import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/buflo-logo.png"
            alt="Buflo AI Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Buflo AI</h1>
            <p className="text-xs text-slate-500">Smart Learning Platform</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-slate-700 font-medium">
          <Link href="/intro">Giới thiệu</Link>
          <Link href="/student/dashboard">Học sinh</Link>
          <Link href="/teacher/dashboard">Giáo viên</Link>
          <Link href="/login">Đăng nhập</Link>
        </nav>

        <Link
          href="/register"
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-200"
        >
          Bắt đầu
        </Link>
      </div>
    </header>
  );
}