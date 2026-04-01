export default function ExercisesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bài tập</h1>

      <div className="space-y-4">
        <div className="border rounded-2xl p-4">
          <h2 className="font-semibold">Bài tập theo mức độ trung bình</h2>
        </div>
        <div className="border rounded-2xl p-4">
          <h2 className="font-semibold">Bài tập theo mức độ khá</h2>
        </div>
        <div className="border rounded-2xl p-4">
          <h2 className="font-semibold">Bài tập theo mức độ giỏi</h2>
        </div>
      </div>
    </div>
  );
}