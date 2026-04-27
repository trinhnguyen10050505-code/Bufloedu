import { QueueItem, StudentLevel } from "@/types";

export function generateLearningQueue(
  level: StudentLevel,
  weakLessons: string[]
): QueueItem[] {
  const queue: QueueItem[] = [];

  weakLessons.forEach((lessonId, index) => {
    queue.push({
      id: `lesson-${index}-${lessonId}`,
      type: "lesson",
      lessonId,
      title: `Ôn lý thuyết ${lessonId}`,
      description: "Đọc phần tóm tắt kiến thức trọng tâm.",
      recommendedLevel: level
    });

    queue.push({
      id: `video-${index}-${lessonId}`,
      type: "video",
      lessonId,
      title: `Xem video bài giảng ${lessonId}`,
      description: "Học lại nội dung qua video ngắn.",
      recommendedLevel: level
    });

    queue.push({
      id: `practice-${index}-${lessonId}`,
      type: "practice",
      lessonId,
      title: `Luyện tập ${lessonId}`,
      description:
        level === "trungbinh"
          ? "Ưu tiên câu nhận biết và thông hiểu."
          : level === "kha"
          ? "Luyện thông hiểu và một phần vận dụng."
          : "Luyện nhiều câu vận dụng và vận dụng cao.",
      recommendedLevel: level
    });

    queue.push({
      id: `quiz-${index}-${lessonId}`,
      type: "quiz",
      lessonId,
      title: `Kiểm tra nhanh ${lessonId}`,
      description: "Làm bài kiểm tra ngắn để củng cố kiến thức.",
      recommendedLevel: level
    });
  });

  return queue;
}