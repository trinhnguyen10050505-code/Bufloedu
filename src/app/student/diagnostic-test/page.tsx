export default function DiagnosticTestPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Bài test chẩn đoán năng lực</h1>
      <p className="mb-6">
        Đây là nơi học sinh làm bài test đầu vào để xác định mức độ.
      </p>

      <div className="border rounded-2xl p-5">
        <p>Câu 1: Chất tinh khiết là gì?</p>
        <div className="mt-3 space-y-2">
          <label className="block">
            <input type="radio" name="q1" /> A. Hỗn hợp nhiều chất
          </label>
          <label className="block">
            <input type="radio" name="q1" /> B. Chỉ gồm một chất duy nhất
          </label>
          <label className="block">
            <input type="radio" name="q1" /> C. Có nhiều tạp chất
          </label>
        </div>

        <button className="mt-5 px-4 py-2 bg-black text-white rounded-xl">
          Nộp bài
        </button>
      </div>
    </div>
  );
}