import Link from "next/link";
import BuLogo from "@/components/common/BuLogo";

const teacherNavItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/teacher/classes", label: "Lớp học", icon: "🏫" },
  { href: "/teacher/students", label: "Học sinh", icon: "👨‍🎓" },
  { href: "/teacher/materials", label: "Học liệu", icon: "📚" },
  { href: "/teacher/generated-materials", label: "Nội dung đã tạo", icon: "✨" },
  { href: "/teacher/assignments", label: "Giao bài", icon: "📝" },
  { href: "/teacher/reports", label: "Báo cáo", icon: "📈" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
          <aside className="border-r border-slate-200 bg-white/95 px-5 py-6 backdrop-blur">
            <div className="mb-6">
              <BuLogo href="/" />
            </div>

            <div className="rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-5 text-white shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                Khu quản lý giáo viên
              </p>
              <h2 className="mt-2 text-2xl font-bold">Bảng điều hành lớp học</h2>
              <p className="mt-2 text-sm leading-6 text-blue-50">
                Theo dõi lớp, giao bài, quản lý học liệu và đọc dữ liệu học tập của học sinh
                trên cùng một hệ thống thống nhất.
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {teacherNavItems.map((item) => (
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
              <p className="text-sm font-semibold text-blue-700">Gợi ý điều hành</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cô/thầy nên theo dõi theo thứ tự:
                <span className="font-medium text-slate-800">
                  {" "}
                  lớp học → học sinh → học liệu → giao bài → báo cáo
                </span>
              </p>
            </div>
          </aside>

          <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

    </>
  );
}