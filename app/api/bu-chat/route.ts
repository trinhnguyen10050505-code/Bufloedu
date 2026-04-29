import { NextRequest, NextResponse } from "next/server";
import { lessonsContent } from "@/data/lessons-content";

type IncomingMessage = {
  role: "bu" | "student";
  text: string;
};

function detectMode(message: string): "explain" | "solve" | "next_step" | "general" {
  const text = message.toLowerCase();

  if (
    text.includes("giải") ||
    text.includes("làm bài") ||
    text.includes("tính") ||
    text.includes("đáp án") ||
    text.includes("bài tập")
  ) {
    return "solve";
  }

  if (
    text.includes("học gì tiếp") ||
    text.includes("nên học gì") ||
    text.includes("tiếp theo") ||
    text.includes("gợi ý")
  ) {
    return "next_step";
  }

  if (
    text.includes("giải thích") ||
    text.includes("lý thuyết") ||
    text.includes("khái niệm") ||
    text.includes("em chưa hiểu")
  ) {
    return "explain";
  }

  return "general";
}

/**
 * 🔥 Lấy nội dung bài học từ lessonsContent
 */
function getLessonContext(lessonTitle?: string) {
  if (!lessonTitle) return "";

  const lesson = Object.values(lessonsContent).find(
    (l: any) => l.title === lessonTitle
  );

  if (!lesson) return "";

  let context = `Nội dung bài học "${lesson.title}":\n`;

  lesson.theory.forEach((block: any) => {
    context += `\n${block.title}:\n`;

    block.sections.forEach((section: any) => {
      context += `- ${section.subtitle}: ${section.content}\n`;

      if (section.examples) {
        context += `  Ví dụ: ${section.examples.join(", ")}\n`;
      }
    });
  });

  return context;
}

function buildSystemPrompt(params: {
  lessonTitle?: string;
  currentRoute?: string;
  weakTopics?: string[];
  currentLevelLabel?: string;
  mode: "explain" | "solve" | "next_step" | "general";
}) {
  const { lessonTitle, currentRoute, weakTopics, currentLevelLabel, mode } = params;

  const routeHint = currentRoute
    ? `Em hiện đang ở trang: ${currentRoute}.`
    : "";

  const lessonHint = lessonTitle
    ? `Bài học hiện tại của em là: ${lessonTitle}.`
    : "";

  const levelHint = currentLevelLabel
    ? `Mức học hiện tại của em là: ${currentLevelLabel}.`
    : "";

  const weakHint =
    weakTopics && weakTopics.length > 0
      ? `Các phần em cần củng cố: ${weakTopics.join(", ")}.`
      : "";

  const lessonContext = getLessonContext(lessonTitle);

  const modeInstruction =
    mode === "solve"
      ? "Nếu em hỏi bài tập, hãy hướng dẫn từng bước ngắn gọn, rõ ràng."
      : mode === "explain"
      ? "Nếu em hỏi lý thuyết, hãy giải thích thật dễ hiểu, gần gũi."
      : mode === "next_step"
      ? "Nếu em hỏi nên học gì tiếp, hãy đưa ra gợi ý cụ thể theo từng bước."
      : "Trả lời linh hoạt, thân thiện.";

  return `
Bạn là Bu, trợ lý học tập thân thiện.

Quy tắc:
- Luôn xưng "Bu"
- Gọi người dùng là "em"
- Trả lời NGẮN GỌN, DỄ HIỂU
- ƯU TIÊN sử dụng nội dung bài học bên dưới
- Không nói lan man ngoài bài nếu không cần

Ngữ cảnh:
${routeHint}
${lessonHint}
${levelHint}
${weakHint}

${lessonContext}

Hướng dẫn:
${modeInstruction}
`;
}

function toOpenAIInput(history: IncomingMessage[], userMessage: string) {
  const trimmedHistory = history.slice(-6);

  const mappedHistory = trimmedHistory.map((item) => ({
    role: item.role === "student" ? "user" : "assistant",
    content: item.text,
  }));

  return [
    ...mappedHistory,
    {
      role: "user",
      content: userMessage,
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body?.message;
    const history = Array.isArray(body?.history) ? body.history : [];
    const lessonTitle = body?.lessonTitle || "";
    const currentRoute = body?.currentRoute || "";
    const currentLevelLabel = body?.currentLevelLabel || "";
    const weakTopics = body?.weakTopics || [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Thiếu nội dung câu hỏi." },
        { status: 400 }
      );
    }

    if (message.length > 1200) {
      return NextResponse.json(
        { error: "Câu hỏi quá dài, em chia nhỏ ra nhé." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const mode = detectMode(message);

    const systemPrompt = buildSystemPrompt({
      lessonTitle,
      currentRoute,
      weakTopics,
      currentLevelLabel,
      mode,
    });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...toOpenAIInput(history, message),
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI lỗi: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Bu chưa trả lời được, em thử lại nhé.";

    return NextResponse.json({ reply, mode });
  } catch (error) {
    console.error("Bu API error:", error);

    return NextResponse.json(
      { error: "Có lỗi khi Bu xử lý câu hỏi." },
      { status: 500 }
    );
  }
}