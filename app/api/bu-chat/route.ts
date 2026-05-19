import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

function buildPrompt(params: {
  message: string;
  lessonTitle?: string;
  currentLevelLabel?: string;
  weakTopics?: string[];
}) 
{
  const {
    message,
    lessonTitle,
    currentLevelLabel,
    weakTopics = [],
  } = params;

  return `
Bạn là Bu — trợ lý học tập môn Khoa học tự nhiên cho học sinh THCS.

VAI TRÒ:
- hỗ trợ học sinh hiểu bài
- giải thích dễ hiểu
- gần gũi như giáo viên hỗ trợ học sinh
- KHÔNG được trả lời quá ngắn
- KHÔNG được từ chối các câu hỏi kiến thức cơ bản

THÔNG TIN HỌC SINH:
- Bài hiện tại: ${lessonTitle || "chưa xác định"}
- Mức hiện tại: ${currentLevelLabel || "chưa xác định"}
- Phần còn yếu: ${
    weakTopics.length > 0
      ? weakTopics.join(", ")
      : "chưa có dữ liệu"
  }

NGUYÊN TẮC:
1. Gọi mình là "Bu", gọi học sinh là "em".
2. Nếu học sinh hỏi khái niệm:
   - giải thích khái niệm
   - cho ví dụ
   - cách nhớ ngắn
   - một lưu ý dễ nhầm
3. Nếu học sinh hỏi tên chất:
   - tên tiếng Việt
   - công thức
   - tính chất cơ bản
4. Với Hóa học:
   - viết đúng công thức: H2O, CO2, HCl, H2SO4...
5. Không trả lời kiểu:
   "Bu chưa hiểu câu hỏi"
   nếu học sinh đang hỏi kiến thức phổ thông bình thường.
6. Trả lời 4-8 câu.
7. Giọng điệu thân thiện, dễ hiểu.

CÂU HỎI HỌC SINH:
${message}
`.trim();
}

async function callGemini(
  model: string,
  apiKey: string,
  params: {
    message: string;
    lessonTitle?: string;
    currentLevelLabel?: string;
    weakTopics?: string[];
  }
) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(params) }],
        },
      ],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 900,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("Gemini failed model:", model);
    console.log("Gemini status:", response.status);
    console.log("Gemini data:", JSON.stringify(data, null, 2));

    return {
      ok: false,
      error: data?.error?.message || `Không gọi được model ${model}.`,
    };
  }

  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

  return {
    ok: true,
    reply:
      reply ||
      "Bu chưa nhận được phản hồi rõ ràng. Em thử hỏi lại ngắn hơn nhé.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message?.toString().trim();

    if (!message) {
      return NextResponse.json(
        { error: "Thiếu nội dung câu hỏi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu GEMINI_API_KEY trong .env.local." },
        { status: 500 }
      );
    }

    const tried = new Set<string>();

    for (const model of GEMINI_MODELS) {
      if (!model || tried.has(model)) continue;
      tried.add(model);

      const result = await callGemini(model, apiKey, message);

      if (result.ok) {
        return NextResponse.json({
          reply: result.reply,
          model,
        });
      }
    }

    return NextResponse.json(
      {
        error:
          "Bu chưa kết nối được Gemini. Em kiểm tra lại GEMINI_API_KEY hoặc model trong .env.local.",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Bu chat API error:", error);

    return NextResponse.json(
      { error: "Bu đang gặp lỗi kết nối tạm thời." },
      { status: 500 }
    );
  }
}