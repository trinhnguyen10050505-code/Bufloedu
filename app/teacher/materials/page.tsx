"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Loader2,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import {
  getTeacherUploads,
  LearningUploadDoc,
  uploadLearningFile,
} from "@/lib/upload-service";

const classes = ["8_1", "8_2", "8_3"];

const lessons = [
  { id: "lesson-1", title: "Bài 1. Ôn tập kiến thức nền lớp 7" },
  { id: "lesson-2", title: "Bài 2. Phản ứng hóa học" },
  { id: "lesson-3", title: "Bài 3. Mol và tỉ khối chất khí" },
  { id: "lesson-4", title: "Bài 4. Nồng độ dung dịch" },
  { id: "lesson-5", title: "Bài 5. Bảo toàn khối lượng" },
  { id: "lesson-6", title: "Bài 6. Tính theo PTHH" },
  { id: "lesson-7", title: "Bài 7. Tốc độ phản ứng" },
  { id: "lesson-8", title: "Bài 8. Acid" },
  { id: "lesson-9", title: "Bài 9. Base - pH" },
  { id: "lesson-10", title: "Bài 10. Oxide" },
  { id: "lesson-11", title: "Bài 11. Muối" },
  { id: "lesson-12", title: "Bài 12. Phân bón" },
];

export default function TeacherMaterialsPage() {
  const { profile } = useCurrentUser();

  const [uploads, setUploads] = useState<LearningUploadDoc[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [classCode, setClassCode] = useState("8_1");
  const [lessonId, setLessonId] = useState("lesson-2");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadType, setUploadType] = useState<
    "lesson_material" | "assignment_material" | "practice_source" | "mindmap_source"
  >("lesson_material");
  const [visibility, setVisibility] = useState<"class" | "teacher">("class");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadUploads() {
    if (!profile?.uid) return;
    const data = await getTeacherUploads(profile.uid);
    setUploads(data);
  }

  useEffect(() => {
    void loadUploads();
  }, [profile?.uid]);

  async function handleUpload() {
    if (!profile?.uid || !file || !title.trim()) {
      alert("Vui lòng chọn file và nhập tiêu đề.");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      await uploadLearningFile({
        file,
        ownerId: profile.uid,
        ownerRole: "teacher",
        ownerName: profile.fullName,
        classCode,
        lessonId,
        title,
        description,
        uploadType,
        visibility,
        onProgress: setProgress,
      });

      setFile(null);
      setTitle("");
      setDescription("");
      setProgress(0);

      await loadUploads();

      alert("Đã tải học liệu lên thành công.");
    } catch (error) {
      console.error(error);
      alert("Tải file thất bại. Kiểm tra Firebase Storage và quyền ghi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <p className="text-caption-pro text-blue-100">Học liệu giáo viên</p>

        <h1 className="text-hero-pro mt-4 max-w-5xl text-white">
          Tải tài liệu, gắn theo lớp, theo bài và dùng làm nguồn học tập
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-blue-50">
          Giáo viên có thể tải PDF, DOCX, ảnh mindmap hoặc tài liệu luyện tập.
          Hệ thống sẽ lưu vào Firebase Storage và Firestore để học sinh đúng lớp
          truy cập.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <UploadCloud />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-600">Upload học liệu</p>
              <h2 className="text-2xl font-black text-slate-900">
                Thêm tài liệu mới
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="rounded-[28px] border-2 border-dashed border-blue-200 bg-blue-50 p-6 text-center transition hover:bg-blue-100">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />

              <UploadCloud className="mx-auto text-blue-600" size={38} />
              <p className="mt-3 font-black text-slate-800">
                {file ? file.name : "Bấm để chọn tài liệu"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Hỗ trợ PDF, Word, PowerPoint, hình ảnh mindmap.
              </p>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">Lớp</p>
                <select
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  {classes.map((item) => (
                    <option key={item} value={item}>
                      Lớp {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">Bài học</p>
                <select
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">
                  Loại tài liệu
                </p>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="lesson_material">Lý thuyết / bài học</option>
                  <option value="assignment_material">Tài liệu bài giao</option>
                  <option value="practice_source">Nguồn tạo bài tập</option>
                  <option value="mindmap_source">Ảnh mindmap</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">
                  Hiển thị
                </p>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="class">Cho lớp đã chọn</option>
                  <option value="teacher">Chỉ giáo viên</option>
                </select>
              </div>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề tài liệu"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn cho học sinh"
              className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            {loading ? (
              <div className="rounded-2xl bg-slate-100 p-3">
                <div className="h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  Đang tải lên {progress}%
                </p>
              </div>
            ) : null}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-pro bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={19} />
                  Đang tải...
                </>
              ) : (
                <>
                  <UploadCloud size={19} />
                  Tải học liệu lên
                </>
              )}
            </button>
          </div>
        </div>

        <div className="rounded-[34px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">Kho học liệu</p>
              <h2 className="text-2xl font-black text-slate-900">
                Tài liệu đã tải lên
              </h2>
            </div>

            <WandSparkles className="text-blue-600" />
          </div>

          <div className="mt-6 space-y-3">
            {uploads.length > 0 ? (
              uploads.map((item) => (
                <a
                  key={item.id}
                  href={item.fileUrl}
                  target="_blank"
                  className="block rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <FileText />
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-slate-900">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                        {item.description || item.fileName}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                          {item.classCode || "Không gắn lớp"}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                          {item.lessonId || "Không gắn bài"}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="rounded-[26px] bg-slate-50 p-6 text-center text-slate-500">
                Chưa có tài liệu nào.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}