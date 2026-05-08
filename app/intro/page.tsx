import Image from "next/image";
import Link from "next/link";
import BuLogo from "@/components/common/BuLogo";
import Footer from "@/components/common/Footer";

const features = [
  {
    icon: "🧪",
    title: "Test chẩn đoán",
    desc: "Bu xác định mức học hiện tại để đề xuất lộ trình phù hợp.",
  },
  {
    icon: "🎥",
    title: "E-learning",
    desc: "Học theo từng bài bằng khung bài giảng tương tác.",
  },
  {
    icon: "✍️",
    title: "Luyện tập thông minh",
    desc: "Trộn câu hỏi theo bài, theo mức và theo phần còn yếu.",
  },
  {
    icon: "📊",
    title: "Theo dõi tiến bộ",
    desc: "Lưu lịch sử học tập, quick-test, focus và hoạt động gần đây.",
  },
];

const team = [
  {
    name: "Nhóm phát triển nội dung",
    role: "Xây dựng lý thuyết, bài tập và định hướng học tập.",
  },
  {
    name: "Nhóm thiết kế trải nghiệm",
    role: "Thiết kế giao diện thân thiện, dễ dùng với học sinh.",
  },
  {
    name: "Bu AI Companion",
    role: "Đồng hành, gợi ý học tập và giúp học sinh không bị lạc hướng.",
  },
];

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <BuLogo href="/" />

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Đăng nhập
            </Link>

            <Link
              href="/register"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-[42px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Website học tập cùng Bu
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
              Học Khoa học tự nhiên theo cách thông minh và gần gũi hơn
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-blue-50">
              Bu giúp học sinh học đúng năng lực, luyện đúng phần còn thiếu, nhận
              bài giáo viên giao và theo dõi tiến bộ qua dữ liệu thật.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50"
              >
                Bắt đầu cùng Bu
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
              >
                Tôi đã có tài khoản
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[42px] bg-white p-8 shadow-sm">
            <div className="absolute inset-x-8 bottom-8 rounded-[36px] bg-emerald-100 p-6">
              <p className="text-sm font-semibold text-emerald-700">
                Khu vườn học tập
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mỗi phút học, mỗi lượt luyện và mỗi quick-test sẽ giúp khu vườn của
                Bu xanh hơn.
              </p>
              <div className="mt-4 text-4xl">🌱 🌿 🥕 🌳</div>
            </div>

            <div className="relative mx-auto h-72 w-72">
              <Image
                src="/bu-mascot.png"
                alt="Bu"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[30px] bg-white p-6 shadow-sm"
            >
              <p className="text-4xl">{feature.icon}</p>
              <h2 className="mt-4 text-xl font-bold text-slate-800">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.desc}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[38px] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Hành trình học tập</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Một vòng học rõ ràng, không chồng chéo
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              "Test đầu vào",
              "Học E-learning",
              "Mindmap",
              "Luyện tập",
              "Quick-test và kết quả",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-bold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[38px] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Đội ngũ dự án</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Được xây dựng cho việc dạy và học thật
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {team.map((item) => (
              <article
                key={item.name}
                className="rounded-[28px] bg-slate-50 p-6"
              >
                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.role}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}