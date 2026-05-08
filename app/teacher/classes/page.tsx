"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import {
  ClassDoc,
  createClassForTeacher,
  getTeacherClasses,
} from "@/lib/class-service";

export default function TeacherClassesPage() {
  const { profile } = useCurrentUser();

  const [classes, setClasses] = useState<ClassDoc[]>([]);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [message, setMessage] = useState("");

  async function loadClasses() {
    if (!profile?.uid) return;
    const items = await getTeacherClasses(profile.uid);
    setClasses(items);
  }

  useEffect(() => {
    void loadClasses();
  }, [profile?.uid]);

  async function handleCreateClass() {
    if (!profile?.uid) return;

    try {
      setMessage("");

      await createClassForTeacher({
        className,
        classCode,
        teacherId: profile.uid,
        teacherName: profile.fullName || "Giáo viên",
        school,
        grade,
        subject: profile.subject || "Khoa học tự nhiên",
      });

      setClassName("");
      setClassCode("");
      setGrade("");
      setSchool("");
      setMessage("Đã tạo lớp thành công. Giáo viên có thể gửi mã lớp cho học sinh.");

      await loadClasses();
    } catch (error: any) {
      setMessage(error?.message || "Không tạo được lớp.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Quản lý lớp học
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Tạo lớp, đặt mã lớp và mời học sinh tham gia
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Mỗi lớp có một mã riêng. Học sinh nhập đúng mã lớp khi đăng ký để nhận bài
          giáo viên giao và được theo dõi tiến độ.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Tạo lớp mới</p>

          <div className="mt-5 grid gap-4">
            <input
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="Tên lớp, ví dụ: KHTN 8A1"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={classCode}
              onChange={(event) => setClassCode(event.target.value.toUpperCase())}
              placeholder="Mã lớp, ví dụ: KHTN8A1"
              className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold uppercase outline-none focus:border-blue-500"
            />

            <input
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
              placeholder="Khối"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={school}
              onChange={(event) => setSchool(event.target.value)}
              placeholder="Trường"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            {message ? (
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-slate-700">
                {message}
              </div>
            ) : null}

            <button
              onClick={handleCreateClass}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Tạo lớp
            </button>
          </div>
        </div>

        <div className="rounded-[30px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Danh sách lớp</p>

          <div className="mt-5 grid gap-4">
            {classes.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Giáo viên chưa tạo lớp nào.
              </p>
            ) : (
              classes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h2 className="text-xl font-bold text-slate-800">
                    {item.className}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    Khối {item.grade || "—"} · {item.school || "Chưa nhập trường"}
                  </p>

                  <div className="mt-4 inline-flex rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white">
                    Mã lớp: {item.classCode}
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    Gửi mã này cho học sinh để các em tham gia lớp.
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}