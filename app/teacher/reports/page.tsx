"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getTeacherDashboardData } from "@/lib/progress-reader";
import { getTeacherStudents } from "@/lib/teacher-reader";
import { getBuLevelMeta } from "@/lib/Bu-level";

export default function TeacherReportsPage() {
  const { profile, loading } = useCurrentUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid || profile.role !== "teacher") {
        setPageLoading(false);
        return;
      }

      try {
        const [dashboard, studentList] = await Promise.all([
          getTeacherDashboardData(profile.uid),
          getTeacherStudents(profile.uid),
        ]);

        setDashboardData(dashboard);
        setStudents(studentList);
      } catch (error) {
        console.error("Lỗi tải reports:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid, profile?.role]);

  if (loading || pageLoading) {
    return <div className="rounded-[28px] bg-white p-8 shadow-sm">Đang tải báo cáo...</div>;
  }

  const levelStats = {
    trungbinh: students.filter((s) => s.currentLevel === "trungbinh").length,
    kha: students.filter((s) => s.currentLevel === "kha").length,
    gioi: students.filter((s) => s.currentLevel === "gioi").length,
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Báo cáo học tập
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Toàn cảnh tiến độ lớp học
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Báo cáo này giúp cô/thầy nhìn nhanh mức độ học tập, tỉ lệ hoàn thành
          và nhóm học sinh đang cần hỗ trợ thêm.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Số lớp</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {dashboardData?.classesCount ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Số học sinh</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {dashboardData?.studentsCount ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Bài đã giao</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {dashboardData?.assignmentsCount ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tỉ lệ hoàn thành</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">
            {dashboardData?.completionRate ?? 0}%
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {(["trungbinh", "kha", "gioi"] as const).map((levelKey) => {
          const meta = getBuLevelMeta(levelKey);
          return (
            <div key={levelKey} className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{meta.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {levelStats[levelKey]}
              </p>
              <p className="mt-2 text-sm text-slate-600">{meta.shortDescription}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Nhóm học sinh cần chú ý</p>
        <div className="mt-4 grid gap-4">
          {students.filter((s) => s.currentLevel === "trungbinh").length > 0 ? (
            students
              .filter((s) => s.currentLevel === "trungbinh")
              .map((student) => (
                <div
                  key={student.uid}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-bold text-slate-800">{student.fullName}</h3>
                  <p className="mt-1 text-sm text-slate-600">Lớp: {student.className}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Tiến độ hiện tại: {student.progressPercent}%
                  </p>
                </div>
              ))
          ) : (
            <div className="rounded-3xl bg-slate-50 p-5 text-slate-600">
              Hiện chưa có nhóm học sinh mức Bu Chăm chỉ nổi bật cần hỗ trợ thêm.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}