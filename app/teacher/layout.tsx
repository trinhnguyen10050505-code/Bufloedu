import Link from "next/link";
import Image from "next/image";

const navItems = [
  {
    href: "/teacher/dashboard",
    label: "Dashboard",
    desc: "Tổng quan lớp học",
    icon: "📊",
  },
  {
    href: "/teacher/classes",
    label: "Lớp học",
    desc: "Quản lý mã lớp",
    icon: "🏫",
  },
  {
    href: "/teacher/students",
    label: "Học sinh",
    desc: "Theo dõi từng em",
    icon: "👩‍🎓",
  },
  {
    href: "/teacher/materials",
    label: "Học liệu",
    desc: "Tài liệu & bài học",
    icon: "📚",
  },
  {
    href: "/teacher/assignments",
    label: "Giao bài",
    desc: "Nhiệm vụ học tập",
    icon: "📝",
  },
  {
    href: "/teacher/reports",
    label: "Báo cáo",
    desc: "Tiến bộ & cảnh báo",
    icon: "📈",
  },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <Link href="/teacher/dashboard" className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-blue-50">
              <Image
                src="/bu-macost.png"
                alt="Buflo AI"
                fill
                className="object-contain p-1.5"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                Buflo AI
              </p>
              <h1 className="text-lg font-black leading-tight text-slate-900">
                Khu giáo viên
              </h1>
            </div>
          </Link>

          <div className="mt-7 rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-5 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
              Điều phối học tập
            </p>

            <h2 className="mt-2 text-2xl font-black">Giáo viên</h2>

            <p className="mt-3 text-sm leading-7 text-blue-50">
              Theo dõi năng lực, giao bài đúng lớp và phát hiện sớm học sinh cần hỗ trợ.
            </p>
          </div>

          <nav className="mt-7 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-blue-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg transition group-hover:bg-blue-100">
                  {item.icon}
                </span>

                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {item.desc}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-[24px] border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-700">Gợi ý vận hành</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Xem nhóm Bu Chăm chỉ trước, sau đó giao bài ôn phần yếu theo lớp.
            </p>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}