"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Minus, Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function BuChatWidget({
  lessonTitle = "",
  currentLevelLabel = "",
}: {
  lessonTitle?: string;
  currentLevelLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Chào em, Bu ở đây để giúp em học dễ hiểu hơn. Em đang vướng phần nào?",
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const response = await fetch("/api/bu-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          lessonTitle,
          currentLevelLabel,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "Bu chưa phản hồi được. Em thử lại nhé.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Bu đang bị lỗi kết nối. Em thử lại sau một chút nhé.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        className="fixed right-5 top-24 z-50 flex items-center gap-3 rounded-full border border-blue-100 bg-white/95 px-4 py-3 shadow-[0_12px_40px_rgba(37,99,235,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
          <Image
            src="/bu-macost.png"
            alt="Bu"
            width={42}
            height={42}
            className="object-contain"
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </span>

        <span className="hidden text-left sm:block">
          <span className="block text-sm font-black text-blue-700">
            Bu đồng hành
          </span>
          <span className="block text-xs font-medium text-slate-500">
            Gợi ý học thông minh
          </span>
        </span>

        <MessageCircle size={20} className="text-blue-600" />
      </button>
    );
  }

  return (
    <section
      className={`fixed right-5 top-24 z-50 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)] transition-all ${
        minimized
          ? "w-[300px]"
          : "h-[520px] w-[390px] max-w-[calc(100vw-24px)]"
      }`}
    >
      <header className="flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-sm">
            <Image
              src="/bu-macost.png"
              alt="Bu"
              width={46}
              height={46}
              className="object-contain"
            />
            <span className="absolute -right-1 -top-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-black text-white">
              AI
            </span>
          </div>

          <div>
            <p className="text-sm font-black leading-tight">Bu trợ lý học tập</p>
            <p className="text-xs font-medium text-blue-100">
              Hỏi bài, ôn lý thuyết, gợi ý cách học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized((prev) => !prev)}
            className="rounded-full p-2 text-white/90 transition hover:bg-white/15"
            aria-label="Thu nhỏ"
          >
            <Minus size={18} />
          </button>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-white/90 transition hover:bg-white/15"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {!minimized ? (
        <>
          <div className="h-[382px] space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Image
                      src="/bu-macost.png"
                      alt="Bu"
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
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
                <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image
                    src="/bu-macost.png"
                    alt="Bu"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-3xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <Sparkles size={16} className="text-blue-500" />
                  Bu đang suy nghĩ...
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
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
                className="max-h-24 min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white"
              />

              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Gửi"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
              Bu gợi ý từng bước, không làm thay em hoàn toàn.
            </p>
          </div>
        </>
      ) : (
        <button
          onClick={() => setMinimized(false)}
          className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50"
        >
          <Image
            src="/bu-macost.png"
            alt="Bu"
            width={34}
            height={34}
            className="object-contain"
          />
          <div>
            <p className="text-sm font-black text-slate-800">
              Bu đang chờ câu hỏi
            </p>
            <p className="text-xs text-slate-500">Bấm để mở lại chat</p>
          </div>
        </button>
      )}
    </section>
  );
}