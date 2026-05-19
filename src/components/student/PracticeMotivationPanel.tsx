import Image from "next/image";
import Link from "next/link";
import { StudentLevel } from "@/types/practice-final";

function getLevelName(level: StudentLevel) {
  if (level === "gioi") return "Bu Thông thái";
  if (level === "kha") return "Bu Vững vàng";
  return "Bu Chăm chỉ";
}

export default function PracticeMotivationPanel({
  score,
  totalQuestions,
  accuracy,
  level,
  weakLessonId,
  onGenerateAgain,
}: {
  score: number;
  totalQuestions: number;
  accuracy: number;
  level: StudentLevel;
  weakLessonId?: string;
  onGenerateAgain: () => void;
}) {
  const exp = score * 5 + (accuracy >= 80 ? 20 : accuracy >= 60 ? 10 : 5);
  const streakText =
    accuracy >= 80
      ? "Tuyệt vời! Em đang giữ nhịp học rất tốt."
      : accuracy >= 60
      ? "Em đã có nền tảng rồi, luyện thêm một lượt sẽ chắc hơn."
      : "Không sao cả, Bu sẽ dẫn em ôn lại từng bước.";

  const badge =
    accuracy >= 80
      ? "Huy hiệu Bứt phá"
      : accuracy >= 60
      ? "Huy hiệu Kiên trì"
      : "Huy hiệu Không bỏ cuộc";

  return (
    <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-white shadow-sm">
          <Image
            src="/bu-macost.png"
            alt="Bu"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            Động lực học tập
          </p>

          <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">
            Bu ghi nhận nỗ lực của em sau lượt luyện tập này
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">{streakText}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">EXP nhận được</p>
              <p className="mt-1 text-2xl font-black text-blue-700">+{exp}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Huy hiệu</p>
              <p className="mt-1 text-base font-black text-amber-600">{badge}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Mức Bu</p>
              <p className="mt-1 text-base font-black text-emerald-600">
                {getLevelName(level)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-white/80 p-4">
            <p className="font-black text-slate-900">Bu gợi ý bước tiếp theo</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Em đúng {score}/{totalQuestions} câu, đạt {accuracy}%.{" "}
              {accuracy >= 80
                ? "Em có thể chuyển sang bài tiếp theo hoặc làm quick-test nếu chưa làm."
                : accuracy >= 60
                ? "Em nên luyện thêm một bộ câu mới để chắc kiến thức hơn."
                : "Em nên xem mindmap và lý thuyết của bài đang vấp trước khi luyện lại."}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">

           
              <Link
                href="/student/lessons"
                className="btn-pro bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
              >
                Học bài tiếp theo
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
}