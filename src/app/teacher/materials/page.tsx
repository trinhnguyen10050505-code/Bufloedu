"use client";

import { useState } from "react";

export default function TeacherMaterialsPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!file) {
      alert("Bạn chưa chọn file");
      return;
    }

    alert(`Giáo viên đã chọn file: ${file.name}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tải học liệu</h1>

      <div className="border rounded-2xl p-6 max-w-xl">
        <p className="mb-4">
          Tải video, Word, PDF hoặc bộ bài tập lên cho học sinh.
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="px-5 py-3 bg-black text-white rounded-xl"
        >
          Tải học liệu
        </button>
      </div>
    </div>
  );
}