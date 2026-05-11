export type LocalMindmapLesson = {
  lessonId: string;
  lessonOrder: number;
  title: string;
  shortTitle: string;
  description: string;
  imageUrl: string;
  keywords: string[];
  nodes: {
    title: string;
    content: string;
  }[];
};

export const localMindmapLessons: LocalMindmapLesson[] = [
  {
    lessonId: "lesson-1",
    lessonOrder: 1,
    title: "Ôn tập kiến thức nền lớp 7",
    shortTitle: "Kiến thức nền",
    description: "Hệ thống lại kiến thức nền trước khi học Hóa học 8.",
    imageUrl: "/mindmaps/lesson-1.png",
    keywords: ["chất", "vật thể", "nguyên tử", "phân tử"],
    nodes: [
      { title: "Chất", content: "Vật chất tạo nên vật thể." },
      { title: "Nguyên tử", content: "Hạt vô cùng nhỏ tạo nên chất." },
      { title: "Phân tử", content: "Gồm các nguyên tử liên kết với nhau." },
    ],
  },
  {
    lessonId: "lesson-2",
    lessonOrder: 2,
    title: "Bài 2: Phản ứng hóa học",
    shortTitle: "Phản ứng hóa học",
    description: "Nhận biết phản ứng hóa học, chất phản ứng và sản phẩm.",
    imageUrl: "/mindmaps/lesson-2.png",
    keywords: ["phản ứng", "chất tham gia", "sản phẩm", "dấu hiệu"],
    nodes: [
      { title: "Khái niệm", content: "Phản ứng hóa học là quá trình biến đổi chất này thành chất khác." },
      { title: "Chất tham gia", content: "Là chất ban đầu trước phản ứng." },
      { title: "Sản phẩm", content: "Là chất mới tạo thành sau phản ứng." },
      { title: "Dấu hiệu", content: "Có khí, kết tủa, đổi màu hoặc tỏa nhiệt." },
    ],
  },
  {
    lessonId: "lesson-3",
    lessonOrder: 3,
    title: "Bài 3: Mol và tỉ khối của chất khí",
    shortTitle: "Mol và tỉ khối",
    description: "Hiểu mol, khối lượng mol, thể tích mol và tỉ khối khí.",
    imageUrl: "/mindmaps/lesson-3.png",
    keywords: ["mol", "khối lượng mol", "thể tích mol", "tỉ khối"],
    nodes: [
      { title: "Mol", content: "Là lượng chất có chứa 6,022 × 10²³ hạt vi mô." },
      { title: "Khối lượng mol", content: "Là khối lượng của 1 mol chất, đơn vị g/mol." },
      { title: "Thể tích mol khí", content: "Ở điều kiện chuẩn, 1 mol khí chiếm 24,79 lít." },
      { title: "Tỉ khối", content: "Cho biết khí này nặng hay nhẹ hơn khí khác." },
    ],
  },
  {
    lessonId: "lesson-4",
    lessonOrder: 4,
    title: "Bài 4: Nồng độ dung dịch",
    shortTitle: "Nồng độ dung dịch",
    description: "Tính nồng độ phần trăm và nồng độ mol của dung dịch.",
    imageUrl: "/mindmaps/lesson-4.png",
    keywords: ["dung dịch", "nồng độ", "C%", "CM"],
    nodes: [
      { title: "Dung dịch", content: "Hỗn hợp đồng nhất giữa dung môi và chất tan." },
      { title: "Nồng độ phần trăm", content: "Cho biết số gam chất tan trong 100 gam dung dịch." },
      { title: "Nồng độ mol", content: "Cho biết số mol chất tan trong 1 lít dung dịch." },
      { title: "Pha loãng", content: "Thêm dung môi làm nồng độ giảm." },
    ],
  },
  {
    lessonId: "lesson-5",
    lessonOrder: 5,
    title: "Bài 5: Định luật bảo toàn khối lượng",
    shortTitle: "Bảo toàn khối lượng",
    description: "Hiểu định luật bảo toàn khối lượng và lập phương trình hóa học.",
    imageUrl: "/mindmaps/lesson-5.png",
    keywords: ["bảo toàn", "khối lượng", "phương trình", "hệ số"],
    nodes: [
      { title: "Định luật", content: "Tổng khối lượng chất tham gia bằng tổng khối lượng sản phẩm." },
      { title: "Phương trình hóa học", content: "Biểu diễn phản ứng hóa học bằng công thức hóa học." },
      { title: "Cân bằng", content: "Số nguyên tử mỗi nguyên tố ở hai vế phải bằng nhau." },
      { title: "Hệ số", content: "Số đặt trước công thức để cân bằng phương trình." },
    ],
  },
  {
    lessonId: "lesson-6",
    lessonOrder: 6,
    title: "Bài 6: Tính theo phương trình hóa học",
    shortTitle: "Tính theo PTHH",
    description: "Tính khối lượng, số mol và thể tích theo phương trình hóa học.",
    imageUrl: "/mindmaps/lesson-6.png",
    keywords: ["số mol", "khối lượng", "thể tích", "PTHH"],
    nodes: [
      { title: "Bước 1", content: "Viết và cân bằng phương trình hóa học." },
      { title: "Bước 2", content: "Đổi dữ kiện đề bài về số mol nếu cần." },
      { title: "Bước 3", content: "Dựa vào tỉ lệ hệ số để tìm số mol chất cần tính." },
      { title: "Bước 4", content: "Đổi số mol ra khối lượng hoặc thể tích." },
    ],
  },
  {
    lessonId: "lesson-7",
    lessonOrder: 7,
    title: "Bài 7: Tốc độ phản ứng và chất xúc tác",
    shortTitle: "Tốc độ phản ứng",
    description: "Các yếu tố ảnh hưởng đến tốc độ phản ứng hóa học.",
    imageUrl: "/mindmaps/lesson-7.png",
    keywords: ["tốc độ", "nhiệt độ", "nồng độ", "xúc tác"],
    nodes: [
      { title: "Tốc độ phản ứng", content: "Cho biết phản ứng xảy ra nhanh hay chậm." },
      { title: "Nhiệt độ", content: "Tăng nhiệt độ thường làm phản ứng nhanh hơn." },
      { title: "Nồng độ", content: "Tăng nồng độ chất phản ứng có thể làm phản ứng nhanh hơn." },
      { title: "Chất xúc tác", content: "Làm tăng tốc độ phản ứng nhưng không bị tiêu hao sau phản ứng." },
    ],
  },
  {
    lessonId: "lesson-8",
    lessonOrder: 8,
    title: "Bài 8: Acid",
    shortTitle: "Acid",
    description: "Tính chất hóa học, nhận biết và ứng dụng của acid.",
    imageUrl: "/mindmaps/lesson-8.png",
    keywords: ["acid", "H", "quỳ tím", "kim loại"],
    nodes: [
      { title: "Khái niệm", content: "Acid là hợp chất tạo ra ion H⁺ trong dung dịch." },
      { title: "Quỳ tím", content: "Acid làm quỳ tím chuyển đỏ." },
      { title: "Tác dụng với kim loại", content: "Một số acid phản ứng với kim loại tạo muối và khí hydrogen." },
      { title: "Ứng dụng", content: "Dùng trong sản xuất, phòng thí nghiệm và đời sống." },
    ],
  },
  {
    lessonId: "lesson-9",
    lessonOrder: 9,
    title: "Bài 9: Base và thang pH",
    shortTitle: "Base - pH",
    description: "Nhận biết base, môi trường acid-base và ý nghĩa thang pH.",
    imageUrl: "/mindmaps/lesson-9.png",
    keywords: ["base", "OH", "pH", "kiềm"],
    nodes: [
      { title: "Base", content: "Base tan trong nước tạo môi trường kiềm." },
      { title: "Quỳ tím", content: "Dung dịch base làm quỳ tím chuyển xanh." },
      { title: "pH", content: "pH nhỏ hơn 7 là acid, bằng 7 là trung tính, lớn hơn 7 là base." },
      { title: "Trung hòa", content: "Acid tác dụng với base tạo muối và nước." },
    ],
  },
  {
    lessonId: "lesson-10",
    lessonOrder: 10,
    title: "Bài 10: Oxide",
    shortTitle: "Oxide",
    description: "Phân loại oxide và tính chất của oxide acid, oxide base.",
    imageUrl: "/mindmaps/lesson-10.png",
    keywords: ["oxide", "oxide acid", "oxide base", "oxygen"],
    nodes: [
      { title: "Oxide", content: "Hợp chất gồm oxygen và một nguyên tố khác." },
      { title: "Oxide acid", content: "Thường là oxide của phi kim, tác dụng với base tạo muối." },
      { title: "Oxide base", content: "Thường là oxide của kim loại, tác dụng với acid tạo muối và nước." },
      { title: "Phân loại", content: "Cần dựa vào thành phần và tính chất hóa học." },
    ],
  },
  {
    lessonId: "lesson-11",
    lessonOrder: 11,
    title: "Bài 11: Muối",
    shortTitle: "Muối",
    description: "Khái niệm, phân loại, tính chất và điều chế muối.",
    imageUrl: "/mindmaps/lesson-11.png",
    keywords: ["muối", "cation", "anion", "trung hòa"],
    nodes: [
      { title: "Khái niệm", content: "Muối là hợp chất tạo bởi ion kim loại hoặc NH₄⁺ và gốc acid." },
      { title: "Tạo muối", content: "Muối có thể tạo ra từ phản ứng acid với base, oxide base hoặc kim loại." },
      { title: "Tính tan", content: "Một số muối tan, một số muối không tan trong nước." },
      { title: "Ứng dụng", content: "Muối có nhiều vai trò trong đời sống, nông nghiệp và công nghiệp." },
    ],
  },
  {
    lessonId: "lesson-12",
    lessonOrder: 12,
    title: "Bài 12: Phân bón hóa học",
    shortTitle: "Phân bón",
    description: "Vai trò của phân bón hóa học và cách sử dụng hợp lý.",
    imageUrl: "/mindmaps/lesson-12.png",
    keywords: ["phân bón", "đạm", "lân", "kali", "NPK"],
    nodes: [
      { title: "Phân đạm", content: "Cung cấp nitrogen giúp cây phát triển thân lá." },
      { title: "Phân lân", content: "Cung cấp phosphorus giúp rễ phát triển." },
      { title: "Phân kali", content: "Cung cấp potassium giúp cây cứng cáp, tăng sức chống chịu." },
      { title: "Sử dụng hợp lý", content: "Bón đúng loại, đúng liều lượng, đúng thời điểm để tránh ô nhiễm." },
    ],
  },
];

export function getLocalMindmapByLessonId(lessonId: string) {
  return localMindmapLessons.find((lesson) => lesson.lessonId === lessonId);
}