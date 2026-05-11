export type LessonId =
  | "lesson-2"
  | "lesson-3"
  | "lesson-4"
  | "lesson-5"
  | "lesson-6"
  | "lesson-7"
  | "lesson-8"
  | "lesson-9"
  | "lesson-10"
  | "lesson-11"
  | "lesson-12";

export type LessonCatalogItem = {
  id: LessonId;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  chapter: string;
  tags: string[];
  elearningUrl: string;
  localEntry?: string;
};

export const lessonCatalog: LessonCatalogItem[] = [
  {
    id: "lesson-2",
    order: 2,
    title: "Phản ứng hóa học",
    shortTitle: "Phản ứng hóa học",
    description:
      "Biến đổi vật lí, biến đổi hóa học, dấu hiệu phản ứng, phản ứng tỏa nhiệt và thu nhiệt.",
    chapter: "Chủ đề Hóa học",
    tags: ["biến đổi", "phản ứng", "năng lượng"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-2-Phan-ung-Hoa-Hoc/index.html",
    localEntry: "/elearning/lesson-2/index.html",
  },
  {
    id: "lesson-3",
    order: 3,
    title: "Mol và tỉ khối của chất khí",
    shortTitle: "Mol và tỉ khối",
    description:
      "Mol, số Avogadro, khối lượng mol, thể tích mol chất khí và tỉ khối khí.",
    chapter: "Chủ đề Hóa học",
    tags: ["mol", "Avogadro", "tỉ khối"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-3-Mol-va-Ti-Khoi-cua-chat-khi/index.html",
    localEntry: "/elearning/lesson-3/index.html",
  },
  {
    id: "lesson-4",
    order: 4,
    title: "Nồng độ dung dịch",
    shortTitle: "Nồng độ dung dịch",
    description:
      "Dung dịch, chất tan, dung môi, độ tan, nồng độ phần trăm và nồng độ mol.",
    chapter: "Chủ đề Hóa học",
    tags: ["dung dịch", "độ tan", "nồng độ"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-4-Nong-do-Dung-Dich/index.html",
    localEntry: "/elearning/lesson-4/index.html",
  },
  {
    id: "lesson-5",
    order: 5,
    title: "Định luật bảo toàn khối lượng và phương trình hóa học",
    shortTitle: "Bảo toàn khối lượng",
    description:
      "Định luật bảo toàn khối lượng, lập phương trình hóa học và ý nghĩa phương trình.",
    chapter: "Chủ đề Hóa học",
    tags: ["bảo toàn", "phương trình", "cân bằng"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-5-Dinh-Luat-Bao-Toan-Khoi-Luong-va-Phuong-Trinh-Hoa-Hoc/index.html",
    localEntry: "/elearning/lesson-5/index.html",
  },
  {
    id: "lesson-6",
    order: 6,
    title: "Tính theo phương trình hóa học",
    shortTitle: "Tính theo PTHH",
    description:
      "Tính số mol, khối lượng, thể tích theo phương trình hóa học và hiệu suất phản ứng.",
    chapter: "Chủ đề Hóa học",
    tags: ["số mol", "hiệu suất", "tính toán"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-6-Tinh-theo-Phuong-Trinh-Hoa-Hoc/index.html",
    localEntry: "/elearning/lesson-6/index.html",
  },
  {
    id: "lesson-7",
    order: 7,
    title: "Tốc độ phản ứng và chất xúc tác",
    shortTitle: "Tốc độ phản ứng",
    description:
      "Tốc độ phản ứng, diện tích tiếp xúc, nhiệt độ, nồng độ, chất xúc tác và chất ức chế.",
    chapter: "Chủ đề Hóa học",
    tags: ["tốc độ", "xúc tác", "nồng độ"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-7-Toc-Do-Phan-UNG-va-Chất-Xúc-Tác/index.html",
    localEntry: "/elearning/lesson-7/index.html",
  },
  {
    id: "lesson-8",
    order: 8,
    title: "Acid",
    shortTitle: "Acid",
    description:
      "Khái niệm acid, tên gọi acid, gốc acid và tính chất hóa học cơ bản.",
    chapter: "Chủ đề Hóa học",
    tags: ["acid", "H+", "gốc acid"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-8-Acid/index.html",
    localEntry: "/elearning/lesson-8/index.html",
  },
  {
    id: "lesson-9",
    order: 9,
    title: "Base – thang đo pH",
    shortTitle: "Base và pH",
    description:
      "Khái niệm base, phân loại base, tính chất hóa học và thang đo pH.",
    chapter: "Chủ đề Hóa học",
    tags: ["base", "pH", "OH-"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-9-Base-Thang-Do-pH/index.html",
    localEntry: "/elearning/lesson-9/index.html",
  },
  {
    id: "lesson-10",
    order: 10,
    title: "Oxide",
    shortTitle: "Oxide",
    description:
      "Khái niệm oxide, phân loại oxide và tính chất hóa học của oxide.",
    chapter: "Chủ đề Hóa học",
    tags: ["oxide", "oxide acid", "oxide base"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-10-Oxide-Tiet2/index.html",
    localEntry: "/elearning/lesson-10/index.html",
  },
  {
    id: "lesson-11",
    order: 11,
    title: "Muối",
    shortTitle: "Muối",
    description:
      "Khái niệm muối, tên gọi, tính tan của muối và phản ứng trao đổi.",
    chapter: "Chủ đề Hóa học",
    tags: ["muối", "tính tan", "trao đổi"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-11-Muoi/index.html",
    localEntry: "/elearning/lesson-11/index.html",
  },
  {
    id: "lesson-12",
    order: 12,
    title: "Phân bón hóa học",
    shortTitle: "Phân bón hóa học",
    description:
      "Vai trò, phân loại và sử dụng phân bón hóa học trong đời sống.",
    chapter: "Chủ đề Hóa học",
    tags: ["phân bón", "nông nghiệp", "hóa học"],
    elearningUrl: "https://phuocnguyenbpbt-svg.github.io/Bai-12-Phan-Bon-Hoa-Hoc/index.html",
    localEntry: "/elearning/lesson-12/index.html",
  },
];

export function getLessonCatalogItem(lessonId: string) {
  return lessonCatalog.find((lesson) => lesson.id === lessonId) || null;
}