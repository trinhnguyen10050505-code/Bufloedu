import { PracticeQuestion } from "@/types/practice-final";

export function buildAdaptiveRecommendation(params: {
  accuracy: number;
  weakLessonIds: string[];
  studentLevel: string;
  questions: PracticeQuestion[];
}) {
  const {
    accuracy,
    weakLessonIds,
    studentLevel,
    questions,
  } = params;

  /**
   * Tìm lesson sai nhiều nhất
   */
  const lessonFrequency: Record<string, number> = {};

  weakLessonIds.forEach((lessonId) => {
    lessonFrequency[lessonId] =
      (lessonFrequency[lessonId] || 0) + 1;
  });

  const weakestLesson =
    Object.entries(lessonFrequency).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

  const weakestQuestion =
    questions.find(
      (q) => q.lessonId === weakestLesson
    );

  /**
   * Random strategy
   */
  const lowStrategies = [
    "Bu gợi ý em xem lại mindmap rồi luyện lại từng câu Nhận biết trước.",
    "Bu nghĩ em nên quay lại lý thuyết ngắn trước khi luyện thêm.",
    "Em nên luyện lại theo từng bước nhỏ thay vì làm nhanh toàn bộ.",
  ];

  const mediumStrategies = [
    "Bu gợi ý em luyện thêm một bộ câu mới để chắc kiến thức hơn.",
    "Em đã hiểu một phần rồi, hãy thử thêm vài câu vận dụng.",
    "Bu nghĩ em nên xem lại ví dụ mẫu trước khi luyện tiếp.",
  ];

  const highStrategies = [
    "Bu nghĩ em đã khá chắc bài và có thể chuyển sang quick-test.",
    "Em đang học rất tốt, hãy thử mức vận dụng cao hơn.",
    "Bu gợi ý em học bài tiếp theo để giữ nhịp tiến bộ.",
  ];

  const randomPick = (items: string[]) =>
    items[Math.floor(Math.random() * items.length)];

  /**
   * chọn message theo accuracy
   */
  let strategy = "";

  if (accuracy < 50) {
    strategy = randomPick(lowStrategies);
  } else if (accuracy < 80) {
    strategy = randomPick(mediumStrategies);
  } else {
    strategy = randomPick(highStrategies);
  }

  /**
   * recommendation
   */
  return {
    weakestLesson,
    weakestLessonTitle:
      weakestQuestion?.lessonTitle ||
      "Bài cần ôn lại",

    strategy,

    shouldReviewMindmap:
      accuracy < 70,

    shouldDoQuickTest:
      accuracy >= 80,

    shouldPracticeAgain:
      accuracy < 80,

    levelMessage:
      studentLevel === "gioi"
        ? "Bu thấy em đang ở mức khá tốt."
        : studentLevel === "kha"
        ? "Em đang tiến bộ khá ổn."
        : "Bu sẽ đồng hành cùng em từng bước.",
  };
}