import Link from "next/link";

export default function TeacherIndexPage() {
  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Khu giáo viên</h1>
      <p className="mt-3 text-slate-600">
        Chọn dashboard để bắt đầu quản lý lớp học và học liệu.
      </p>
      <Link
        href="/teacher/dashboard"
        className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Vào dashboard
      </Link>
    </div>
  );
}