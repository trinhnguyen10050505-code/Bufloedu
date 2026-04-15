import Link from "next/link";
import LevelBadge from "@/components/student/LevelBadge";
import ProgressCard from "@/components/student/ProgressCard";
import PracticeCard from "@/components/student/PracticeCard";
import QueueCard from "@/components/student/QueueCard";

export default function StudentDashboardPage() {
  const studentName = "Minh";
  const currentLevel: "trung_binh" | "kha" | "gioi" = "kha";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-sm">
          <p className="text-sm font-medium text-blue-100">Khu học tập cá nhân hóa</p>
          <h1 className="mt-2 text-4xl font-bold">Chào {studentName}, hôm nay em học gì?</h1>
          <p className="mt-3 max-w-2xl text-blue-50">
            Hệ thống sẽ giúp em học đúng mức độ, luyện đúng phần còn yếu và theo dõi sự tiến bộ rõ ràng.
          </p>

          <div className="mt-5">
            <LevelBadge level={currentLevel} />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/student/diagnostic-test"
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Làm bài test chẩn đoán
            </Link>
            <Link
              href="/student/exercises"
              className="rounded-2xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Bắt đầu luyện tập
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <ProgressCard
            title="Mức hiện tại"
            value="Khá"
            subtitle="Em đang học tốt phần kiến thức nền và bắt đầu làm được câu vận dụng."
          />
          <ProgressCard
            title="Tiến độ 6 bài"
            value="3/6"
            subtitle="Em đã hoàn thành 3 bài học và đang tiếp tục bài tiếp theo."
          />
          <ProgressCard
            title="Thời gian Focus"
            value="125 phút"
            subtitle="Giữ nhịp học đều sẽ giúp em nâng mức nhanh hơn."
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <QueueCard
            title="Gợi ý học hôm nay"
            items={[
              "Ôn lại bài Phản ứng hóa học",
              "Luyện tập mức Khá",
              "Làm kiểm tra nhanh 5 câu",
            ]}
          />

          <QueueCard
            title="Phần cần củng cố"
            items={[
              "Phân biệt biến đổi vật lí và hóa học",
              "Dấu hiệu nhận biết phản ứng hóa học",
              "Vận dụng khái niệm mol trong bài tập",
            ]}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <PracticeCard
            title="Đánh giá mức độ"
            description="Làm bài test để hệ thống xác định mức hiện tại và gợi ý lộ trình phù hợp."
            href="/student/diagnostic-test"
            cta="Làm test"
          />
          <PracticeCard
            title="Luyện tập"
            description="Luyện theo mức độ hoặc theo từng bài để tiến bộ đúng chỗ cần thiết."
            href="/student/exercises"
            cta="Vào luyện tập"
          />
          <PracticeCard
            title="Focus Room"
            description="Học tập trung theo phiên ngắn để duy trì nhịp học ổn định."
            href="/student/focus-room"
            cta="Bắt đầu focus"
          />
          <PracticeCard
            title="Kết quả học tập"
            description="Xem điểm, tiến độ và phần kiến thức cần ôn thêm."
            href="/student/results"
            cta="Xem kết quả"
          />
        </div>
      </div>
    </div>
  );
}