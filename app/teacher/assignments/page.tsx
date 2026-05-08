"use client";

import { useEffect, useState } from "react";
import { getPracticeLessons } from "@/data/practice-bank.generated";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { ClassDoc, getTeacherClasses } from "@/lib/class-service";
import { AssignmentType, createAssignment } from "@/lib/assignment-service";

export default function TeacherAssignmentsPage() {
  const { profile } = useCurrentUser();

  const lessons = getPracticeLessons();

  const [classes, setClasses] = useState<ClassDoc[]>([]);
  const [classId, setClassId] = useState("");
  const [lessonId, setLessonId] = useState(lessons[0]?.lessonId || "lesson-2");
  const [type, setType] = useState<AssignmentType>("practice");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!profile?.uid) return;
      const items = await getTeacherClasses(profile.uid);
      setClasses(items);

      if (items[0]) {
        setClassId(items[0].id);
      }
    }

    void load();
  }, [profile?.uid]);

  async function handleCreateAssignment() {
    if (!profile?.uid) return;

    const selectedClass = classes.find((item) => item.id === classId);

    if (!selectedClass) {
      setMessage("Vui lòng chọn lớp.");
      return;
    }

    const selectedLesson = lessons.find((item) => item.lessonId === lessonId);

    try {
      await createAssignment({
        teacherId: profile.uid,
        classId: selectedClass.id,
        classCode: selectedClass.classCode,
        title:
          title ||
          `${type === "practice" ? "Luyện tập" : type === "quick_test" ? "Quick-test" : "Bài học"} - ${selectedLesson?.lessonTitle || lessonId}`,
        description:
          description ||
          "Giáo viên giao bài qua hệ thống Bu. Học sinh hoàn thành và hệ thống sẽ lưu tiến độ.",
        lessonId,
        type,
        dueDate,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setMessage("Đã giao bài thành công cho lớp.");
    } catch (error: any) {
      setMessage(error?.message || "Không giao được bài.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Giao bài
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Giao bài học, luyện tập, quick-test hoặc mindmap cho lớp
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Học sinh thuộc đúng mã lớp sẽ nhìn thấy bài được giao trong khu học sinh.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">Chọn lớp</label>
            <select
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.className} · {item.classCode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Chọn bài</label>
            <select
              value={lessonId}
              onChange={(event) => setLessonId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              {lessons.map((lesson) => (
                <option key={lesson.lessonId} value={lesson.lessonId}>
                  Bài {lesson.lessonOrder}. {lesson.lessonTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Loại bài</label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as AssignmentType)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="lesson">Học bài</option>
              <option value="practice">Luyện tập</option>
              <option value="quick_test">Quick-test</option>
              <option value="mindmap">Mindmap</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Hạn nộp</label>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Tiêu đề bài giao"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Mô tả hoặc lời nhắn cho học sinh"
            rows={4}
            className="resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          {message ? (
            <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <button
            onClick={handleCreateAssignment}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Giao bài cho lớp
          </button>
        </div>
      </section>
    </div>
  );
}