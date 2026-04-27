import Link from "next/link";

const mindmapData = [
  {
    title: "Bài 2. Phản ứng hóa học",
    nodes: [
      {
        label: "Biến đổi vật lí",
        children: ["Không tạo chất mới", "Ví dụ: nước bay hơi"],
      },
      {
        label: "Biến đổi hóa học",
        children: ["Có tạo chất mới", "Ví dụ: nến cháy"],
      },
      {
        label: "Dấu hiệu nhận biết",
        children: ["Đổi màu", "Khí", "Kết tủa", "Tỏa nhiệt"],
      },
      {
        label: "Năng lượng phản ứng",
        children: ["Tỏa nhiệt", "Thu nhiệt"],
      },
    ],
  },
];

export default function MindmapPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
            Mindmap thông minh
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Hệ thống hóa kiến thức cùng Bu
          </h1>
          <p className="mt-3 max-w-2xl text-blue-50">
            Bu giúp em nhìn bài học theo sơ đồ trực quan để nhớ lâu hơn, học logic hơn
            và dễ ôn lại hơn trước khi làm bài tập.
          </p>
        </section>

        {mindmapData.map((lesson) => (
          <section key={lesson.title} className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Mindmap bài học</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">{lesson.title}</h2>
              </div>

              <Link
                href="/student/exercises"
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sang luyện tập
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {lesson.nodes.map((node) => (
                <div
                  key={node.label}
                  className="rounded-3xl border border-blue-100 bg-blue-50 p-5"
                >
                  <h3 className="text-lg font-bold text-blue-700">{node.label}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                    {node.children.map((child) => (
                      <li key={child} className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                        {child}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}