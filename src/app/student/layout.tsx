import Link from "next/link";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr]">
      <aside className="border-r p-5 space-y-4">
        <h2 className="text-2xl font-bold">Học sinh</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/student/dashboard">Dashboard</Link>
          <Link href="/student/diagnostic-test">Test đầu vào</Link>
          <Link href="/student/lessons">Bài học</Link>
          <Link href="/student/focus-room">Focus Room</Link>
          <Link href="/student/mindmap">Mindmap</Link>
          <Link href="/student/exercises">Bài tập</Link>
          <Link href="/student/uploads">Tải dữ liệu</Link>
          <Link href="/student/results">Kết quả</Link>
        </nav>
      </aside>

      <main className="p-8">{children}</main>
    </div>
  );
}