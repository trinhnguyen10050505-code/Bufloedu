export type TLessonAssetStatus = 'draft' | 'queued' | 'processing' | 'ready';
export type TLessonVideo = {
id: string;
title: string;
duration: string;
thumbnail: string;
videoUrl?: string;
videoHref?: string;
status: TLessonAssetStatus;
};
export type TLessonExercise = {
id: string;
title: string;
questionCount: number;
difficulty: 'easy' | 'medium' | 'hard';
status: TLessonAssetStatus;
};
export type TLessonQuiz = {
id: string;
title: string;
questionCount: number;
timeLimitMinutes: number;
status: TLessonAssetStatus;
};
export type TScienceLessonQueueItem = {
lessonId: string;
chapter: string;
chapterNumber: number;
lessonNumber: number;
lessonTitle: string;
slug: string;
description: string;
tags: string[];
video: TLessonVideo;
exercise: TLessonExercise;
quiz: TLessonQuiz;
};
export const science8Chapter1Queue: TScienceLessonQueueItem[] = [
{
lessonId: 'lesson-2',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 2,
lessonTitle: 'Bài 2. Phản ứng hóa học',
slug: 'bai-2-phan-ung-hoa-hoc',
description:
'Tìm hiểu khái niệm phản ứng hóa học, dấu hiệu nhận biết và cách mô tả sự biến đổi chất trong phản ứng.',
tags: ['khtn8', 'chuong-1', 'phan-ung-hoa-hoc'],
video: {
id: 'video-khtn8-c1-b2',
title: 'Video bài giảng: Bài 2. Phản ứng hóa học',
duration: '15:00',
thumbnail: '/images/science8/chapter1/bai2-video.jpg',
videoHref: '/lessons/chemistry/chapter-1/bai-2',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b2',
title: 'Bài tập luyện tập: Bài 2',
questionCount: 10,
difficulty: 'easy',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b2',
title: 'Bài kiểm tra: Bài 2',
questionCount: 15,
timeLimitMinutes: 15,
status: 'queued'
}
},
{
lessonId: 'lesson-3',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 3,
lessonTitle: 'Bài 3. Mol và tỉ khối chất khí',
slug: 'bai-3-mol-va-ti-khoi-chat-khi',
description:
'Học về khái niệm mol, khối lượng mol, thể tích mol chất khí và cách tính tỉ khối chất khí trong các bài toán cơ bản.',
tags: ['khtn8', 'chuong-1', 'mol', 'ti-khoi-chat-khi'],
video: {
id: 'video-khtn8-c1-b3',
title: 'Video bài giảng: Bài 3. Mol và tỉ khối chất khí',
duration: '18:00',
thumbnail: '/images/science8/chapter1/bai3-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b3',
title: 'Bài tập luyện tập: Bài 3',
questionCount: 12,
difficulty: 'medium',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b3',
title: 'Bài kiểm tra: Bài 3',
questionCount: 15,
timeLimitMinutes: 20,
status: 'queued'
}
},
{
lessonId: 'lesson-4',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 4,
lessonTitle: 'Bài 4. Dung dịch và nồng độ',
slug: 'bai-4-dung-dich-va-nong-do',
description:
'Nắm được khái niệm dung dịch, chất tan, dung môi và các cách biểu diễn nồng độ thường dùng trong học tập.',
tags: ['khtn8', 'chuong-1', 'dung-dich', 'nong-do'],
video: {
id: 'video-khtn8-c1-b4',
title: 'Video bài giảng: Bài 4. Dung dịch và nồng độ',
duration: '16:30',
thumbnail: '/images/science8/chapter1/bai4-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b4',
title: 'Bài tập luyện tập: Bài 4',
questionCount: 12,
difficulty: 'medium',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b4',
title: 'Bài kiểm tra: Bài 4',
questionCount: 15,
timeLimitMinutes: 20,
status: 'queued'
}
},
{
lessonId: 'lesson-5',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 5,
lessonTitle: 'Bài 5. Định luật bảo toàn khối lượng và phương trình hóa học',
slug: 'bai-5-dinh-luat-bao-toan-khoi-luong-va-phuong-trinh-hoa-hoc',
description:
'Tìm hiểu định luật bảo toàn khối lượng, cách lập phương trình hóa học và vai trò của hệ số trong phương trình.',
tags: ['khtn8', 'chuong-1', 'bao-toan-khoi-luong', 'phuong-trinh-hoa-hoc'],
video: {
id: 'video-khtn8-c1-b5',
title: 'Video bài giảng: Bài 5. Định luật bảo toàn khối lượng và phương trình hóa học',
duration: '20:00',
thumbnail: '/images/science8/chapter1/bai5-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b5',
title: 'Bài tập luyện tập: Bài 5',
questionCount: 15,
difficulty: 'medium',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b5',
title: 'Bài kiểm tra: Bài 5',
questionCount: 20,
timeLimitMinutes: 25,
status: 'queued'
}
},
{
lessonId: 'lesson-6',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 6,
lessonTitle: 'Bài 6. Tính theo phương trình hóa học',
slug: 'bai-6-tinh-theo-phuong-trinh-hoa-hoc',
description:
'Rèn luyện kỹ năng tính toán theo phương trình hóa học dựa trên số mol, khối lượng và thể tích chất khí.',
tags: ['khtn8', 'chuong-1', 'tinh-theo-phuong-trinh-hoa-hoc'],
video: {
id: 'video-khtn8-c1-b6',
title: 'Video bài giảng: Bài 6. Tính theo phương trình hóa học',
duration: '19:00',
thumbnail: '/images/science8/chapter1/bai6-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b6',
title: 'Bài tập luyện tập: Bài 6',
questionCount: 15,
difficulty: 'hard',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b6',
title: 'Bài kiểm tra: Bài 6',
questionCount: 20,
timeLimitMinutes: 25,
status: 'queued'
}
},
{
lessonId: 'lesson-7',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 7,
lessonTitle: 'Bài 7. Tốc độ phản ứng và chất xúc tác',
slug: 'bai-7-toc-do-phan-ung-va-chat-xuc-tac',
description:
'Tìm hiểu các yếu tố ảnh hưởng đến tốc độ phản ứng và vai trò của chất xúc tác trong thực tế.',
tags: ['khtn8', 'chuong-1', 'toc-do-phan-ung', 'chat-xuc-tac'],
video: {
id: 'video-khtn8-c1-b7',
title: 'Video bài giảng: Bài 7. Tốc độ phản ứng và chất xúc tác',
duration: '17:30',
thumbnail: '/images/science8/chapter1/bai7-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b7',
title: 'Bài tập luyện tập: Bài 7',
questionCount: 12,
difficulty: 'medium',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b7',
title: 'Bài kiểm tra: Bài 7',
questionCount: 15,
timeLimitMinutes: 20,
status: 'queued'
}
},
{
lessonId: 'lesson-8',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 8,
lessonTitle: 'Bài 8. Phản ứng oxi hóa - khử',
slug: 'bai-8-phan-ung-oxi-hoa-khu',
description:
'Hiểu về phản ứng oxi hóa - khử, cách xác định chất oxi hóa và chất khử trong phản ứng.',
tags: ['khtn8', 'chuong-1', 'oxi-hoa-khu'],
video: {
id: 'video-khtn8-c1-b8',
title: 'Video bài giảng: Bài 8. Phản ứng oxi hóa - khử',
duration: '18:30',
thumbnail: '/images/science8/chapter1/bai8-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b8',
title: 'Bài tập luyện tập: Bài 8',
questionCount: 12,
difficulty: 'medium',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b8',
title: 'Bài kiểm tra: Bài 8',
questionCount: 15,
timeLimitMinutes: 20,
status: 'queued'
}
},
{lessonId: 'lesson-9',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 9,
lessonTitle: 'Bài 9. Các loại phản ứng hóa học',
slug: 'bai-9-cac-loai-phan-ung-hoa-hoc',
description:
' Tìm hiểu các loại phản ứng hóa học phổ biến như phản ứng hóa hợp, phân hủy, thế và trao đổi.',
tags: ['khtn8', 'chuong-1', 'loai-phan-ung-hoa-hoc'],
video: {
id: 'video-khtn8-c1-b9',
title: 'Video bài giảng: Bài 9. Các loại phản ứng hóa học',
duration: '16:00',
thumbnail: '/images/science8/chapter1/bai9-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b9',
title: 'Bài tập luyện tập: Bài 9',
questionCount: 12,
difficulty: 'medium',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b9',
title: 'Bài kiểm tra: Bài 9',
questionCount: 15,
timeLimitMinutes: 20,
status: 'queued'
}
},
{lessonId: 'lesson-10',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 10,
lessonTitle: 'Bài 10. Tổng kết chương 1',
slug: 'bai-10-tong-ket-chuong-1',
description:
'Ôn tập và củng cố kiến thức về các phản ứng hóa học đã học trong chương 1.',
tags: ['khtn8', 'chuong-1', 'tong-ket'],
video: {
id: 'video-khtn8-c1-b10',
title: 'Video bài giảng: Bài 10. Tổng kết chương 1',
duration: '20:00',
thumbnail: '/images/science8/chapter1/bai10-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b10',
title: 'Bài tập luyện tập: Bài 10',
questionCount: 20,
difficulty: 'hard',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b10',
title: 'Bài kiểm tra: Bài 10',
questionCount: 25,
timeLimitMinutes: 30,
status: 'queued'
}
},
{lessonId: 'lesson-11',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 11,
lessonTitle: 'Bài 11. Ôn tập chương 1',
slug: 'bai-11-on-tap-chuong-1',
description:
'Ôn tập và củng cố kiến thức về các phản ứng hóa học đã học trong chương 1.',
tags: ['khtn8', 'chuong-1', 'on-tap'],
video: {
id: 'video-khtn8-c1-b11',
title: 'Video bài giảng: Bài 11. Ôn tập chương 1',
duration: '25:00',
thumbnail: '/images/science8/chapter1/bai11-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b11',
title: 'Bài tập luyện tập: Bài 11',
questionCount: 25,
difficulty: 'hard',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b11',
title: 'Bài kiểm tra: Bài 11',
questionCount: 30,
timeLimitMinutes: 35,
status: 'queued'
}
},
{lessonId: 'lesson-12',
chapter: 'Chương 1: Phản ứng hóa học',
chapterNumber: 1,
lessonNumber: 12,
lessonTitle: 'Bài 12. Kiểm tra chương 1',
slug: 'bai-12-kiem-tra-chuong-1',
description:
'Kiểm tra kiến thức đã học trong chương 1 về các phản ứng hóa học.',
tags: ['khtn8', 'chuong-1', 'kiem-tra'],
video: {
id: 'video-khtn8-c1-b12',
title: 'Video bài giảng: Bài 12. Kiểm tra chương 1',
duration: '30:00',
thumbnail: '/images/science8/chapter1/bai12-video.jpg',
status: 'queued'
},
exercise: {
id: 'exercise-khtn8-c1-b12',
title: 'Bài tập luyện tập: Bài 12',
questionCount: 30,
difficulty: 'hard',
status: 'queued'
},
quiz: {
id: 'quiz-khtn8-c1-b12',
title: 'Bài kiểm tra: Bài 12',
questionCount: 35,
timeLimitMinutes: 40,
status: 'queued'
}
}
];

function levelToNumber(level: string) {
  if (level === "Bu Thông thái") return 3;
  if (level === "Bu Vững vàng") return 2;
  if (level === "Bu Chăm chỉ") return 1;
     return 0;
}
