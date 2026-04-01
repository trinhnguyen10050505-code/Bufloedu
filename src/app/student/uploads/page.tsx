"use client";

import { useState } from "react";
import { uploadFile } from "../../../lib/uploadFile";

export default function UploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Bạn chưa chọn file");
      return;
    }

    try {
      const url = await uploadFile(file, "student-uploads");
      setMessage(`Tải thành công: ${url}`);
    } catch (error: any) {
      setMessage(error.message || "Upload thất bại");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tải dữ liệu học tập</h1>

      <div className="border rounded-2xl p-6 max-w-xl">
        <p className="mb-4">
          Tải lên file Word, PDF hoặc video để chuyển thành nội dung học tập.
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
          Tải lên
        </button>

        {message && <p className="mt-4 break-all">{message}</p>}
      </div>
    </div>
  );
}