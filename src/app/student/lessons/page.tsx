export default function LessonsPage() {
  const lessons = [
    "Bài 1: Chất và sự biến đổi của chất",
    "Bài 2: Nguyên tử",
    "Bài 3: Phân tử",
    "Bài 4: Tế bào",
    "Bài 5: Lực",
    "Bài 6: Năng lượng",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Danh sách bài học</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {lessons.map((lesson, index) => (
          <div key={index} className="border rounded-2xl p-4">
            <h2 className="font-semibold text-lg">{lesson}</h2>
            <p className="text-gray-600 mt-2">
              Video bài giảng, tài liệu, mindmap và bài tập đi kèm.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}