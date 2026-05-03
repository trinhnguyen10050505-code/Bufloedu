import Link from "next/link";
import BuLogo from "@/components/common/BuLogo";
import BuChatWidget from "@/components/student/BuChatWidget";
import AuthGuard from "@/components/common/AuthGuard";

const navItems = [
  { href: "/student", label: "Trang học tập", icon: "🏠" },
  { href: "/student/diagnostic-test", label: "Test đầu vào", icon: "🧪" },
  { href: "/student/exercises", label: "Luyện tập", icon: "✍️" },
  { href: "/student/focus-room", label: "Focus Room", icon: "⏱️" },
  { href: "/student/mindmap", label: "Mindmap", icon: "🧠" },
  { href: "/student/results", label: "Kết quả", icon: "📊" },
  { href: "/student/uploads", label: "Tải dữ liệu", icon: "📁" },
  { href: "/student/generated-materials", label: "Nội dung từ tài liệu", icon: "✨" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowRole="student">
      <div className="min-h-screen bg-slate-50">
        <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
          <aside className="border-r border-slate-200 bg-white/95 px-5 py-6 backdrop-blur">
            <div className="mb-6">
              <BuLogo href="/student" />
            </div>

            <div className="rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-5 text-white shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                Bu đồng hành
              </p>
              <h2 className="mt-2 text-2xl font-bold">Khu học sinh</h2>
              <p className="mt-2 text-sm leading-6 text-blue-50">
                Bu sẽ cùng em học theo đúng năng lực, luyện tập từng bước và theo dõi tiến bộ mỗi ngày.
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 rounded-[24px] border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">Bu nhắn nhỏ</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Nếu em chưa chắc bài, Bu gợi ý em học theo thứ tự:
                <span className="font-medium text-slate-800">
                  {" "}lý thuyết → luyện tập → kiểm tra nhanh → xem kết quả
                </span>
              </p>
            </div>
          </aside>

          <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      <BuChatWidget
        lessonTitle="Hành trình học tập cùng Bu"
        currentLevelLabel="Bu luôn đồng hành"
        weakTopics={[]}
      />
    </AuthGuard>
  );
}