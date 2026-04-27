"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type ChatRole = "bu" | "student";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

type BuChatWidgetProps = {
  lessonTitle?: string;
  currentLevelLabel?: string;
  weakTopics?: string[];
};

const quickReplies = [
  "Bu ơi, em chưa hiểu bài này",
  "Bu gợi ý em nên học gì tiếp theo",
  "Bu giải thích lại giúp em nhé",
  "Bu hướng dẫn em làm bài này từng bước nhé",
];

export default function BuChatWidget({
  lessonTitle,
  currentLevelLabel,
  weakTopics = [],
}: BuChatWidgetProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bu",
      text: "Xin chào, Bu ở đây để đồng hành cùng em. Em cần Bu hỗ trợ phần nào nào?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, open]);

  const historyForApi = useMemo(() => {
    return messages.slice(-6);
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      role: "student",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/bu-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: historyForApi,
          lessonTitle: lessonTitle ?? "",
          currentRoute: pathname ?? "",
          currentLevelLabel: currentLevelLabel ?? "",
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
          role: "bu",
          text:
            data?.reply ||
            "Bu chưa trả lời được lúc này, em thử lại nhé.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bu",
          text: "Bu đang gặp chút trục trặc, em thử lại sau nhé.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          aria-label="Mở chat với Bu"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-amber-50">
            <Image
              src="/logos/bu-chat.png"
              alt="Bu chat mascot"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Bu đây!</p>
            <p className="text-xs text-slate-500">Chạm để Bu hỗ trợ em</p>
          </div>
        </button>
      ) : (
        <div className="w-[360px] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/15">
                  <Image
                    src="/logos/bu-chat.png"
                    alt="Bu chat mascot"
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-bold">Bu đồng hành</p>
                  <p className="text-xs text-blue-100">
                    {lessonTitle
                      ? `Bu đang đồng hành với em ở bài: ${lessonTitle}`
                      : "Bu luôn ở đây để hỗ trợ em"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/10 px-3 py-1 text-sm transition hover:bg-white/20"
                aria-label="Đóng chat với Bu"
              >
                Đóng
              </button>
            </div>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "bu"
                    ? "bg-white text-slate-700 shadow-sm"
                    : "ml-auto bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                Bu đang suy nghĩ cho em...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSend(item)}
                  disabled={isLoading}
                  className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                >
                  {item}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhắn Bu điều em đang thắc mắc..."
                disabled={isLoading}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 disabled:bg-slate-100"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}