"use client";

import { useMemo, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const src = useMemo(() => {
    if (mode === "local_html") return entry;
    if (mode === "external_url") return externalUrl;
    return "";
  }, [mode, entry, externalUrl]);

  if (!src) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Khu E-learning</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">{title}</h2>

        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-semibold text-slate-800">
            Chưa có gói E-learning cho bài này
          </p>
          <p className="mt-2 text-slate-600">
            {note || "Hãy gắn package hoặc link E-learning."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Khu E-learning</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">{title}</h2>
        </div>

        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Mở trực tiếp toàn màn hình
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
        {loading ? (
          <div className="flex h-[720px] items-center justify-center text-slate-500">
            Bu đang mở E-learning cho em...
          </div>
        ) : null}

        <iframe
          key={src}
          src={src}
          title={title}
          className={`h-[720px] w-full bg-white ${loading ? "hidden" : "block"}`}
          onLoad={() => setLoading(false)}
          allowFullScreen
        />
      </div>

      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-600">
        Nếu khung E-learning không chạy trong trang này, em bấm{" "}
        <span className="font-semibold text-slate-800">“Mở trực tiếp toàn màn hình”</span>{" "}
        để học bình thường. Một số package E-learning không tương thích hoàn toàn với iframe.
      </div>
    </section>
  );
}