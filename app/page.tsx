import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">
          Website học tập Khoa học tự nhiên
        </h1>

        <p className="text-lg mb-8">
          Nền tảng hỗ trợ học sinh học theo năng lực, giáo viên quản lý lớp học
          và chuyển đổi tài liệu thành nội dung học tập thông minh.
        </p>

        <div className="flex gap-4 mb-10">
          <Link
            href="/login"
            className="px-5 py-3 bg-black text-white rounded-xl"
          >
            Đăng nhập
          </Link>

          <Link
            href="/register"
            className="px-5 py-3 border rounded-xl"
          >
            Đăng ký
          </Link>

          <Link
            href="/intro"
            className="px-5 py-3 border rounded-xl"
          >
            Giới thiệu web
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-2">Học sinh</h2>
            <p>
              Làm bài test đầu vào, học theo bài, Focus Room, mindmap và bài tập.
            </p>
          </div>

          <div className="border rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-2">Giáo viên</h2>
            <p>
              Quản lý lớp học, giao bài tập, tải tài liệu và theo dõi kết quả học sinh.
            </p>
          </div>

          <div className="border rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-2">Khung nhận dữ liệu</h2>
            <p>
              Tải Word, PDF, video để chuyển thành mindmap, bài tập và nội dung học.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}