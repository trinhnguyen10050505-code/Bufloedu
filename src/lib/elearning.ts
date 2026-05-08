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
  "lesson-6": {
    lessonId: "lesson-6",
    title: "E-learning - Tính chất của oxi và không khí",
    mode: "local_html",
    entry: "/elearning/lesson-6/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-6/",
  },
  "lesson-7": {
    lessonId: "lesson-7",
    title: "E-learning - Tính chất của hiđro và khí cacbonic",
    mode: "local_html",
    entry: "/elearning/lesson-7/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-7/",
  },
  "lesson-8": {
    lessonId: "lesson-8",
    title: "E-learning - Tính chất của lưu huỳnh đioxit và khí amoniac",
    mode: "local_html",
    entry: "/elearning/lesson-8/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-8/",
  },
  "lesson-9": {
    lessonId: "lesson-9",
    title: "E-learning - Tính chất của axit, bazơ và muối",
    mode: "local_html",
    entry: "/elearning/lesson-9/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-9/",
  },
  "lesson-10": {
    lessonId: "lesson-10",
    title: "E-learning - Dung dịch và sự điện li",
    mode: "local_html",
    entry: "/elearning/lesson-10/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-10/",
  },
  "lesson-11": {
    lessonId: "lesson-11",
    title: "E-learning - Phản ứng trao đổi ion trong dung dịch",
    mode: "local_html",
    entry: "/elearning/lesson-11/index.html",
    note: "Đặt nguyên package vào public/elearning/lesson-11/",
  }
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