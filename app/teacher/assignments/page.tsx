"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getTeacherAssignments } from "@/lib/teacher-reader";
import { lessonsContent } from "@/data/lessons-content";

export default function TeacherAssignmentsPage() {
  const { profile, loading } = useCurrentUser();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid || profile.role !== "teacher") {
        setPageLoading(false);
        return;
      }

      try {
        const data = await getTeacherAssignments(profile.uid);
        setAssignments(data);
      } catch (error) {
        console.error("Lỗi tải assignment:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid, profile?.role]);

  if (loading || pageLoading) {
    return <div className="p-10">Đang tải nhiệm vụ học tập...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Giao bài
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Nhiệm vụ học tập cho học sinh</h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Quản lý các bài luyện tập, kiểm tra nhanh và nhiệm vụ học tập đã giao
          cho từng lớp trong hệ thống.
        </p>
      </section>

      {assignments.length > 0 ? (
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {lessonsContent[item.lessonId as keyof typeof lessonsContent]?.title ||
                        item.lessonId}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      Class ID: {item.classId}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      Hạn nộp: {item.dueDate}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">
            Chưa có assignment nào trong Firebase. Hãy thêm dữ liệu vào collection
            <span className="font-semibold text-slate-800"> assignments </span>
            để hiển thị tại đây.
          </p>
        </div>
      )}
    </div>
  );
}