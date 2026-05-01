"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type BuChatWidgetProps = {
  lessonTitle?: string;
  currentLevelLabel?: string;
  weakTopics?: string[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function BuChatWidget({
  lessonTitle,
  currentLevelLabel,
  weakTopics,
}: BuChatWidgetProps) {
  const finalLessonTitle = lessonTitle || "Hành trình học tập cùng Bu";
  const finalLevelLabel = currentLevelLabel || "Bu luôn đồng hành";
  const finalWeakTopics = weakTopics || [];

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Xin chào em, Bu ở đây rồi. Em muốn Bu giải thích bài, gợi ý cách học hay ôn lại phần nào?",
    },
  ]);

  const placeholder = useMemo(() => {
    if (finalWeakTopics.length > 0) {
      return `Ví dụ: Bu ơi, giúp em ôn lại phần ${finalWeakTopics[0]}`;
    }
    return "Hỏi Bu điều em đang cần...";
  }, [finalWeakTopics]);

  async function handleSend() {
    const content = input.trim();
    if (!content || loading) return;

    const nextUserMessage: ChatMessage = {
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, nextUserMessage]);
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
          lessonTitle: finalLessonTitle,
          currentLevelLabel: finalLevelLabel,
          weakTopics: finalWeakTopics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Bu chưa thể trả lời lúc này.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Bu chưa có câu trả lời rõ ràng, em hỏi lại Bu nhé.",
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[340px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/40 bg-white">
                <Image
                  src="/bu-mascot.png"
                  alt="Bu"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Bu đồng hành</p>
                <p className="text-xs text-blue-100">{finalLevelLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium hover:bg-white/20"
            >
              Đóng
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-white text-slate-700 shadow-sm"
                    : "ml-auto bg-blue-600 text-white"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                Bu đang suy nghĩ cho em...
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs text-slate-600">
              Bài hiện tại: <span className="font-semibold text-slate-800">{finalLessonTitle}</span>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                rows={2}
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-full bg-blue-600 px-4 py-3 text-white shadow-xl transition hover:bg-blue-700"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
            <Image
              src="/bu-mascot.png"
              alt="Bu"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Hỏi Bu</p>
            <p className="text-xs text-blue-100">Bu luôn ở đây với em</p>
          </div>
        </button>
      )}
    </div>
  );
}