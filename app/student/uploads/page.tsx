"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { uploadFile } from "@/lib/uploadFile";
import { createMaterialRecord } from "@/lib/materials";

export default function StudentUploadsPage() {
  const { profile, loading } = useCurrentUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    if (!profile?.uid || !file || !title.trim()) {
      setStatus("Bu cần em chọn file và nhập tiêu đề trước nhé.");
      return;
    }

    try {
      setStatus("Bu đang tải file lên...");

      const uploaded = await uploadFile(file, `student-materials/${profile.uid}`);

      const materialId = await createMaterialRecord({
        title,
        description,
        lessonId: lessonId || undefined,
        uploadedBy: profile.uid,
        uploaderRole: "student",
        audience: "student",
        downloadURL: uploaded.downloadURL,
        storagePath: uploaded.storagePath,
        fileName: uploaded.fileName,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
        sourceText,
      });

      if (sourceText.trim()) {
        setStatus("Bu đang tạo bộ ôn bài và câu hỏi trắc nghiệm...");

        const response = await fetch("/api/materials/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceMaterialId: materialId,
            lessonId: lessonId || undefined,
            title,
            sourceText,
          }),
        });

        if (!response.ok) {
          throw new Error("Không tạo được nội dung học tập.");
        }
      }

      setStatus("Bu đã tải tài liệu và tạo nội dung học tập thành công.");
      setTitle("");
      setDescription("");
      setLessonId("");
      setSourceText("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus("Tải tài liệu thất bại. Em kiểm tra lại file hoặc nội dung nhé.");
    }
  }

  if (loading) {
    return <div className="rounded-[28px] bg-white p-8 shadow-sm">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="rounded-[28px] bg-white p-8 shadow-sm">Em cần đăng nhập trước.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Tải dữ liệu học tập
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Bu giúp em biến tài liệu thành nội dung học tập
        </h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Em có thể tải tài liệu học lên, thêm phần nội dung trọng tâm, rồi Bu sẽ
          tạo tóm tắt, ghi chú ôn bài và câu hỏi trắc nghiệm để em học dễ hơn.
        </p>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề tài liệu"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            placeholder="Lesson ID (ví dụ: lesson-2)"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn về tài liệu"
            rows={3}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Dán nội dung chính của tài liệu vào đây để Bu tạo câu hỏi trắc nghiệm, ôn bài, flashcard..."
            rows={8}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <button
            onClick={handleUpload}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Tải tài liệu lên
          </button>

          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
        </div>
      </section>
    </div>
  );
}