"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function BuChatWidget({
  lessonTitle = "Hành trình học tập cùng Bu",
  currentLevelLabel = "Bu đồng hành",
  weakTopics = [],
}: {
  lessonTitle?: string;
  currentLevelLabel?: string;
  weakTopics?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
          "Chào em, Bu đồng hành cùng em. Em cần Bu hỗ trợ phần nào?",

    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open, apiError]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    setApiError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const response = await fetch("/api/bu-chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          message: text,
          lessonTitle,
          currentLevelLabel,
          weakTopics,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setApiError(data.error || "Lỗi máy chủ. Em thử lại sau nhé.");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "Bu chưa phản hồi được. Em thử lại nhé.",
          },
        ]);
      }
    } catch {
      setApiError("Bu đang lỗi kết nối tạm thời. Em thử lại sau một chút nhé.");
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[86px] right-4 z-[80] flex items-center gap-2 rounded-full border border-blue-100 bg-white/95 px-3 py-2 shadow-xl backdrop-blur transition hover:-translate-y-0.5 lg:bottom-6 lg:right-6"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <Image
            src="/bu-macost.png"
            alt="Bu"
            width={38}
            height={38}
            className="object-contain"
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </span>

        <span className="hidden text-left sm:block">
          <span className="block text-sm font-black text-blue-700">
            Hỏi Bu
          </span>
          <span className="block text-xs text-slate-500">
            Trợ lý học tập
          </span>
        </span>

        <MessageCircle size={18} className="text-blue-600" />
      </button>
    );
  }

  return (
    <section className="fixed bottom-[82px] right-3 z-[90] flex h-[520px] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.22)] lg:bottom-6 lg:right-6">
      <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Image
              src="/bu-macost.png"
              alt="Bu"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-black">Bu Đồng hành</p>
            <p className="text-xs text-blue-100">
              Hỏi bài, ôn lý thuyết, gợi ý cách học
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="rounded-full p-2 hover:bg-white/15"
          aria-label="Đóng chat"
        >
          <X size={18} />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" ? (
              <Image
                src="/bu-macost.png"
                alt="Bu"
                width={28}
                height={28}
                className="mr-2 mt-1 h-7 w-7 shrink-0 object-contain"
              />
            ) : null}

            <div
              className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                message.role === "user"
                  ? "rounded-br-md bg-blue-600 text-white"
                  : "rounded-bl-md bg-white text-slate-700"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {sending ? (
          <div className="flex justify-start">
            <Image
              src="/bu-macost.png"
              alt="Bu"
              width={38}
              height={38}
              className="mr-2 mt-1 h-7 w-7 object-contain"
            />
            <div className="rounded-3xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              Bu đang suy nghĩ...
            </div>
          </div>
        ) : null}
        
        {apiError ? (
          <div className="flex justify-center">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
              <span className="font-semibold">Đã xảy ra lỗi:</span> {apiError}
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Nhập câu hỏi cho Bu..."
            rows={1}
            className="max-h-24 min-h-11 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />

          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:bg-slate-300"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
          Bu gợi ý từng bước, không làm thay em hoàn toàn.
        </p>
      </div>
    </section>
  );
}