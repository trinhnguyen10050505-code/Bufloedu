const reportHighlights = [
  {
    title: "Điểm sáng",
    content: "Lớp 8A1 có tiến độ học tập ổn định và tỉ lệ hoàn thành cao nhất tuần này.",
  },
  {
    title: "Nội dung cần chú ý",
    content: "Bài Nồng độ dung dịch và Mol vẫn là hai nội dung có nhiều học sinh cần củng cố thêm.",
  },
  {
    title: "Đề xuất hành động",
    content: "Nên giao thêm bài luyện tập ngắn cho 8A2 và tăng kiểm tra nhanh cho 8A3.",
  },
];

export default function TeacherReportsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Báo cáo
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Phân tích tiến độ học tập</h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Tổng hợp dữ liệu học tập để giáo viên có thể đánh giá đúng tình hình,
          phát hiện sớm vấn đề và điều chỉnh chiến lược hỗ trợ học sinh.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {reportHighlights.map((item) => (
          <div key={item.title} className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">{item.title}</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Nhận định tổng quan</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">
          Tình hình học tập toàn khối đang ở mức tích cực
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Dữ liệu hiện tại cho thấy phần lớn học sinh đã hình thành được nhịp học ổn định.
          Tuy nhiên, vẫn cần theo dõi sát các bài có tính toán và vận dụng để đảm bảo học sinh
          không chỉ học thuộc mà còn hiểu bản chất và áp dụng được vào bài tập.
        </p>
      </div>
    </div>
  );
}