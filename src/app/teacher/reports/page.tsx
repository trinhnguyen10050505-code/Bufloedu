export default function TeacherReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Báo cáo hiệu quả học tập</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Điểm trung bình lớp</p>
          <h2 className="text-2xl font-bold">7.9</h2>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Tỷ lệ nộp bài</p>
          <h2 className="text-2xl font-bold">84%</h2>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Tiến bộ sau học</p>
          <h2 className="text-2xl font-bold">+1.3 điểm</h2>
        </div>
      </div>
    </div>
  );
}