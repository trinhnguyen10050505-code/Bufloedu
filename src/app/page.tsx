import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import FeatureCard from "@/components/FeatureCard";
import FadeInUp from "@/components/FadeInUp";
import {
  Brain,
  BookOpen,
  Upload,
  GraduationCap,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-white via-blue-50/40 to-cyan-50/30 min-h-screen">
      <Navbar />
      <HeroSection />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <FadeInUp>
          <SectionTitle
            badge="Điểm nổi bật"
            title="Một nền tảng học tập không chỉ đẹp mà còn thật sự thông minh"
            desc="Buflo AI được thiết kế theo logic học tập hiện đại: chẩn đoán năng lực, gợi ý lộ trình, hỗ trợ giáo viên và biến dữ liệu thành trải nghiệm học tập trực quan."
          />
        </FadeInUp>

        <div className="grid md:grid-cols-3 gap-6">
          <FadeInUp delay={0.05}>
            <FeatureCard
              icon={<Brain size={22} />}
              title="Chẩn đoán năng lực"
              desc="Học sinh làm bài test đầu vào để hệ thống hiểu đúng năng lực, từ đó gợi ý nội dung học phù hợp."
            />
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <FeatureCard
              icon={<BookOpen size={22} />}
              title="Học theo lộ trình"
              desc="Bài học, bài tập, Focus Room và mindmap được sắp xếp thành một hành trình học tập logic."
            />
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <FeatureCard
              icon={<Upload size={22} />}
              title="Khung nhận dữ liệu"
              desc="Tải lên video, Word, PDF để chuyển hóa thành nội dung học thông minh dành cho học sinh và giáo viên."
            />
          </FadeInUp>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <FadeInUp>
          <SectionTitle
            badge="Hai nhóm người dùng"
            title="Thiết kế tối ưu cho cả học sinh lẫn giáo viên"
            desc="Buflo AI không chỉ là website học tập cho học sinh, mà còn là công cụ tổ chức, quản lý và đo hiệu quả dành cho giáo viên."
          />
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeInUp delay={0.05}>
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_10px_50px_rgba(37,99,235,0.12)] border border-blue-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-5">
                <GraduationCap size={26} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Dành cho học sinh
              </h3>
              <ul className="space-y-3 text-slate-600 leading-7">
                <li>• Làm test chẩn đoán năng lực</li>
                <li>• Học theo bài và theo mức độ</li>
                <li>• Học tập trung với Focus Room</li>
                <li>• Xem mindmap để ghi nhớ nhanh</li>
                <li>• Làm bài tập và theo dõi tiến bộ</li>
              </ul>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_10px_50px_rgba(6,182,212,0.12)] border border-cyan-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center mb-5">
                <BarChart3 size={26} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Dành cho giáo viên
              </h3>
              <ul className="space-y-3 text-slate-600 leading-7">
                <li>• Quản lý lớp và danh sách học sinh</li>
                <li>• Giao bài tập và tải học liệu riêng</li>
                <li>• Theo dõi kết quả theo từng giai đoạn</li>
                <li>• Phân tích mức độ tiến bộ của học sinh</li>
                <li>• Tổ chức dạy học linh hoạt hơn</li>
              </ul>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <FadeInUp>
          <div className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-10 md:p-14 shadow-[0_20px_80px_rgba(37,99,235,0.28)]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles />
                <span className="font-semibold">Tầm nhìn Buflo AI</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Không chỉ là web học tập, mà là một hệ sinh thái học tập cá nhân hóa.
              </h2>
              <p className="text-blue-50 text-lg leading-8">
                Buflo AI hướng đến việc biến mọi tài liệu thành tri thức có cấu
                trúc, giúp học sinh học đúng hơn, giáo viên dạy hiệu quả hơn và
                toàn bộ quá trình học được đo lường rõ ràng bằng dữ liệu.
              </p>
            </div>
          </div>
        </FadeInUp>
      </section>

      <Footer />
    </main>
  );
}