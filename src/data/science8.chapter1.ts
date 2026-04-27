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
lessonId: 'khtn8-c1-b2',
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
lessonId: 'khtn8-c1-b3',
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
lessonId: 'khtn8-c1-b4',
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
lessonId: 'khtn8-c1-b5',
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
lessonId: 'khtn8-c1-b6',
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
lessonId: 'khtn8-c1-b7',
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
}
];