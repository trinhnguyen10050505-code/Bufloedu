import Link from "next/link";
import BuLogo from "@/components/common/BuLogo";
import AuthGuard from "@/components/common/AuthGuard";
import BuChatWidget from "@/components/student/BuChatWidget";
import StudentAutoStudyTracker from "@/components/student/StudentAutoStudyTracker";

const navItems = [
  { href: "/student", label: "Trang chính", icon: "🏠", desc: "Tổng quan học tập" },
  { href: "/student/lessons", label: "Học bài", icon: "🎥", desc: "E-learning và lý thuyết" },
  { href: "/student/exercises", label: "Luyện tập", icon: "✍️", desc: "Trộn câu nhiều lần" },
  { href: "/student/focus-room", label: "Focus", icon: "⏱️", desc: "Tập trung học" },
  { href: "/student/mindmap", label: "Mindmap", icon: "🧠", desc: "Ghi nhớ kiến thức" },
  { href: "/student/results", label: "Kết quả", icon: "📊", desc: "Xem tiến bộ" },
  { href: "/student/uploads", label: "Tải dữ liệu", icon: "📁", desc: "Tài liệu cá nhân" },
  { href: "/student/assignments", label: "Bài giao", icon: "📝", desc: "Nhiệm vụ từ giáo viên" },
];

const mobileNavItems = navItems.slice(0, 5);

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowRole="student">
      <div className="min-h-screen bg-slate-50">
        <div className="grid min-h-screen lg:grid-cols-[310px_1fr]">
          <aside className="hidden border-r border-slate-200 bg-white/95 px-5 py-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
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

          <main className="min-w-0 px-4 pb-28 pt-4 sm:px-6 sm:pt-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between rounded-[24px] bg-white px-4 py-3 shadow-sm lg:hidden">
              <BuLogo href="/student" />
            </div>

            {children}
          </main>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-[70] border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-12px_35px_rgba(15,23,42,0.10)] backdrop-blur lg:hidden">
          <div className="grid grid-cols-5 gap-1">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-center text-[11px] font-bold text-slate-600 active:bg-blue-50"
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="mt-1 line-clamp-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <StudentAutoStudyTracker />
        <BuChatWidget />
      </div>
    </AuthGuard>
  );
}