import { StudentLevel } from "@/types/practice-final";

export function mapAccuracyToStudentLevel(accuracy: number): StudentLevel {
  if (accuracy >= 80) return "gioi";
  if (accuracy >= 50) return "kha";
  return "trungbinh";
}

export function getBuLevelMeta(level: StudentLevel) {
  if (level === "gioi") {
    return {
      key: "gioi",
      label: "Bu Năng nổ",
      realLevel: "Giỏi",
      shortDescription:
        "Em đang học rất tốt, có thể thử câu vận dụng và học bài mới.",
      longDescription:
        "Bu thấy em nắm bài khá chắc. Em nên duy trì quick-test, luyện vận dụng và học tiếp bài mới.",
      badgeClass: "bg-emerald-100 text-emerald-700",
      cardClass: "border-emerald-200 bg-emerald-50",
      gardenLabel: "Khu vườn xanh tốt",
      gardenDescription:
        "Bu đã được ăn no nhờ những lượt học chắc chắn của em.",
    };
  }

  if (level === "kha") {
    return {
      key: "kha",
      label: "Bu Thông minh",
      realLevel: "Khá",
      shortDescription:
        "Em đã hiểu phần lớn kiến thức, cần luyện thêm để chắc hơn.",
      longDescription:
        "Bu gợi ý em luyện thêm câu thông hiểu và vận dụng cơ bản ở bài còn yếu.",
      badgeClass: "bg-blue-100 text-blue-700",
      cardClass: "border-blue-200 bg-blue-50",
      gardenLabel: "Khu vườn đang lớn",
      gardenDescription:
        "Bu đang có thêm năng lượng, em tiếp tục luyện đều nhé.",
    };
  }

  return {
    key: "trungbinh",
    label: "Bu Chăm chỉ",
    realLevel: "Trung bình",
    shortDescription:
      "Em đang xây nền kiến thức, cần học chắc từng bước.",
    longDescription:
      "Bu khuyên em xem lại lý thuyết, mindmap, rồi luyện nhận biết và thông hiểu trước.",
    badgeClass: "bg-amber-100 text-amber-700",
    cardClass: "border-amber-200 bg-amber-50",
    gardenLabel: "Khu vườn mới nảy mầm",
    gardenDescription:
      "Bu cần em học đều hơn để cỏ mọc xanh và có thêm thức ăn.",
  };
}