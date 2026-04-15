export default function ResultsPage() {
  const recentResults = [
    { name: "Bài test chẩn đoán", score: "6/8", status: "Khá" },
    { name: "Luyện tập bài Phản ứng hóa học", score: "7/8", status: "Tiến bộ" },
    { name: "Kiểm tra nhanh bài Mol", score: "4/5", status: "Ổn định" },
  ];

  const weaknesses = [
    "Phân biệt hiện tượng vật lí và hóa học",
    "Tính nhanh số mol trong bài tập cơ bản",
  ];

  const strengths = [
    "Nắm khá tốt kiến thức nền",
    "Làm tốt câu hỏi nhận biết và thông hiểu",
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Kết quả học tập</h1>
          <p className="mt-2 text-slate-600">
            Theo dõi kết quả gần đây để biết em đang tiến bộ ở đâu và cần ôn thêm phần nào.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Điểm trung bình gần đây</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">78%</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Mức hiện tại</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">Khá</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Số bài đã hoàn thành</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">3</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Kết quả gần đây</h2>
          <div className="mt-4 space-y-3">
            {recentResults.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">Điểm: {item.score}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Điểm mạnh</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Cần củng cố thêm</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {weaknesses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}