"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function BuChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Chào em, Bu ở đây để giúp em học dễ hiểu hơn. Em đang vướng phần nào?",
    },
  ]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/bu-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: 
          data.reply || 
          data.error ||
          "Bu chưa hiểu câu hỏi của em. Em thử hỏi lại nhé.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bu đang lỗi kết nối. Em thử lại sau nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <section className="fixed bottom-5 right-5 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-4 text-white">
            <div>
              <p className="font-black">Bu trợ lý học tập</p>
              <p className="text-xs text-blue-100">Hỏi bài, ôn lý thuyết, gợi ý cách học</p>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="w-fit rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                Bu đang nghĩ...
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Nhập câu hỏi cho Bu..."
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}