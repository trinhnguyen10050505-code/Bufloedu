'use client'; // 🔥 BẮT BUỘC

import { useRouter } from 'next/navigation';
import { science8Chapter1Queue } from '@/data/science8-chapter1.constant';

export default function StudentPage() {
  const router = useRouter(); // ✅ Đặt trong component

  return (
    <div style={{ padding: 20 }}>
      <h1>🎯 Lộ trình học KHTN 8</h1>

      {science8Chapter1Queue.map((lesson) => (
        <div
          key={lesson.lessonId}
          style={{
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 16,
            marginTop: 12
          }}
        >
          <h2>{lesson.lessonTitle}</h2>
          <p>{lesson.description}</p>

          <button
            onClick={() => router.push('/student/lessons')}
            style={{ marginTop: 10 }}
          >
            Học ngay
          </button>
        </div>
      ))}
    </div>
  );
}