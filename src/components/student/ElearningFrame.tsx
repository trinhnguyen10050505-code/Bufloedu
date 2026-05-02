type ElearningFrameProps = {
  title: string;
  mode: "local_html" | "external_url" | "placeholder";
  entry?: string;
  externalUrl?: string;
  note?: string;
};

export default function ElearningFrame({
  title,
  mode,
  entry,
  externalUrl,
  note,
}: ElearningFrameProps) {
  const src = mode === "local_html" ? entry : externalUrl;

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-blue-600">Khu E-learning</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-800">{title}</h2>

      {src ? (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
          <iframe
            src={src}
            title={title}
            className="h-[720px] w-full bg-white"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-semibold text-slate-800">
            Chưa có gói E-learning cho bài này
          </p>
          <p className="mt-2 text-slate-600">{note || "Hãy gắn package hoặc link E-learning."}</p>
        </div>
      )}
    </section>
  );
}