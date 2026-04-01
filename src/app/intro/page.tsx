import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeInUp from "@/components/FadeInUp";
import SectionTitle from "@/components/SectionTitle";

export default function IntroPage() {
  return (
    <main className="bg-gradient-to-b from-white via-blue-50/40 to-cyan-50/30 min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeInUp>
          <SectionTitle
            badge="Giới thiệu Buflo AI"
            title="Một nền tảng học tập được thiết kế để hiểu người học"
            desc="Buflo AI là website học tập Khoa học tự nhiên được xây dựng theo tư duy giáo dục số hiện đại: cá nhân hóa, trực quan, đo được hiệu quả và mở rộng được lâu dài."
          />
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <FadeInUp delay={0.05}>
            <div className="rounded-[2rem] bg-white p-8 border border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.08)]">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Buflo AI làm ra cho ai?
              </h3>
              <p className="text-slate-600 leading-8">
                Dành cho học sinh cần học đúng năng lực, đúng trọng tâm và dành
                cho giáo viên cần một công cụ quản lý lớp, giao bài, tải học liệu
                và theo dõi hiệu quả học tập.
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="rounded-[2rem] bg-white p-8 border border-cyan-100 shadow-[0_10px_40px_rgba(6,182,212,0.08)]">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Dùng như thế nào?
              </h3>
              <p className="text-slate-600 leading-8">
                Học sinh làm test đầu vào, học theo lộ trình, dùng Focus Room,
                mindmap và bài tập. Giáo viên tạo lớp, tải tài liệu, giao bài
                và xem báo cáo tiến bộ.
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="rounded-[2rem] bg-white p-8 border border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.08)]">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Dữ liệu từ đâu?
              </h3>
              <p className="text-slate-600 leading-8">
                Dữ liệu đến từ học liệu hệ thống, tài liệu giáo viên tải lên và
                cả dữ liệu học sinh đưa vào dưới dạng video, Word, PDF để chuyển
                thành nội dung học tập.
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="rounded-[2rem] bg-white p-8 border border-cyan-100 shadow-[0_10px_40px_rgba(6,182,212,0.08)]">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Hiệu quả được đo ra sao?
              </h3>
              <p className="text-slate-600 leading-8">
                Hệ thống tổng hợp thời gian học, điểm số, mức độ hoàn thành, kết
                quả trước và sau học để chứng minh hiệu quả của cách học bằng dữ liệu.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      <Footer />
    </main>
  );
}