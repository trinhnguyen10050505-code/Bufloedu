import Link from "next/link";
import BuLogo from "@/components/common/BuLogo";
import AuthGuard from "@/components/common/AuthGuard";
import BuChatWidget from "@/components/student/BuChatWidget";
import StudentAutoStudyTracker from "@/components/student/StudentAutoStudyTracker";

const navItems = [
  { href: "/student", label: "Trang chính", icon: "🏠", desc: "Tổng quan học tập" },
  { href: "/student/lessons", label: "Học bài", icon: "🎥", desc: "E-learning và lý thuyết" },
  { href: "/student/exercises", label: "Luyện tập", icon: "✍️", desc: "Trộn câu nhiều lần" },
  { href: "/student/focus-room", label: "Focus Room", icon: "⏱️", desc: "Tập trung học" },
  { href: "/student/mindmap", label: "Mindmap", icon: "🧠", desc: "Ghi nhớ kiến thức" },
  { href: "/student/results", label: "Kết quả", icon: "📊", desc: "Xem tiến bộ" },
  { href: "/student/uploads", label: "Tải dữ liệu", icon: "📁", desc: "Tài liệu cá nhân" },
  { href: "/student/assignments", label: "Bài được giao", icon: "📝", desc: "Nhiệm vụ từ giáo viên" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowRole="student">
      <div className="min-h-screen bg-slate-50">
        <div className="grid min-h-screen lg:grid-cols-[310px_1fr]">
          <aside className="sticky top-0 h-screen overflow-y-auto border-r border-slate-200 bg-white/95 px-5 py-6">
            <BuLogo href="/student" />

            <div className="mt-6 rounded-[30px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-5 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Bu đồng hành
              </p>

              <h2 className="mt-2 text-2xl font-bold">Khu học sinh</h2>

              <p className="mt-2 text-sm leading-6 text-blue-50">
                Học bài → luyện tập → quick-test → xem kết quả, không chồng chéo.
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex gap-3 rounded-2xl px-4 py-3 transition hover:bg-slate-100"
                >
                  <span className="text-lg">{item.icon}</span>

                  <span>
                    <span className="block text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                      {item.label}
                    </span>

                    <span className="text-xs text-slate-500">{item.desc}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>

        <StudentAutoStudyTracker />
        <BuChatWidget />
      </div>
    </AuthGuard>
  );
}