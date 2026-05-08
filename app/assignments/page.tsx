"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import {
  AssignmentDoc,
  getAssignmentHref,
  getAssignmentsForClass,
} from "@/lib/assignment-service";

function getTypeLabel(type: string) {
  if (type === "practice") return "Luyện tập";
  if (type === "quick_test") return "Quick-test";
  if (type === "mindmap") return "Mindmap";
  return "Bài học";
}

export default function StudentAssignmentsPage() {
  const { profile, loading } = useCurrentUser();
  const [assignments, setAssignments] = useState<AssignmentDoc[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile?.classCode) {
        setPageLoading(false);
        return;
      }

      const items = await getAssignmentsForClass(profile.classCode);
      setAssignments(items);
      setPageLoading(false);
    }

    void load();
  }, [profile?.classCode]);

  if (loading || pageLoading) {
    return (
      <div className="rounded-[30px] bg-white p-8 shadow-sm">
        Bu đang tải bài giáo viên giao...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
          Bài giáo viên giao
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Nhiệm vụ học tập của lớp em
        </h1>

        <p className="mt-4 max-w-3xl text-blue-50">
          Bu chỉ hiển thị bài giao từ giáo viên của đúng lớp em đang tham gia.
        </p>

        <div className="mt-6 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold">
          Mã lớp: {profile?.classCode || "Chưa có mã lớp"}
        </div>
      </section>

      {!profile?.classCode ? (
        <section className="rounded-[30px] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">
            Em chưa tham gia lớp nào
          </h2>
          <p className="mt-3 text-slate-600">
            Hãy liên hệ giáo viên để lấy mã lớp, sau đó cập nhật vào hồ sơ.
          </p>
        </section>
      ) : assignments.length === 0 ? (
        <section className="rounded-[30px] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">
            Chưa có bài được giao
          </h2>
          <p className="mt-3 text-slate-600">
            Khi giáo viên giao bài cho lớp, Bu sẽ hiển thị ở đây.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <article
              key={assignment.id}
              className="rounded-[30px] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {getTypeLabel(assignment.type)}
                </span>

                {assignment.dueDate ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Hạn: {assignment.dueDate}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-800">
                {assignment.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {assignment.description}
              </p>

              <Link
                href={getAssignmentHref(assignment)}
                className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Bắt đầu làm
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}