"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Clock,
  FileText,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import {
  buildTeacherReportSummary,
  getLevelLabel,
  getLevelTone,
  getTeacherProgress,
  getTeacherStudents,
  TeacherReportSummary,
  TeacherStudent,
  StudentProgressDoc,
} from "@/lib/teacher-analytics";

function StatCard({
  icon,
  title,
  value,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{desc}</p>
    </div>
  );
}

function LevelBar({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: string;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-bold text-slate-500">
          {value} em · {percent}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function TeacherReportsPage() {
  const { profile, loading } = useCurrentUser();

  const classCodes = useMemo(() => {
    return profile?.managedClassCodes?.length
      ? profile.managedClassCodes
      : ["8_1", "8_2", "8_3"];
  }, [profile?.managedClassCodes]);

  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [progress, setProgress] = useState<StudentProgressDoc[]>([]);
  const [summary, setSummary] = useState<TeacherReportSummary | null>(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);

        const [studentData, progressData] = await Promise.all([
          getTeacherStudents(classCodes),
          getTeacherProgress(classCodes),
        ]);

        setStudents(studentData);
        setProgress(progressData);

        setSummary(
          buildTeacherReportSummary({
            students: studentData,
            progress: progressData,
            classCodes,
          })
        );
      } catch (error) {
        console.error("LOAD_TEACHER_REPORT_ERROR:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void load();
  }, [profile?.uid, classCodes]);

  const visibleClassSummaries =
    selectedClass === "all"
      ? summary?.classSummaries || []
      : (summary?.classSummaries || []).filter(
          (item) => item.classCode === selectedClass
        );

  if (loading || pageLoading) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        Bu đang tải báo cáo lớp học...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        Chưa có dữ liệu báo cáo.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-caption-pro text-blue-100">Báo cáo tiến độ</p>

        <h1 className="text-hero-pro mt-4 max-w-5xl text-white">
          Tổng quan năng lực, tiến độ và cảnh báo học tập theo từng lớp
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-blue-50">
          Giáo viên có thể xem nhanh mức Bu của học sinh, độ chính xác, thời gian
          học, lượt luyện tập và nhóm cần hỗ trợ sớm.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users />}
          title="Tổng học sinh"
          value={String(summary.totalStudents)}
          desc={`${summary.totalClasses} lớp đang được quản lý.`}
        />
        <StatCard
          icon={<Target />}
          title="Độ chính xác TB"
          value={`${summary.averageAccuracy}%`}
          desc="Tính từ diagnostic, practice và quick-test."
        />
        <StatCard
          icon={<BookOpen />}
          title="Lượt luyện tập"
          value={String(summary.totalPracticeTimes)}
          desc="Tổng số lượt practice của các lớp."
        />
        <StatCard
          icon={<Clock />}
          title="Thời gian học"
          value={`${summary.totalFocusMinutes}p`}
          desc="Bao gồm Focus Room và thời gian học trên web."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">Phân bố mức Bu</p>
              <h2 className="text-2xl font-black text-slate-900">
                Toàn bộ học sinh
              </h2>
            </div>
            <BarChart3 className="text-blue-600" />
          </div>

          <div className="mt-6 space-y-5">
            <LevelBar
              label="Bu Chăm chỉ"
              value={summary.levelStats.trungbinh}
              total={summary.totalStudents}
              tone="bg-amber-400"
            />
            <LevelBar
              label="Bu Vững vàng"
              value={summary.levelStats.kha}
              total={summary.totalStudents}
              tone="bg-blue-500"
            />
            <LevelBar
              label="Bu Thông thái"
              value={summary.levelStats.gioi}
              total={summary.totalStudents}
              tone="bg-emerald-500"
            />
          </div>

          <div className="mt-6 rounded-[24px] bg-blue-50 p-5">
            <p className="font-bold text-blue-700">Gợi ý vận hành</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ưu tiên nhóm Bu Chăm chỉ trước, sau đó giao bài theo phần yếu
              thay vì giao đồng loạt cho cả lớp.
            </p>
          </div>
        </div>

        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">Theo từng lớp</p>
              <h2 className="text-2xl font-black text-slate-900">
                Hiệu quả học tập từng lớp
              </h2>
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
            >
              <option value="all">Tất cả lớp</option>
              {classCodes.map((code: string) => (
                <option key={code} value={code}>
                  Lớp {code}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 grid gap-4">
            {visibleClassSummaries.map((item) => (
              <div
                key={item.classCode}
                className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xl font-black text-slate-900">
                      Lớp {item.classCode}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.totalStudents} học sinh · {item.averageAccuracy}% độ
                      chính xác TB
                    </p>
                  </div>

                  <Link
                    href={`/teacher/students?classCode=${item.classCode}`}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Xem học sinh
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-sm text-slate-500">Practice</p>
                    <p className="text-2xl font-black text-slate-900">
                      {item.totalPracticeTimes}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-sm text-slate-500">Quick-test</p>
                    <p className="text-2xl font-black text-slate-900">
                      {item.totalQuickTests}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-sm text-slate-500">Focus</p>
                    <p className="text-2xl font-black text-slate-900">
                      {item.totalFocusMinutes}p
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-sm text-slate-500">Cần ôn</p>
                    <p className="text-sm font-bold text-slate-800">
                      {item.weakLessons.length
                        ? item.weakLessons.join(", ")
                        : "Chưa rõ"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[34px] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <AlertTriangle />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-600">Cảnh báo sớm</p>
            <h2 className="text-2xl font-black text-slate-900">
              Học sinh cần hỗ trợ
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {summary.alertStudents.length > 0 ? (
            summary.alertStudents.map((student) => (
              <Link
                key={student.studentId}
                href={`/teacher/students?studentId=${student.studentId}`}
                className="grid gap-3 rounded-[24px] border border-amber-100 bg-amber-50 p-4 transition hover:-translate-y-1 hover:shadow-md md:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {student.studentName} · Lớp {student.classCode}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{student.reason}</p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-amber-700">
                  {student.accuracy || 0}% gần nhất
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[24px] bg-slate-50 p-5 text-slate-500">
              Chưa có cảnh báo nổi bật. Các lớp đang học ổn định.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}