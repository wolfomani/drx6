import { type NextRequest, NextResponse } from "next/server"

// دالة مساعدة للتأخير مع عشوائية
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 1000))

// دالة إعادة المحاولة مع تأخير متزايد
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries - 1) break

      const delayTime = baseDelay * Math.pow(2, attempt)
      await delay(delayTime)
    }
  }

  throw lastError!
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, config = {} } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "المطلوب نص للمعالجة" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح Gemini API غير متوفر" }, { status: 500 })
    }

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: config.temperature || 0.7,
        topP: config.topP || 0.9,
        maxOutputTokens: Math.min(config.maxOutputTokens || 1500, 1500), // تقليل الحد الأقصى
      },
    }

    // استخدام إعادة المحاولة مع تأخير متزايد
    const response = await retryWithBackoff(
      async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 ثانية

        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            },
          )

          clearTimeout(timeoutId)

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))

            // معالجة أخطاء محددة
            if (res.status === 503) {
              throw new Error(`OVERLOADED: ${errorData.error?.message || "النموذج محمل بشكل زائد"}`)
            } else if (res.status === 429) {
              throw new Error(`RATE_LIMIT: تم تجاوز حد الطلبات`)
            } else if (res.status === 400) {
              throw new Error(`BAD_REQUEST: ${errorData.error?.message || "طلب غير صحيح"}`)
            }

            throw new Error(`HTTP_${res.status}: ${errorData.error?.message || "خطأ في الخدمة"}`)
          }

          return res
        } finally {
          clearTimeout(timeoutId)
        }
      },
      3,
      1000,
    )

    const data = await response.json()

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        {
          error: "لم يتم إنتاج استجابة صحيحة من Gemini",
          details: data,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      response: data.candidates[0].content.parts[0].text,
      model: "Gemini 1.5 Flash",
      usage: data.usageMetadata || {},
      retries: 0, // سيتم تحديثه في حالة إعادة المحاولة
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "خطأ غير معروف"

    // تسجيل الأخطاء للمراقبة
    console.error("Gemini API Error:", {
      message: errorMessage,
      timestamp: new Date().toISOString(),
    })

    // إرجاع رسائل خطأ مفيدة للمستخدم
    if (errorMessage.includes("OVERLOADED")) {
      return NextResponse.json(
        {
          error: "النموذج محمل حالياً، يرجى المحاولة لاحقاً",
          type: "overloaded",
          retryAfter: 30,
        },
        { status: 503 },
      )
    } else if (errorMessage.includes("RATE_LIMIT")) {
      return NextResponse.json(
        {
          error: "تم تجاوز حد الطلبات، يرجى الانتظار",
          type: "rate_limit",
          retryAfter: 60,
        },
        { status: 429 },
      )
    } else if (errorMessage.includes("timeout")) {
      return NextResponse.json(
        {
          error: "انتهت مهلة الطلب، يرجى المحاولة مرة أخرى",
          type: "timeout",
        },
        { status: 408 },
      )
    }

    return NextResponse.json(
      {
        error: "فشل في الاتصال بخدمة Gemini",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Gemini API متاح",
    model: "gemini-1.5-flash-latest",
    timestamp: new Date().toISOString(),
  })
}
