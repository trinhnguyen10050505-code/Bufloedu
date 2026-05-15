"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  Eye,
  Search,
  Target,
  UserRound,
} from "lucide-react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import {
  getLevelLabel,
  getLevelTone,
  getProgressByStudent,
  getTeacherStudents,
  TeacherStudent,
  StudentProgressDoc,
} from "@/lib/teacher-analytics";

function TeacherStudentsContent() {
  const { profile, loading } = useCurrentUser();
  const searchParams = useSearchParams();

  const initialClassCode = searchParams.get("classCode") || "all";
  const initialStudentId = searchParams.get("studentId") || "";

  const classCodes = useMemo(() => {
    return profile?.managedClassCodes?.length
      ? profile.managedClassCodes
      : ["8_1", "8_2", "8_3"];
  }, [profile?.managedClassCodes]);

  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [selectedClass, setSelectedClass] = useState(initialClassCode);
  const [keyword, setKeyword] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
  const [studentProgress, setStudentProgress] = useState<StudentProgressDoc[]>(
    []
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        const data = await getTeacherStudents(classCodes);
        setStudents(data);

        if (!selectedStudentId && data[0]?.uid) {
          setSelectedStudentId(data[0].uid);
        }
      } catch (error) {
        console.error("LOAD_TEACHER_STUDENTS_ERROR:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void load();
  }, [profile?.uid, classCodes]);

  useEffect(() => {
    async function loadDetail() {
      if (!selectedStudentId) return;

      try {
        setDetailLoading(true);
        const data = await getProgressByStudent(selectedStudentId);
        setStudentProgress(data);
      } catch (error) {
        console.error("LOAD_STUDENT_DETAIL_ERROR:", error);
      } finally {
        setDetailLoading(false);
      }
    }

    void loadDetail();
  }, [selectedStudentId]);

  const filteredStudents = students.filter((student) => {
    const matchClass =
      selectedClass === "all" || student.classCode === selectedClass;

    const matchKeyword =
      !keyword.trim() ||
      student.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
      student.email?.toLowerCase().includes(keyword.toLowerCase());

    return matchClass && matchKeyword;
  });

  const selectedStudent =
    students.find((student) => student.uid === selectedStudentId) ||
    filteredStudents[0];

  const practiceCount = studentProgress.filter(
    (item) => item.activityType === "practice"
  ).length;

  const quickTestCount = studentProgress.filter(
    (item) => item.activityType === "quick_test"
  ).length;

  const focusMinutes = Math.round(
    studentProgress
      .filter(
        (item) =>
          item.activityType === "focus_room" ||
          item.activityType === "web_active_time"
      )
      .reduce((sum, item) => sum + (item.durationInSeconds || 0), 0) / 60
  );

  const scored = studentProgress.filter(
    (item) => typeof item.accuracy === "number"
  );

  const averageAccuracy =
    scored.length > 0
      ? Math.round(
          scored.reduce((sum, item) => sum + (item.accuracy || 0), 0) /
            scored.length
        )
      : selectedStudent?.lastAccuracy || 0;

  if (loading || pageLoading) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        Đang tải danh sách học sinh...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-caption-pro text-blue-100">Theo dõi từng học sinh</p>

        <h1 className="text-hero-pro mt-4 max-w-5xl text-white">
          Quan sát tiến độ, mức Bu và phần kiến thức cần hỗ trợ của từng em
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-blue-50">
          Giáo viên có thể lọc theo lớp, xem lịch sử practice, quick-test, Focus
          Room và quyết định giao bài phù hợp.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-blue-600">Danh sách</p>
              <h2 className="text-2xl font-black text-slate-900">
                Học sinh của giáo viên
              </h2>
            </div>
            <UserRound className="text-blue-600" />
          </div>

          <div className="mt-5 grid gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="all">Tất cả lớp</option>
              {classCodes.map((code: string) => (
                <option key={code} value={code}>
                  Lớp {code}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-1">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <button
                  key={student.uid}
                  onClick={() => setSelectedStudentId(student.uid)}
                  className={`w-full rounded-[24px] border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                    selectedStudent?.uid === student.uid
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        {student.fullName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {student.email}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getLevelTone(
                        student.currentLevel
                      )}`}
                    >
                      {getLevelLabel(student.currentLevel)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                      Lớp {student.classCode || "Chưa có"}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                      {student.lastAccuracy || 0}% gần nhất
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[24px] bg-slate-50 p-5 text-center text-slate-500">
                Không tìm thấy học sinh phù hợp.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          {selectedStudent ? (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-600">
                    Hồ sơ học tập
                  </p>
                  <h2 className="text-3xl font-black text-slate-900">
                    {selectedStudent.fullName}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedStudent.email} · Lớp {selectedStudent.classCode}
                  </p>
                </div>

                <span
                  className={`rounded-2xl px-4 py-3 text-sm font-black ${getLevelTone(
                    selectedStudent.currentLevel
                  )}`}
                >
                  {getLevelLabel(selectedStudent.currentLevel)}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <Target className="text-blue-600" />
                  <p className="mt-3 text-sm text-slate-500">Độ chính xác TB</p>
                  <p className="text-2xl font-black text-slate-900">
                    {averageAccuracy}%
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <BookOpen className="text-emerald-600" />
                  <p className="mt-3 text-sm text-slate-500">Practice</p>
                  <p className="text-2xl font-black text-slate-900">
                    {practiceCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <Eye className="text-amber-600" />
                  <p className="mt-3 text-sm text-slate-500">Quick-test</p>
                  <p className="text-2xl font-black text-slate-900">
                    {quickTestCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-4">
                  <Clock className="text-cyan-600" />
                  <p className="mt-3 text-sm text-slate-500">Thời gian học</p>
                  <p className="text-2xl font-black text-slate-900">
                    {focusMinutes}p
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[26px] bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 text-amber-500" />
                  <div>
                    <p className="font-black text-slate-900">
                      Phần cần hỗ trợ
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {(selectedStudent.weakLessonIds || []).length > 0
                        ? `Em đang cần ôn: ${selectedStudent.weakLessonIds?.join(
                            ", "
                          )}.`
                        : "Chưa có phần yếu nổi bật. Có thể tiếp tục giao bài luyện theo mức."}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {selectedStudent.nextAction ||
                        "Gợi ý: giao một bộ luyện tập ngắn, sau đó xem kết quả quick-test gần nhất."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/teacher/assignments?studentId=${selectedStudent.uid}`}
                        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        Giao bài phù hợp
                      </Link>

                      <Link
                        href={`/teacher/reports`}
                        className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        Quay lại báo cáo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold text-blue-600">
                  Lịch sử hoạt động gần đây
                </p>

                <div className="mt-4 space-y-3">
                  {detailLoading ? (
                    <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
                      Đang tải lịch sử...
                    </div>
                  ) : studentProgress.length > 0 ? (
                    studentProgress.slice(0, 12).map((item) => (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto]"
                      >
                        <div>
                          <p className="font-black text-slate-800">
                            {item.activityType} · {item.lessonId || "Không gắn bài"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {typeof item.accuracy === "number"
                              ? `Độ chính xác: ${item.accuracy}%`
                              : item.durationInSeconds
                              ? `Thời gian: ${Math.round(
                                  item.durationInSeconds / 60
                                )} phút`
                              : "Hoạt động học tập"}
                          </p>
                        </div>

                        {item.level ? (
                          <span
                            className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${getLevelTone(
                              item.level
                            )}`}
                          >
                            {getLevelLabel(item.level)}
                          </span>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
                      Chưa có hoạt động học tập nào được lưu.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[26px] bg-slate-50 p-8 text-center text-slate-500">
              Chọn một học sinh để xem chi tiết.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function TeacherStudentsPage() {
  return (
    <Suspense fallback={<div className="rounded-[30px] bg-white p-8 shadow-sm">Đang tải trang...</div>}>
      <TeacherStudentsContent />
    </Suspense>
  );
}