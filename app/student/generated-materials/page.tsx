"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { getGeneratedMaterialsForUser } from "@/lib/materials";

export default function StudentGeneratedMaterialsPage() {
  const { profile, loading } = useCurrentUser();
  const [items, setItems] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!profile?.uid) {
        setPageLoading(false);
        return;
      }

      try {
        const data = await getGeneratedMaterialsForUser({
          uid: profile.uid,
          role: "student",
        });
        setItems(data);
      } catch (error) {
        console.error("Lỗi tải generated materials cho học sinh:", error);
      } finally {
        setPageLoading(false);
      }
    }

    void run();
  }, [profile?.uid]);

  if (loading || pageLoading) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <p className="text-slate-600">Bu đang tải bộ nội dung học tập cho em...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Chưa đăng nhập</h1>
        <p className="mt-3 text-slate-600">Em cần đăng nhập để xem nội dung học tập được tạo từ tài liệu.</p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Nội dung học tập được tạo từ tài liệu
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu đã biến tài liệu thành nội dung để em ôn bài dễ hơn
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Em có thể xem tóm tắt, ghi chú ôn tập, câu hỏi trắc nghiệm và flashcard
          được sinh ra từ các tài liệu đã tải lên hệ thống.
        </p>
      </section>

      {items.length > 0 ? (
        <div className="grid gap-6">
          {items.map((item) => (
            <section key={item.id} className="rounded-[28px] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Bộ nội dung học tập</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-800">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Nguồn: {item.sourceMaterial?.title || "Tài liệu nguồn"}
                  </p>
                </div>

                {item.sourceMaterial?.downloadURL ? (
                  <a
                    href={item.sourceMaterial.downloadURL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Mở tài liệu gốc
                  </a>
                ) : null}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-800">Tóm tắt ôn bài</p>
                  <p className="mt-3 leading-7 text-slate-600">{item.summary}</p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-800">Ghi chú ôn tập</p>
                  <ul className="mt-3 space-y-2 text-slate-600">
                    {(item.reviewNotes || []).map((note: string) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-lg font-bold text-slate-800">Câu hỏi trắc nghiệm</p>
                <div className="mt-4 grid gap-4">
                  {(item.mcqQuestions || []).map((question: any, index: number) => (
                    <div key={`${item.id}-q-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="font-semibold text-slate-800">
                        Câu {index + 1}. {question.question}
                      </p>
                      <ul className="mt-3 space-y-2 text-slate-600">
                        {(question.options || []).map((option: string) => (
                          <li key={option}>• {option}</li>
                        ))}
                      </ul>
                      <p className="mt-4 text-sm font-semibold text-emerald-700">
                        Đáp án đúng: {question.correctAnswer}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">{question.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-lg font-bold text-slate-800">Flashcards</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(item.flashcards || []).map((card: any, index: number) => (
                    <div key={`${item.id}-f-${index}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-sm font-medium text-blue-600">{card.front}</p>
                      <p className="mt-3 leading-7 text-slate-700">{card.back}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-slate-600">
            Chưa có nội dung học tập nào được tạo từ tài liệu. Em có thể vào khu tải dữ liệu để thử ngay.
          </p>
          <Link
            href="/student/uploads"
            className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Tới trang tải dữ liệu
          </Link>
        </section>
      )}
    </div>
  );
}