import { StudentLevel } from "../types";

export type BuLevelKey = "bu_cham_chi" | "bu_thong_minh" | "bu_nang_no";

export interface BuLevelMeta {
  key: BuLevelKey;
  label: string;
  shortDescription: string;
  longDescription: string;
  badgeClass: string;
  cardClass: string;
  encouragement: string;
}

export function mapStudentLevelToBuKey(level: StudentLevel): BuLevelKey {
  switch (level) {
    case "gioi":
      return "bu_nang_no";
    case "kha":
      return "bu_thong_minh";
    case "trungbinh":
    default:
      return "bu_cham_chi";
  }
}

export function getBuLevelMeta(level: StudentLevel): BuLevelMeta {
  const buKey = mapStudentLevelToBuKey(level);

  switch (buKey) {
    case "bu_nang_no":
      return {
        key: "bu_nang_no",
        label: "Bu Năng nổ",
        shortDescription: "Bu thấy em đang học rất chủ động và xử lý tốt cả câu nâng cao.",
        longDescription:
          "Em đang có nhịp học rất tốt, biết tự khám phá kiến thức mới và làm được nhiều dạng bài khó hơn. Bu rất vui vì em đang tiến bộ mạnh mẽ.",
        badgeClass: "bg-emerald-100 text-emerald-700",
        cardClass: "border-emerald-200 bg-emerald-50",
        encouragement:
          "Bu gợi ý em tiếp tục thử các câu vận dụng và kiểm tra nhanh để giữ phong độ nhé.",
      };

    case "bu_thong_minh":
      return {
        key: "bu_thong_minh",
        label: "Bu Thông minh",
        shortDescription: "Bu thấy em đã hiểu bài khá chắc và đang tiến bộ đều từng bước.",
        longDescription:
          "Em đã nắm tốt phần lớn kiến thức của bài, làm được nhiều câu thông hiểu và bắt đầu xử lý tốt dạng vận dụng. Chỉ cần luyện thêm một chút nữa là em sẽ bứt lên rất nhanh.",
        badgeClass: "bg-blue-100 text-blue-700",
        cardClass: "border-blue-200 bg-blue-50",
        encouragement:
          "Bu gợi ý em luyện thêm theo bài và làm kiểm tra nhanh để nâng độ chắc kiến thức nhé.",
      };

    case "bu_cham_chi":
    default:
      return {
        key: "bu_cham_chi",
        label: "Bu Chăm chỉ",
        shortDescription: "Bu thấy em đang xây nền kiến thức rất tốt từng bước một.",
        longDescription:
          "Em đang ở giai đoạn quan trọng để hiểu chắc khái niệm, phân biệt đúng hiện tượng và làm quen với các dạng bài cơ bản. Bu tin rằng nếu em giữ nhịp học đều thì sẽ tiến bộ rất nhanh.",
        badgeClass: "bg-amber-100 text-amber-700",
        cardClass: "border-amber-200 bg-amber-50",
        encouragement:
          "Bu gợi ý em xem lại lý thuyết chính, luyện mức cơ bản và làm từng bước thật chắc nhé.",
      };
  }
}

/**
 * Dùng khi cần hiển thị text ngắn gọn.
 */
export function getBuLevelLabel(level: StudentLevel): string {
  return getBuLevelMeta(level).label;
}

/**
 * Dùng khi cần hiển thị mô tả ngắn trên dashboard/results.
 */
export function getBuLevelDescription(level: StudentLevel): string {
  return getBuLevelMeta(level).shortDescription;
}