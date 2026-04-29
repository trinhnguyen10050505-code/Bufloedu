"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getTeacherClassesWithCounts } from "@/lib/teacher-reader";

export default function TeacherClassesPage() {
  const { profile, loading } = useCurrentUser();
  const [classes, setClasses] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid || profile.role !== "teacher") {
        setPageLoading(false);
        return;
      }

      try {
        const data = await getTeacherClassesWithCounts(profile.uid);
        setClasses(data);
      } catch (error) {
        console.error("Lỗi tải lớp học:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid, profile?.role]);

  if (loading || pageLoading) {
    return <div className="p-10">Đang tải dữ liệu lớp học...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Quản lý lớp học
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Danh sách lớp phụ trách</h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Theo dõi số học sinh, tỉ lệ hoàn thành và tình trạng học tập theo từng lớp
          để chủ động ra quyết định giảng dạy.
        </p>
      </section>

      {classes.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {classes.map((item) => (
            <div key={item.id} className="rounded-[28px] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800">{item.className}</h2>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Khối</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">{item.grade}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Số học sinh</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">{item.studentsCount}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Tỉ lệ hoàn thành</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {item.completionRate}%
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Trường</p>
                  <p className="mt-2 text-base font-semibold text-slate-800">{item.school}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">
            Chưa có lớp nào trong Firebase. Hãy tạo collection
            <span className="font-semibold text-slate-800"> classes </span>
            rồi thêm dữ liệu lớp để hiển thị tại đây.
          </p>
        </div>
      )}
    </div>
  );
}