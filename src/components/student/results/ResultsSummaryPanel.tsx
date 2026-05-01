type ResultsSummaryPanelProps = {
  levelLabel: string;
  levelDescription: string;
  completedLessonsCount: number;
  totalFocusMinutes: number;
  weakTopics: string[];
  suggestedLessons: string[];
};

export default function ResultsSummaryPanel({
  levelLabel,
  levelDescription,
  completedLessonsCount,
  totalFocusMinutes,
  weakTopics,
  suggestedLessons,
}: ResultsSummaryPanelProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Tổng quan kết quả</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Mức hiện tại</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">{levelLabel}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Bài hoàn thành</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {completedLessonsCount}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Focus time</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {totalFocusMinutes} phút
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-5">
          <p className="font-semibold text-slate-800">Bu nhận xét</p>
          <p className="mt-2 text-slate-600">{levelDescription}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Bài nên ưu tiên</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {suggestedLessons.length > 0 ? (
              suggestedLessons.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Bu chưa có gợi ý cụ thể, em hãy làm bài test chẩn đoán trước nhé.</li>
            )}
          </ul>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Phần cần chú ý</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {weakTopics.length > 0 ? (
              weakTopics.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Chưa có phần yếu nổi bật. Hãy tiếp tục giữ nhịp học tốt nhé.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}