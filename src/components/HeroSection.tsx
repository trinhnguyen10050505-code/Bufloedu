import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white" />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            Học tập thông minh cùng AI
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Buflo AI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Nền tảng học tập cá nhân hóa thế hệ mới
            </span>
          </h1>

          <p className="text-slate-600 text-lg leading-8 mb-8 max-w-xl">
            Học sinh học đúng năng lực, giáo viên quản lý thông minh, tài liệu
            được chuyển hóa thành bài học, mindmap, bài tập và báo cáo hiệu quả.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-200"
            >
              Dùng thử ngay
            </Link>

            <Link
              href="/intro"
              className="px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-800 font-semibold"
            >
              Xem giới thiệu
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/70 shadow-[0_20px_80px_rgba(37,99,235,0.18)] p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-[2rem]" />
            <div className="relative flex flex-col items-center text-center">
              <Image
                src="/buflo-logo.png"
                alt="Buflo AI"
                width={220}
                height={220}
                className="drop-shadow-xl"
              />
              <h3 className="text-2xl font-bold text-slate-900 mt-4">
                Trợ lý học tập thông minh
              </h3>
              <p className="text-slate-600 mt-3 leading-7">
                Biến video, PDF, Word thành nội dung học tập có cấu trúc,
                trực quan và phù hợp với từng người học.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}