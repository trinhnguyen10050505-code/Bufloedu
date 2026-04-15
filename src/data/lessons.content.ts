import { LessonContent } from "../types/lesson";

export const lessonsContent: Record<string, LessonContent> = {
  "lesson-2": {
    id: "lesson-2",
    title: "Phản ứng hóa học",
    theory: [
      {
        title: "Biến đổi vật lí và biến đổi hóa học",
        sections: [
          {
            subtitle: "Biến đổi vật lí",
            content:
              "Là hiện tượng chất biến đổi về trạng thái, hình dạng, kích thước nhưng vẫn giữ nguyên là chất ban đầu.",
            examples: [
              "Nước bay hơi",
              "Hòa tan đường vào nước",
              "Nước hoa khuếch tán"
            ]
          },
          {
            subtitle: "Biến đổi hóa học",
            content:
              "Là hiện tượng chất biến đổi có tạo thành chất mới.",
            examples: [
              "Nến cháy",
              "Thức ăn bị ôi thiu",
              "Quang hợp"
            ]
          }
        ]
      },
      {
        title: "Phản ứng hóa học",
        sections: [
          {
            subtitle: "Khái niệm",
            content:
              "Phản ứng hóa học là quá trình biến đổi chất này thành chất khác."
          },
          {
            subtitle: "Dấu hiệu nhận biết",
            content:
              "Có chất mới tạo thành: đổi màu, khí, kết tủa, tỏa nhiệt..."
          }
        ]
      },
      {
        title: "Năng lượng phản ứng",
        sections: [
          {
            subtitle: "Phản ứng tỏa nhiệt",
            content: "Giải phóng nhiệt ra môi trường"
          },
          {
            subtitle: "Phản ứng thu nhiệt",
            content: "Thu nhiệt từ môi trường"
          }
        ]
      }
    ]
  }
};