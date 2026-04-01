export default function StudentDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard học sinh</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Mức hiện tại</p>
          <h2 className="text-2xl font-bold">Khá</h2>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Bài đã học</p>
          <h2 className="text-2xl font-bold">2/6</h2>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Điểm gần nhất</p>
          <h2 className="text-2xl font-bold">8.0</h2>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Thời gian Focus</p>
          <h2 className="text-2xl font-bold">90 phút</h2>
        </div>
      </div>
    </div>
  );
}