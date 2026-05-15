import { NextRequest, NextResponse } from "next/server";
import { buildChemistryPromptGuard } from "@/lib/chemistry-language";

export const runtime = "nodejs";

type RateRecord = {
  count: number;
  resetAt: number;
};

const rateMap = new Map<string, RateRecord>();

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_MESSAGE_LENGTH = 1200;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "local-dev";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const existing = rateMap.get(key);

  if (!existing || now > existing.resetAt) {
    rateMap.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count += 1;
  rateMap.set(key, existing);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - existing.count,
  };
}

function sanitizeText(input: unknown, maxLength: number) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Bu chat API đang hoạt động. Hãy gửi POST để chat.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          reply:
            "Bu đang nhận hơi nhiều câu hỏi từ thiết bị này. Em nghỉ một chút rồi hỏi lại Bu nhé.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rate.retryAfterMs ?? RATE_LIMIT_WINDOW_MS) / 1000)
            ),
          },
        }
      );
    }

    const body = await request.json();

    const message = sanitizeText(body?.message, MAX_MESSAGE_LENGTH);
    const lessonTitle = sanitizeText(body?.lessonTitle, 200);
    const currentLevelLabel = sanitizeText(body?.currentLevelLabel, 100);

    const weakTopics = Array.isArray(body?.weakTopics)
      ? body.weakTopics
          .filter((item: unknown) => typeof item === "string")
          .map((item: string) => item.trim().slice(0, 100))
          .slice(0, 5)
      : [];

    if (!message) {
      return NextResponse.json(
        { reply: "Bu chưa thấy câu hỏi của em. Em nhập lại rõ hơn nhé." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        {
          reply:
            "Bu chưa được cấu hình khóa API ở server. Em nhờ người quản trị kiểm tra file .env.local nhé.",
        },
        { status: 500 }
      );
    }

    const model = process.env.BU_CHAT_MODEL || "gpt-4o-mini";

    const systemPrompt = [
      "Bạn là Bu, linh vật hỗ trợ học tập trên website Khoa học tự nhiên.",
      "Bạn luôn gọi mình là Bu và gọi người dùng là em.",
      "Giọng điệu thân thiện, ngắn gọn, rõ ràng, gần gũi với học sinh THCS.",
      "Ưu tiên giải thích dễ hiểu, chia nhỏ từng bước, khích lệ học sinh.",
      "Không làm thay toàn bộ nếu học sinh chưa thử. Hãy gợi ý cách nghĩ trước.",
      "Không dùng giọng máy móc. Không lan man. Không quá học thuật.",
      "Nếu học sinh hỏi bài, hãy giải thích theo từng bước ngắn.",
      "Nếu học sinh hỏi cách học, hãy đề xuất chiến lược cụ thể.",
      "Nếu không chắc, hãy nói rõ Bu chưa chắc và đề nghị em hỏi lại cụ thể hơn.",
      lessonTitle ? `Bài học hiện tại: ${lessonTitle}.` : "",
      currentLevelLabel ? `Mức hiện tại của em: ${currentLevelLabel}.` : "",
      weakTopics.length > 0 ? `Phần cần chú ý: ${weakTopics.join(", ")}.` : "",
      buildChemistryPromptGuard(),
    ]
      .filter(Boolean)
      .join(" ");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.45,
        max_tokens: 450,
      }),
    });

    clearTimeout(timeout);

    const rawText = await response.text();

    if (!response.ok) {
      console.error("OpenAI API error:", rawText);

      return NextResponse.json(
        {
          reply:
            "Bu đang bận chút xíu, em hỏi lại sau nhé!",
        },
        { status: 502 }
      );
    }

    let data: any;

    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("OpenAI invalid JSON:", rawText);

      return NextResponse.json(
        {
          reply:
            "Bu nhận được phản hồi không hợp lệ từ AI. Em thử lại sau một chút nhé.",
        },
        { status: 502 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Bu đang suy nghĩ mà chưa trả lời rõ được. Em hỏi lại Bu một chút nhé.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Bu chat route error:", error);

    if (error?.name === "AbortError") {
      return NextResponse.json(
        {
          reply:
            "Bu suy nghĩ hơi lâu nên bị ngắt kết nối. Em thử hỏi ngắn hơn một chút nhé.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        reply:
          "Bu đang gặp sự cố tạm thời. Em thử lại sau nhé.",
      },
      { status: 500 }
    );
  }
}