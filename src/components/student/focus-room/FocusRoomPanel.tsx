type FocusPreset = {
  label: string;
  minutes: number;
};

type FocusRoomPanelProps = {
  presets: FocusPreset[];
  selectedMinutes: number;
  remainingTime: string;
  isRunning: boolean;
  completedSessions: number;
  isSaving?: boolean;
  onSelectPreset: (minutes: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export default function FocusRoomPanel({
  presets,
  selectedMinutes,
  remainingTime,
  isRunning,
  completedSessions,
  isSaving = false,
  onSelectPreset,
  onStart,
  onPause,
  onReset,
}: FocusRoomPanelProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Bộ đếm giờ tập trung</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">
          Chọn phiên học và bắt đầu
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          {presets.map((preset) => (
            <button
              key={preset.minutes}
              type="button"
              onClick={() => onSelectPreset(preset.minutes)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                selectedMinutes === preset.minutes
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {preset.label} · {preset.minutes} phút
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">Thời gian còn lại</p>
          <p className="mt-3 text-6xl font-bold tracking-wide text-slate-800">
            {remainingTime}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onStart}
              disabled={isRunning}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              Bắt đầu
            </button>

            <button
              type="button"
              onClick={onPause}
              disabled={!isRunning}
              className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              Tạm dừng
            </button>

            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Trạng thái học tập</p>

          <div className="mt-4 grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Phiên đang chọn</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {selectedMinutes} phút
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Phiên đã hoàn thành</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {completedSessions}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Trạng thái</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {isRunning ? "Đang tập trung" : "Sẵn sàng bắt đầu"}
              </p>
            </div>
          </div>

          {isSaving ? (
            <p className="mt-4 text-sm text-blue-600">
              Bu đang lưu thời gian học của em...
            </p>
          ) : null}
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Bu gợi ý</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>• Đặt điện thoại ra xa để tránh xao nhãng.</li>
            <li>• Chọn một mục tiêu nhỏ cho mỗi phiên học.</li>
            <li>• Sau mỗi phiên, nghỉ ngắn 3 đến 5 phút.</li>
            <li>• Khi học xong, làm thêm kiểm tra nhanh để ghi nhớ tốt hơn.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}