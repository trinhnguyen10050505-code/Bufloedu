import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#020617] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">Buflo AI</h3>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Nền tảng học Khoa học tự nhiên với E-learning, luyện tập, Focus Room,
            mindmap và kết quả học tập được cá nhân hóa.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold">Điều hướng học tập</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li><Link href="/" className="hover:text-white">Trang chủ</Link></li>
            <li><Link href="/student/lessons" className="hover:text-white">Video bài học</Link></li>
            <li><Link href="/student/exercises" className="hover:text-white">Luyện tập</Link></li>
            <li><Link href="/student/focus-room" className="hover:text-white">Focus Room</Link></li>
            <li><Link href="/intro" className="hover:text-white">Giới thiệu dự án</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold">Cộng đồng học tập</h3>
          <div className="mt-5 flex gap-3">
            {["🌐", "f", "🇻🇳"].map((item) => (
              <div
                key={item}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Kết nối học sinh và giáo viên để cùng trao đổi bài học, luyện tập và
            theo dõi tiến độ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-800 px-6 py-8 text-center">
        <p className="text-sm text-slate-400">© 2026 Buflo AI. All rights reserved.</p>
        <p className="mt-3 text-sm text-slate-400">
          Đồng hành cùng học sinh trong hành trình chinh phục Khoa học tự nhiên 8.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Quay lại trang chủ
          </Link>
          <Link
            href="/intro"
            className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Xem giới thiệu dự án
          </Link>
        </div>
      </div>
    </footer>
  );
}