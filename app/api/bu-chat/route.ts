import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
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
        { error: "Thiếu nội dung câu hỏi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu OPENAI_API_KEY trên server." },
        { status: 500 }
      );
    }

    const model = process.env.BU_CHAT_MODEL || "gpt-4.1-mini";

    const systemPrompt = [
      "Bạn là Bu, linh vật hỗ trợ học tập trên website Khoa học tự nhiên.",
      "Bạn luôn gọi mình là Bu và gọi người dùng là em.",
      "Giọng điệu phải thân thiện, ngắn gọn, rõ ràng, gần gũi với học sinh.",
      "Ưu tiên giải thích dễ hiểu, chia nhỏ từng bước, khích lệ học sinh.",
      "Không dùng giọng quá máy móc. Không lan man. Không quá học thuật.",
      "Nếu học sinh hỏi về cách học, hãy đề xuất chiến lược cụ thể, ngắn và phù hợp.",
      "Nếu không chắc, hãy nói rõ Bu chưa chắc và đề nghị em hỏi lại cụ thể hơn.",
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

    const reply =
      data?.output_text ||
      data?.output
        ?.flatMap((item: any) => item?.content || [])
        ?.filter((content: any) => content?.type === "output_text")
        ?.map((content: any) => content?.text || "")
        ?.join("\n")
        ?.trim() ||
      "Bu đang suy nghĩ mà chưa trả lời rõ được. Em hỏi lại Bu một chút nhé.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Bu chat route error:", error);
    return NextResponse.json(
      { error: "Bu đang gặp sự cố tạm thời. Em thử lại sau nhé." },
      { status: 500 }
    );
  }
}