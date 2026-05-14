"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";0
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Layers,
  LineChart,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import {
  getTeacherDashboardData,
  getTeacherLevelLabel,
  TeacherDashboardData,
  TeacherStudentRow,
} from "@/lib/teacher-dashboard-reader";

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function levelCardClass(level: string) {
  if (level === "gioi") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (level === "kha") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function levelDotClass(level: string) {
  if (level === "gioi") return "bg-emerald-500";
  if (level === "kha") return "bg-blue-500";
  return "bg-amber-500";
}

function levelNumber(level: string) {
  if (level === "gioi") return 3;
  if (level === "kha") return 2;
  return 1;
}

function sortStudentsNeedingSupport(students: TeacherStudentRow[]) {
  return [...students]
    .sort((a, b) => {
      const levelDiff = levelNumber(a.currentLevel) - levelNumber(b.currentLevel);
      if (levelDiff !== 0) return levelDiff;

      return Number(a.lastAccuracy || 0) - Number(b.lastAccuracy || 0);
    })
    .slice(0, 8);
}

export default function TeacherDashboardPage() {
  const { profile, loading } = useCurrentUser();

  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedClassCode, setSelectedClassCode] = useState("all");

  useEffect(() => {
    async function load() {
      if (!profile?.uid) {
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

    void load();
  }, [profile?.uid]);

  const selectedClass =
    selectedClassCode === "all"
      ? null
      : data?.classes.find((item) => item.classCode === selectedClassCode);

  const visibleStudents = useMemo(() => {
    if (!data) return [];

    if (selectedClassCode === "all") return data.students;

    return data.students.filter(
      (student) => student.classCode === selectedClassCode
    );
  }, [data, selectedClassCode]);

  const visibleLevelDistribution = useMemo(() => {
    return {
      trungbinh: visibleStudents.filter(
        (student) => student.currentLevel === "trungbinh"
      ).length,
      kha: visibleStudents.filter((student) => student.currentLevel === "kha")
        .length,
      gioi: visibleStudents.filter((student) => student.currentLevel === "gioi")
        .length,
    };
  }, [visibleStudents]);

  const supportStudents = useMemo(() => {
    return sortStudentsNeedingSupport(visibleStudents);
  }, [visibleStudents]);

  const classChartData = useMemo(() => {
    if (!data) return [];

    return data.classes.map((item) => ({
      name: item.classCode,
      "Bu Chăm chỉ": item.levelDistribution.trungbinh,
      "Bu Vững vàng": item.levelDistribution.kha,
      "Bu Thông thái": item.levelDistribution.gioi,
      "Độ chính xác": item.averageAccuracy,
    }));
  }, [data]);

  const pieData = [
    {
      name: "Bu Chăm chỉ",
      value: visibleLevelDistribution.trungbinh,
      color: "#f59e0b",
    },
    {
      name: "Bu Vững vàng",
      value: visibleLevelDistribution.kha,
      color: "#2563eb",
    },
    {
      name: "Bu Thông thái",
      value: visibleLevelDistribution.gioi,
      color: "#10b981",
    },
  ];

  const activityData = useMemo(() => {
    if (!data) return [];

    const base = data.classes.map((classItem) => ({
      name: classItem.classCode,
      "Luyện tập": classItem.totalPracticeTimes,
      "Quick-test": classItem.totalQuickTests,
      "Phút học": classItem.totalStudyMinutes,
    }));

    return selectedClassCode === "all"
      ? base
      : base.filter((item) => item.name === selectedClassCode);
  }, [data, selectedClassCode]);

  if (loading || pageLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-[30px] bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={34} />
          <p className="mt-4 font-semibold text-slate-600">
            Đang tải dashboard giáo viên...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">
          Cần đăng nhập giáo viên
        </h1>
        <p className="mt-3 text-slate-600">
          Vui lòng đăng nhập để xem dữ liệu lớp học.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">
          Chưa có dữ liệu
        </h1>
        <p className="mt-3 text-slate-600">
          Hãy tạo lớp học và thêm học sinh để bắt đầu theo dõi.
        </p>
      </div>
    );
  }

  const totalVisibleStudents = visibleStudents.length;
  const averageVisibleAccuracy =
    totalVisibleStudents > 0
      ? Math.round(
          visibleStudents.reduce(
            (sum, student) => sum + Number(student.lastAccuracy || 0),
            0
          ) / totalVisibleStudents
        )
      : 0;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-[0_20px_60px_rgba(37,99,235,0.28)]">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-100">
              Dashboard giáo viên
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight xl:text-5xl">
              Chào {profile.fullName || "thầy/cô"}, hôm nay lớp học đang tiến bộ thế nào?
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-blue-50">
              Buflo AI tổng hợp mức Bu, thời gian học, lượt luyện tập và quick-test
              để thầy/cô nhìn nhanh tình hình từng lớp, từng nhóm học sinh.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/teacher/assignments"
                className="rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 hover:bg-blue-50"
              >
                Giao bài mới
              </Link>

              <Link
                href="/teacher/classes"
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/20"
              >
                Quản lý lớp
              </Link>

              <Link
                href="/teacher/reports"
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/20"
              >
                Xem báo cáo
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold text-blue-100">
              Bộ lọc lớp học
            </p>

            <select
              value={selectedClassCode}
              onChange={(event) => setSelectedClassCode(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/20 bg-white px-4 py-3 font-bold text-slate-800 outline-none"
            >
              <option value="all">Tất cả lớp</option>
              {data.classes.map((classItem) => (
                <option key={classItem.classCode} value={classItem.classCode}>
                  {classItem.className} · {classItem.classCode}
                </option>
              ))}
            </select>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-blue-100">Số lớp</p>
                <p className="mt-1 text-3xl font-black">{data.totalClasses}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-blue-100">Học sinh</p>
                <p className="mt-1 text-3xl font-black">
                  {totalVisibleStudents}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-blue-100">Độ chính xác</p>
                <p className="mt-1 text-3xl font-black">
                  {averageVisibleAccuracy}%
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-blue-100">Quick-test</p>
                <p className="mt-1 text-3xl font-black">
                  {selectedClass?.totalQuickTests ?? data.totalQuickTests}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <Users className="text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Tổng học sinh</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {totalVisibleStudents}
          </h2>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <Target className="text-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">Độ chính xác TB</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {averageVisibleAccuracy}%
          </h2>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <BookOpen className="text-amber-500" />
          <p className="mt-4 text-sm text-slate-500">Lượt luyện tập</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {visibleStudents.reduce(
              (sum, student) => sum + student.totalPracticeTimes,
              0
            )}
          </h2>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <ClipboardList className="text-red-500" />
          <p className="mt-4 text-sm text-slate-500">Quick-test</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {visibleStudents.reduce(
              (sum, student) => sum + student.totalQuickTests,
              0
            )}
          </h2>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-blue-600">
                Phân bố mức Bu
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Tỉ lệ năng lực học sinh
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Theo nhóm Bu Chăm chỉ, Bu Vững vàng và Bu Thông thái.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">
                      {item.name}
                    </p>
                    <p className="font-black text-slate-900">
                      {percent(item.value, totalVisibleStudents)}%
                    </p>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent(item.value, totalVisibleStudents)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {item.value} học sinh
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-blue-600">
            So sánh theo lớp
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Mức Bu của từng lớp
          </h2>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Bu Chăm chỉ" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Bu Vững vàng" stackId="a" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Bu Thông thái" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-blue-600">
            Hoạt động học tập
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Luyện tập, quick-test và thời gian học
          </h2>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="practice" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="quick" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Luyện tập"
                  stroke="#2563eb"
                  fill="url(#practice)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="Quick-test"
                  stroke="#10b981"
                  fill="url(#quick)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-amber-600">
            Cần quan tâm
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Học sinh cần hỗ trợ sớm
          </h2>

          <div className="mt-6 space-y-3">
            {supportStudents.length > 0 ? (
              supportStudents.map((student) => (
                <div
                  key={student.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        {student.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Lớp {student.classCode || "chưa có"} · Chính xác{" "}
                        {student.lastAccuracy || 0}%
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${levelCardClass(
                        student.currentLevel
                      )}`}
                    >
                      {getTeacherLevelLabel(student.currentLevel)}
                    </span>
                  </div>

                  {student.weakLessonIds.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {student.weakLessonIds.slice(0, 3).map((lessonId) => (
                        <span
                          key={lessonId}
                          className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600"
                        >
                          {lessonId}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {student.nextAction ||
                      "Nên giao bài luyện tập ngắn để kiểm tra lại mức độ hiện tại."}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                Chưa có học sinh nào cần cảnh báo rõ ràng.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600">
              Danh sách học sinh
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Theo dõi nhanh từng em
            </h2>
          </div>

          <Link
            href="/teacher/students"
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Xem đầy đủ
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <table className="w-full min-w-[900px] border-collapse bg-white text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Học sinh
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Lớp
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Mức Bu
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Chính xác
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Luyện tập
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Quick-test
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Phút học
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleStudents.slice(0, 12).map((student) => (
                <tr key={student.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">
                      {student.fullName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {student.email || "Chưa có email"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {student.classCode || "Tự do"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${levelCardClass(
                        student.currentLevel
                      )}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${levelDotClass(
                          student.currentLevel
                        )}`}
                      />
                      {getTeacherLevelLabel(student.currentLevel)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-black text-slate-900">
                    {student.lastAccuracy || 0}%
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {student.totalPracticeTimes}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {student.totalQuickTests}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {student.totalStudyMinutes}p
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}