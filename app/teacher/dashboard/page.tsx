"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getTeacherDashboardData } from "@/lib/progress-reader";

export default function TeacherDashboardPage() {
  const { profile, loading } = useCurrentUser();
  const [data, setData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid || profile.role !== "teacher") {
        setPageLoading(false);
        return;
      }

      try {
        const dashboardData = await getTeacherDashboardData(profile.uid);
        setData(dashboardData);
      } catch (error) {
        console.error("Lỗi tải dashboard giáo viên:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid, profile?.role]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">Đang tải dashboard giáo viên...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Chưa đăng nhập</h1>
          <p className="mt-3 text-slate-600">
            Hãy đăng nhập để sử dụng khu quản lý giáo viên.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Dashboard giáo viên
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Chào {profile.fullName}, đây là toàn cảnh lớp học của cô/thầy
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Theo dõi tiến độ học sinh, quản lý lớp, giao bài và đọc báo cáo trên cùng
          một hệ thống thống nhất, đúng tinh thần dạy học cá nhân hóa.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/teacher/assignments"
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Giao bài mới
          </Link>
          <Link
            href="/teacher/reports"
            className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Xem báo cáo
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Số lớp đang quản lý</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {data?.classesCount ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Tổng số lớp hiện đã liên kết với tài khoản giáo viên.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tổng số học sinh</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {data?.studentsCount ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Dữ liệu được tính từ các lớp đang phụ trách.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Bài đã giao</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {data?.assignmentsCount ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Bao gồm bài luyện tập, quick-test hoặc nhiệm vụ học tập.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tỉ lệ hoàn thành</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {data?.completionRate ?? 0}%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Ước tính dựa trên học sinh đã có dữ liệu tiến độ trong hệ thống.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Lớp học đang quản lý</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            Danh sách lớp trong Firebase
          </h2>

          <div className="mt-6 grid gap-4">
            {(data?.classes || []).length > 0 ? (
              data.classes.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {item.className}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Khối {item.grade} · {item.school}
                      </p>
                    </div>

                    <Link
                      href="/teacher/classes"
                      className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-slate-600">
                  Chưa có lớp nào trong Firebase. Bước tiếp theo là tạo collection
                  <span className="font-semibold text-slate-800"> classes </span>
                  và
                  <span className="font-semibold text-slate-800"> class_students</span>.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-emerald-600">Bài đã giao gần đây</p>
            <h3 className="mt-1 text-xl font-bold text-slate-800">
              Nhiệm vụ học tập hiện có
            </h3>

            <div className="mt-4 grid gap-3">
              {(data?.assignments || []).length > 0 ? (
                data.assignments.map((item: any) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Lesson: {item.lessonId} · Hạn nộp: {item.dueDate}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-4 text-slate-600">
                  Chưa có assignment nào trong hệ thống.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Gợi ý điều hành hôm nay</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Kiểm tra lớp nào chưa có dữ liệu tiến độ để nhắc học sinh làm bài.</li>
              <li>• Giao quick-test cho bài đang yếu ở nhiều học sinh.</li>
              <li>• Rà soát học liệu E-learning trước khi giao nhiệm vụ mới.</li>
              <li>• Theo dõi tỉ lệ hoàn thành để phát hiện lớp cần hỗ trợ thêm.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}