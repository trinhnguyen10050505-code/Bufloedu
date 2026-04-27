type ELearningBlockProps = {
  title: string;
  entry: string;
  duration?: string;
  note?: string;
};

export default function ELearningBlock({
  title,
  entry,
  duration,
  note,
}: ELearningBlockProps) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-medium text-blue-600">Bài giảng E-learning</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">{title}</h2>
        {duration && (
          <p className="mt-2 text-sm text-slate-600">Thời lượng: {duration}</p>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        <div className="aspect-[16/10] w-full">
          <iframe
            src={entry}
            title={title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={entry}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Mở toàn màn hình bài giảng
        </a>
      </div>

      {note && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Bu gợi ý khi học</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
        </div>
      )}
    </section>
  );
}