import { StudentLevel } from "@/types";

export type EnergyMode = "thap" | "vua" | "cao";

export type FocusPlan = {
  recommendedMinutes: number;
  modeLabel: string;
  sessionGoal: string;
  breakAdvice: string;
  postSessionAction: string;
};

export function buildFocusPlan(params: {
  level: StudentLevel;
  energyMode: EnergyMode;
  weakTopics: string[];
}): FocusPlan {
  const { level, energyMode, weakTopics } = params;
  const baseGoal = {
    trungbinh: "Giữ nhịp học ổn định và củng cố kiến thức nền tảng.",
    kha: "Tăng cường luyện tập để chuyển sang câu vận dụng và làm chắc phần còn yếu.",
    gioi: "Duy trì tốc độ và tăng sức bền khi học các phần nâng cao.",
  }[level];

  const energyGuidance = {
    thap: {
      label: "Năng lượng thấp",
      minutes: 15,
      breakAdvice: "Nghỉ ngắn 2-3 phút giữa phiên để làm mới đầu óc.",
    },
    vua: {
      label: "Năng lượng bình thường",
      minutes: 25,
      breakAdvice: "Tiếp tục giữ nhịp học đều và uống nước nhẹ nhàng.",
    },
    cao: {
      label: "Năng lượng cao",
      minutes: 40,
      breakAdvice: "Giữ tập trung, sau phiên có thể kiểm tra nhanh để ghi nhớ tốt hơn.",
    },
  }[energyMode];

  const weakTopicAdvice = weakTopics.length
    ? `Bu thấy em còn yếu ${weakTopics.join(", ")}. Hãy ưu tiên ôn lại phần đó sau phiên.`
    : "Bu chưa thấy phần yếu nổi bật, nên tập trung duy trì nhịp học đều.";

  return {
    recommendedMinutes: energyGuidance.minutes,
    modeLabel: `${energyGuidance.label} · ${level === "gioi" ? "Cao cấp" : level === "kha" ? "Tiến bộ" : "Cơ bản"}`,
    sessionGoal: `${baseGoal} ${weakTopicAdvice}`,
    breakAdvice: energyGuidance.breakAdvice,
    postSessionAction:
      weakTopics.length > 0
        ? `Ôn tiếp các bài ${weakTopics.join(", ")} hoặc chọn thử lại quick-test sau khi nghỉ.`
        : "Tiếp tục bài luyện tập hoặc làm quick-test để kiểm tra lại mức học của em.",
  };
}
