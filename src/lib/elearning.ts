export type ElearningSource = {
  lessonId: string;
  title: string;
  mode: "local_html" | "external_url" | "placeholder";
  entry?: string;
  externalUrl?: string;
  note?: string;
};

export const elearningRegistry: Record<string, ElearningSource> = {
  "lesson-2": {
    lessonId: "lesson-2",
    title: "E-learning - Phản ứng hóa học",
    mode: "local_html",
    entry: "/elearning/lesson-2/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-2/",
  },
  "lesson-3": {
    lessonId: "lesson-3",
    title: "E-learning - Mol và tỉ khối chất khí",
    mode: "local_html",
    entry: "/elearning/lesson-3/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-3/",
  },
  "lesson-4": {
    lessonId: "lesson-4",
    title: "E-learning - Nồng độ dung dịch",
    mode: "local_html",
    entry: "/elearning/lesson-4/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-4/",
  },
  "lesson-5": {
    lessonId: "lesson-5",
    title: "E-learning - Định luật bảo toàn khối lượng",
    mode: "local_html",
    entry: "/elearning/lesson-5/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-5/",
  },
};

export function getElearningByLessonId(lessonId: string) {
  return (
    elearningRegistry[lessonId] || {
      lessonId,
      title: "E-learning bài học",
      mode: "placeholder" as const,
      note: "Bài này chưa được gắn package E-learning.",
    }
  );
}