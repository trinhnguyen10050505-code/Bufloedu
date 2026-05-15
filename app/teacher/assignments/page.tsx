"use client";

import { useState } from "react";
import { uploadLearningFile } from "@/lib/upload-service";
import { createAssignment } from "@/lib/assignment-service";
import { useCurrentUser } from "@/hook/useCurrentUser";

export default function TeacherAssignmentPage() {
  const { profile } = useCurrentUser();

  const [classCode, setClassCode] = useState("8_1");
  const [lessonId, setLessonId] = useState("lesson-2");
  const [type, setType] = useState("practice");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!profile?.uid) return;

    try {
      setLoading(true);

      let fileUrl = "";

      if (file) {
        const upload = await uploadLearningFile({
          file,
          ownerId: profile.uid,
          ownerRole: "teacher",
          ownerName: profile.fullName || "",
          classCode,
          lessonId,
          title,
          description,
          uploadType: "assignment_material",
          visibility: "class",
        });
        fileUrl = upload.fileUrl;
      }

      await createAssignment({
        teacherId: profile.uid,
        classId: classCode, // Using classCode as classId as placeholder or convention
        classCode,
        lessonId,
        type: type as any,
        title,
        description,
        fileUrl,
      });

      alert("Đã giao bài thành công!");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi giao bài");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow-sm space-y-4">
      <h1 className="text-2xl font-black">Giao bài nâng cao</h1>

      <select value={classCode} onChange={(e) => setClassCode(e.target.value)} className="input">
        <option value="8_1">Lớp 8_1</option>
        <option value="8_2">Lớp 8_2</option>
        <option value="8_3">Lớp 8_3</option>
      </select>

      <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="input">
        <option value="lesson-1">Bài 1</option>
        <option value="lesson-2">Bài 2</option>
      </select>

      <select value={type} onChange={(e) => setType(e.target.value)} className="input">
        <option value="practice">Luyện tập</option>
        <option value="quick_test">Quick test</option>
        <option value="mindmap">Mindmap</option>
        <option value="document">Tài liệu</option>
      </select>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề"
        className="input"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
        className="input"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-pro bg-blue-600 text-white"
      >
        {loading ? "Đang xử lý..." : "Giao bài"}
      </button>
    </div>
  );
}