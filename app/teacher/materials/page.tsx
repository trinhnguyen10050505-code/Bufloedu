const materials = [
  {
    title: "Bài giảng E-learning - Phản ứng hóa học",
    type: "Video HTML5 package",
    status: "Đã sẵn sàng",
  },
  {
    title: "Phiếu học tập - Mol và tỉ khối chất khí",
    type: "PDF",
    status: "Đang sử dụng",
  },
  {
    title: "Slide ôn tập - Nồng độ dung dịch",
    type: "Slide",
    status: "Đã cập nhật",
  },
];

export default function TeacherMaterialsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
          Học liệu
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Kho học liệu và bài giảng</h1>
        <p className="mt-3 max-w-3xl text-blue-50">
          Quản lý tập trung các video E-learning, slide, phiếu học tập và tài liệu
          để giáo viên dễ tổ chức nội dung giảng dạy.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {materials.map((item) => (
          <div key={item.title} className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">{item.type}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-800">{item.title}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Trạng thái: <span className="font-semibold text-slate-800">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}