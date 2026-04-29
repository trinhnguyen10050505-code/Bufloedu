"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getTeacherStudents } from "@/lib/teacher-reader";
import { getBuLevelMeta } from "@/lib/Bu-level";
import { lessonsContent } from "@/data/lessons-content";

export default function TeacherStudentsPage() {
  const { profile, loading } = useCurrentUser();
  const [students, setStudents] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid || profile.role !== "teacher") {
        setPageLoading(false);
        return;
      }

      try {
        const data = await getTeacherStudents(profile.uid);
        setStudents(data);
      } catch (error) {
        console.error("Lỗi tải danh sách học sinh:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid, profile?.role]);

  const mappedStudents = useMemo(() => {
    return students.map((student) => ({
      ...student,
      weakTitles: (student.weakLessonIds || [])
        .map((lessonId: string) => lessonsContent[lessonId as keyof typeof lessonsContent]?.title)
        .filter(Boolean),
    }));
  }, [students]);

  if (loading || pageLoading) {
    return <div className="p-10">Đang tải dữ liệu học sinh...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Theo dõi học sinh
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Tiến độ từng học sinh</h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Xem mức Bu hiện tại, số bài đã hoàn thành, phần còn yếu và mức độ tiến bộ
          của từng học sinh trong các lớp đang phụ trách.
        </p>
      </section>

      {mappedStudents.length > 0 ? (
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            {mappedStudents.map((student) => {
              const buMeta = getBuLevelMeta(student.currentLevel);

              return (
                <div
                  key={student.uid}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{student.fullName}</h2>
                      <p className="mt-1 text-sm text-slate-600">Lớp: {student.className}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {buMeta.label}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        Tiến độ: {student.progressPercent}%
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                        Hoàn thành: {student.completedLessonsCount} bài
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                    Nội dung cần chú ý:{" "}
                    <span className="font-semibold text-slate-800">
                      {student.weakTitles.length > 0
                        ? student.weakTitles.join(", ")
                        : "Chưa có phần yếu nổi bật"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">
            Chưa có học sinh nào liên kết với các lớp của giáo viên trong Firebase.
          </p>
        </div>
      )}
    </div>
  );
}