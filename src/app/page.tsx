import Link from "next/link";
import BuLogo from "@/components/common/BuLogo";
import { GRADIENT_PRIMARY, CARD_BASE, BUTTON_PRIMARY } from "@/lib/theme";

const featureCards = [
  {
    title: "Học theo năng lực",
    description:
      "Học sinh làm bài test đầu vào để hệ thống xác định mức học phù hợp và gợi ý lộ trình tiếp theo.",
    href: "/student/diagnostic-test",
    icon: "🧪",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Luyện tập cá nhân hóa",
    description:
      "Luyện theo mức độ, theo từng bài hoặc kiểm tra nhanh để học đúng phần còn thiếu.",
    href: "/student/exercises",
    icon: "✍️",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Focus Room",
    description:
      "Học theo phiên ngắn, theo dõi thời gian và duy trì nhịp học tập trung ổn định.",
    href: "/student/focus-room",
    icon: "⏱️",
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Mindmap thông minh",
    description:
      "Hệ thống hóa kiến thức theo sơ đồ trực quan để học sinh nhớ lâu và ôn tập dễ hơn.",
    href: "/student/mindmap",
    icon: "🧠",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Khung nhận dữ liệu",
    description:
      "Nhận Word, PDF, video để chuyển hóa thành nội dung học tập như mindmap, bài tập và tóm tắt.",
    href: "/student/uploads",
    icon: "📁",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Báo cáo tiến bộ",
    description:
      "Theo dõi mức độ tiến bộ của học sinh bằng dữ liệu thực tế sau mỗi lần học và luyện tập.",
    href: "/student/results",
    icon: "📊",
    color: "bg-pink-100 text-pink-700",
  },
];

const flowSteps = [
  "Đăng nhập vào hệ thống",
  "Làm bài test chẩn đoán",
  "Được Bu gợi ý mức học phù hợp",
  "Học theo từng bài",
  "Luyện tập cá nhân hóa",
  "Học tập trung với Focus Room",
  "Mindmap và kiểm tra nhanh",
  "Xem kết quả tiến bộ",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <BuLogo />

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              Trang chủ
            </Link>
            <Link href="/student" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              Học sinh
            </Link>
            <Link href="/teacher/dashboard" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              Giáo viên
            </Link>
            <Link href="/student/mindmap" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              Mindmap
            </Link>
            <Link href="/student/results" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              Kết quả
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className={`${BUTTON_PRIMARY} rounded-2xl px-4 py-2 text-sm font-semibold`}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className={`${GRADIENT_PRIMARY} overflow-hidden rounded-[36px] p-8 text-white shadow-lg md:p-12`}>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-red-600 font-bold">TRANG CHỦ MỚI</p>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">
                Nền tảng học tập thông minh
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Học Khoa học tự nhiên theo đúng năng lực, tiến bộ theo từng bước
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50 sm:text-lg">
                Đây không chỉ là nơi xem bài học và làm bài tập, mà là một hệ thống
                học tập cá nhân hóa, nơi Bu sẽ đồng hành cùng học sinh từ bài test đầu vào,
                lộ trình học theo bài, luyện tập thông minh, Focus Room, mindmap đến báo cáo kết quả.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Đăng nhập ngay
                </Link>

                <Link
                  href="/student"
                  className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                >
                  Khám phá khu học sinh
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-md">
              <p className="text-sm font-medium text-blue-100">Bu giúp học sinh như thế nào?</p>

              <div className="mt-4 space-y-3">
                {[
                  "Bu đánh giá mức độ hiện tại của học sinh",
                  "Bu gợi ý bài học nên học trước",
                  "Bu theo dõi kết quả luyện tập và kiểm tra nhanh",
                  "Bu đồng hành trong Focus Room và mindmap",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/student/diagnostic-test"
            className={`${CARD_BASE} p-6 transition hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
              🧪
            </div>
            <h3 className="text-xl font-bold text-slate-800">Làm test chẩn đoán</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bắt đầu từ bài test để Bu hiểu rõ em đang ở đâu.
            </p>
          </Link>

          <Link
            href="/student/exercises"
            className={`${CARD_BASE} p-6 transition hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
              ✍️
            </div>
            <h3 className="text-xl font-bold text-slate-800">Luyện tập ngay</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Luyện theo mức hoặc theo bài để học đúng phần cần thiết.
            </p>
          </Link>

          <Link
            href="/student/focus-room"
            className={`${CARD_BASE} p-6 transition hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
              ⏱️
            </div>
            <h3 className="text-xl font-bold text-slate-800">Vào Focus Room</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Học tập trung theo phiên ngắn để giữ nhịp học ổn định.
            </p>
          </Link>

          <Link
            href="/teacher/dashboard"
            className={`${CARD_BASE} p-6 transition hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-700">
              👩‍🏫
            </div>
            <h3 className="text-xl font-bold text-slate-800">Vào khu giáo viên</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Quản lý lớp học, giao bài và theo dõi tiến độ học sinh.
            </p>
          </Link>
        </section>

        {/* FEATURES */}
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600">Chức năng nổi bật</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Một hệ sinh thái học tập thống nhất và logic
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`${CARD_BASE} p-6 transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${card.color}`}
                >
                  {card.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-800">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FLOW */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`${CARD_BASE} p-6 sm:p-8`}>
            <p className="text-sm font-medium text-blue-600">Hành trình học tập</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Học sinh sẽ đi theo lộ trình này
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {flowSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${CARD_BASE} p-6`}>
              <p className="text-sm font-medium text-blue-600">Đối tượng sử dụng</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">
                Web được xây cho cả học sinh và giáo viên
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• Học sinh học theo năng lực và theo dõi tiến bộ rõ ràng</li>
                <li>• Giáo viên quản lý lớp, giao bài và đọc dữ liệu học tập</li>
                <li>• Hệ thống dùng chung một nền dữ liệu để hỗ trợ cả hai phía</li>
              </ul>
            </div>

            <div className={`${CARD_BASE} p-6`}>
              <p className="text-sm font-medium text-emerald-600">Bắt đầu ngay</p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/login"
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Đăng nhập vào hệ thống
                </Link>
                <Link
                  href="/register"
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Tạo tài khoản mới
                </Link>
                <Link
                  href="/student"
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Khám phá khu học sinh
                </Link>
                <Link
                  href="/teacher/dashboard"
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Khám phá khu giáo viên
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}