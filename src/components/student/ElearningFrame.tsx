"use client";

import { useState } from "react";

type ElearningFrameProps = {
  title: string;
  src: string;
  fallbackSrc?: string;
};

export default function ElearningFrame({
  title,
  src,
  fallbackSrc,
}: ElearningFrameProps) {
  const [loading, setLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  function useFallback() {
    if (fallbackSrc) {
      setLoading(true);
      setCurrentSrc(fallbackSrc);
    }
  }

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Khu E-learning</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Khung này có thể chạy bài E-learning từ GitHub Pages hoặc từ thư mục local
            trong public.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={currentSrc}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Mở toàn màn hình
          </a>

          {fallbackSrc ? (
            <button
              type="button"
              onClick={useFallback}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Dùng bản local
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
        {loading ? (
          <div className="flex h-[720px] items-center justify-center text-slate-500">
            Bu đang mở bài E-learning...
          </div>
        ) : null}

        <iframe
          key={currentSrc}
          src={currentSrc}
          title={title}
          className={`h-[720px] w-full bg-white ${loading ? "hidden" : "block"}`}
          allowFullScreen
          onLoad={() => setLoading(false)}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-600">
        Nếu bài không chạy trong khung, hãy bấm “Mở toàn màn hình”. Khi dùng GitHub,
        link cần là link GitHub Pages dạng <b>github.io</b>, không phải link repo dạng
        <b> github.com/.../blob/...</b>.
      </div>
    </section>
  );
}