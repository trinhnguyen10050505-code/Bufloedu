import { NextRequest, NextResponse } from "next/server";

type RateRecord = {
  count: number;
  resetAt: number;
};

const rateMap = new Map<string, RateRecord>();

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_MESSAGE_LENGTH = 1200;
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
]);

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
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
    return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  rateMap.set(key, existing);

  return { allowed: true, remaining: RATE_LIMIT_MAX - existing.count };
}

function sanitizeUserMessage(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, MAX_MESSAGE_LENGTH);
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return ALLOWED_ORIGINS.has(origin);
}

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { error: "Origin không hợp lệ." },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Bu đang nhận quá nhiều câu hỏi từ thiết bị này. Em thử lại sau ít phút nhé.",
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
    const message = sanitizeUserMessage(body?.message);
    const lessonTitle =
      typeof body?.lessonTitle === "string" ? body.lessonTitle.trim().slice(0, 200) : "";
    const currentLevelLabel =
      typeof body?.currentLevelLabel === "string"
        ? body.currentLevelLabel.trim().slice(0, 100)
        : "";
    const weakTopics = Array.isArray(body?.weakTopics)
      ? body.weakTopics
          .filter((item: unknown) => typeof item === "string")
          .map((item: string) => item.trim().slice(0, 100))
          .slice(0, 5)
      : [];

    if (!message) {
      return NextResponse.json(
        { error: "Thiếu nội dung câu hỏi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu cấu hình OPENAI_API_KEY trên server." },
        { status: 500 }
      );
    }

    const model = process.env.BU_CHAT_MODEL || "gpt-4.1-mini";

    const systemPrompt = [
      "Bạn là Bu, linh vật hỗ trợ học tập cho website Khoa học tự nhiên.",
      "Cách xưng hô: gọi mình là Bu, gọi người dùng là em.",
      "Giọng điệu: thân thiện, gần gũi, ngắn gọn, khích lệ học sinh.",
      "Không dùng các mức Trung bình/Khá/Giỏi để gọi trực tiếp học sinh nếu không cần; ưu tiên ngôn ngữ Bu Chăm chỉ, Bu Thông minh, Bu Năng nổ.",
      "Nếu câu hỏi liên quan học tập, hãy trả lời theo hướng dễ hiểu cho học sinh.",
      "Nếu không chắc, hãy nói rõ là Bu chưa chắc.",
      lessonTitle ? `Bài học hiện tại: ${lessonTitle}.` : "",
      currentLevelLabel ? `Mức hiện tại của em: ${currentLevelLabel}.` : "",
      weakTopics.length > 0 ? `Phần cần chú ý: ${weakTopics.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: systemPrompt }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: message }],
          },
        ],
        max_output_tokens: 350,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);

      return NextResponse.json(
        { error: "Bu đang hơi bận, em thử lại sau nhé." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const text =
      data?.output_text ||
      data?.output?.flatMap((item: any) => item?.content || [])
        ?.filter((content: any) => content?.type === "output_text")
        ?.map((content: any) => content?.text || "")
        ?.join("\n")
        ?.trim() ||
      "Bu đang suy nghĩ mà chưa trả lời được rõ. Em hỏi lại Bu một chút nhé.";

    return NextResponse.json({
      reply: text,
    });
  } catch (error) {
    console.error("Bu chat route error:", error);

    return NextResponse.json(
      { error: "Bu đang gặp sự cố tạm thời. Em thử lại sau nhé." },
      { status: 500 }
    );
  }
}