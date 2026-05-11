"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type BuChatWidgetProps = {
  lessonTitle?: string;
  currentLevelLabel?: string;
  weakTopics?: string[];
};

export default function BuChatWidget({
  lessonTitle = "Hành trình học tập cùng Bu",
  currentLevelLabel = "Bu đồng hành",
  weakTopics = [],
}: BuChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Bu ở đây nè. Em cần Bu giải thích bài, gợi ý học tiếp hay ôn phần đang yếu?",
    },
  ]);

  const placeholder = useMemo(() => {
    if (weakTopics.length > 0) {
      return `Bu ơi, giúp em ôn ${weakTopics[0]}`;
    }

    return "Hỏi Bu điều em đang cần...";
  }, [weakTopics]);

  async function sendMessage() {
    const content = input.trim();

    if (!content || loading) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/bu-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          lessonTitle,
          currentLevelLabel,
          weakTopics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Bu chưa trả lời được lúc này.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Bu chưa rõ ý này, em hỏi lại Bu nhé.",
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.message ||
            "Bu đang gặp chút sự cố. Em thử lại sau một lát nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 top-24 z-50 flex items-center gap-3 rounded-full border border-blue-100 bg-white/95 px-4 py-3 text-slate-800 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-blue-50">
          <Image src="/logos/bu-chat.png" alt="Bu" fill sizes="44px" className="object-cover" />
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-sm font-bold text-blue-700">Hỏi Bu</p>
          <p className="text-xs text-slate-500">Gợi ý học thông minh</p>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed right-5 top-24 z-50 w-[360px] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-4 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/40 bg-white">
            <Image src="/logos/bu-chat.png" alt="Bu" fill sizes="44px" className="object-cover" />
          </div>

          <div>
            <p className="text-sm font-bold">Bu học cùng em</p>
            <p className="text-xs text-blue-100">{currentLevelLabel}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMinimized((prev) => !prev)}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
          >
            {minimized ? "Mở" : "Gọn"}
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
          >
            Đóng
          </button>
        </div>
      </div>

      {!minimized ? (
        <>
          <div className="border-b border-slate-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-semibold text-blue-700">Ngữ cảnh Bu đang hiểu</p>
            <p className="mt-1 text-xs text-slate-600">
              {lessonTitle}
              {weakTopics.length > 0 ? ` · Cần ôn: ${weakTopics.join(", ")}` : ""}
            </p>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-white text-slate-700 shadow-sm"
                    : "ml-auto bg-blue-600 text-white"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="max-w-[86%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                Bu đang suy nghĩ...
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={placeholder}
              rows={2}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="mt-2 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Gửi cho Bu
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white p-4">
          <p className="text-sm text-slate-600">
            Bu đang thu gọn để không che giao diện. Bấm “Mở” khi em cần hỏi nhé.
          </p>
        </div>
      )}
    </div>
  );
}