import Link from "next/link";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr]">
      <aside className="border-r p-5 space-y-4">
        <h2 className="text-2xl font-bold">Giáo viên</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/teacher/dashboard">Dashboard</Link>
          <Link href="/teacher/classes">Lớp học</Link>
          <Link href="/teacher/students">Học sinh</Link>
          <Link href="/teacher/materials">Học liệu</Link>
          <Link href="/teacher/assignments">Giao bài</Link>
          <Link href="/teacher/reports">Báo cáo</Link>
        </nav>
      </aside>

      <main className="p-8">{children}</main>
    </div>
  );
}