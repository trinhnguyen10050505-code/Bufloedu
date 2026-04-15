'use client';

import { useRouter } from 'next/navigation';

type Props = {
  lesson: any;
};

export default function QueueCard({ lesson }: Props) {
  const router = useRouter();

  // fake progress (sau này lấy từ Firebase)
  const progress = Math.floor(Math.random() * 100);

  const getStatusColor = () => {
    if (lesson.video.status === 'ready') return 'green';
    if (lesson.video.status === 'processing') return 'orange';
    return 'gray';
  };

  return (
    <div
      onClick={() => router.push(`/student/lessons/${lesson.slug}`)}
      style={{
        cursor: 'pointer',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: '0.3s'
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = 'scale(1.02)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = 'scale(1)')
      }
    >
      {/* Thumbnail */}
      <img
        src={lesson.video.thumbnail}
        alt=""
        style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          borderRadius: 12
        }}
      />

      {/* Title */}
      <h3 style={{ marginTop: 10 }}>{lesson.lessonTitle}</h3>

      {/* Description */}
      <p style={{ color: '#666', fontSize: 14 }}>
        {lesson.description}
      </p>

      {/* Info */}
      <div style={{ marginTop: 8, fontSize: 14 }}>
        🎥 {lesson.video.duration} | 📘 {lesson.exercise.questionCount} câu | 📝 {lesson.quiz.questionCount} câu
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 8,
          background: '#eee',
          borderRadius: 10,
          marginTop: 10
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#4CAF50',
            borderRadius: 10,
            transition: '0.5s'
          }}
        />
      </div>

      {/* Status */}
      <div style={{ marginTop: 8 }}>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: 10,
            background: getStatusColor(),
            color: 'white',
            fontSize: 12
          }}
        >
          {lesson.video.status}
        </span>
      </div>
    </div>
  );
}