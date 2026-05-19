import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODELS = [
  "gemini-2.0-flash",
];

function buildPrompt(message: string) {
  return `
Bạn là Bu, trợ lý học tập môn Khoa học tự nhiên cho học sinh THCS.

Nguyên tắc trả lời:
- Gọi mình là "Bu", gọi học sinh là "em".
- Trả lời ngắn gọn, dễ hiểu, thân thiện.
- Không làm bài thay hoàn toàn nếu em hỏi bài tập.
- Ưu tiên gợi ý từng bước, nhắc khái niệm, nhắc công thức.
- Với Hóa học, viết công thức đúng như H2O, CO2, H2CO3, NaOH, HCl.
- Nếu câu hỏi quá rộng, hãy hỏi lại em đang vướng phần nào.

Câu hỏi của học sinh:
${message}
`.trim();
}

async function callGemini(model: string, apiKey: string, message: string) {
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
          parts: [{ text: buildPrompt(message) }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 420,
      },
    }),
  });

  const data = await response.json();
  console.log("Gemini status:", response.status);
  console.log("Gemini data:", JSON.stringify(data, null, 2));
  if (!response.ok) {
    return {
      ok: false,
      error:
        data?.error?.message ||
        `Không gọi được model ${model}.`,
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

    const errors: string[] = [];

    for (const model of GEMINI_MODELS) {
      const result = await callGemini(model, apiKey, message);

      if (result.ok) {
        return NextResponse.json({
          reply: result.reply,
          model,
        });
      }

      errors.push(`${model}: ${result.error}`);
    }

    return NextResponse.json(
      {
        error:
          "Bu chưa về nhà, em đợi Bu nhé!",
        details: errors,
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