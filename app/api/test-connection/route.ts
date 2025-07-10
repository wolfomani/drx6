import { NextResponse } from "next/server"

export async function GET() {
  const results = {
    together: { status: "unknown", error: null, model: null, details: null },
    groq: { status: "unknown", error: null, model: null, details: null },
    gemini: { status: "unknown", error: null, model: null, details: null },
  }

  // Test Together AI
  try {
    const togetherResponse = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [{ role: "user", content: "مرحبا، هذا اختبار اتصال" }],
        max_tokens: 50,
      }),
    })

    if (togetherResponse.ok) {
      results.together.status = "connected"
      results.together.model = "DeepSeek-R1-Distill-Llama-70B-free"
    } else {
      const errorText = await togetherResponse.text()
      results.together.status = "error"
      results.together.error = `HTTP ${togetherResponse.status}: ${errorText}`
    }
  } catch (error) {
    results.together.status = "error"
    results.together.error = String(error)
  }

  // Test Groq
  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: "مرحبا، هذا اختبار اتصال" }],
        max_tokens: 50,
      }),
    })

    if (groqResponse.ok) {
      results.groq.status = "connected"
      results.groq.model = "Llama3-8b-8192"
    } else {
      const errorText = await groqResponse.text()
      results.groq.status = "error"
      results.groq.error = `HTTP ${groqResponse.status}: ${errorText}`
    }
  } catch (error) {
    results.groq.status = "error"
    results.groq.error = String(error)
  }

  // Test Gemini
  try {
    if (!process.env.GEMINI_API_KEY) {
      results.gemini.status = "error"
      results.gemini.error = "مفتاح API غير موجود"
    } else {
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "مرحبا، هذا اختبار اتصال",
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 50,
            },
          }),
        },
      )

      if (geminiResponse.ok) {
        const data = await geminiResponse.json()
        results.gemini.status = "connected"
        results.gemini.model = "Gemini 2.5 Flash"
        results.gemini.details = {
          responseLength: data.candidates?.[0]?.content?.parts?.[0]?.text?.length || 0,
          usage: data.usageMetadata,
        }
      } else {
        const errorText = await geminiResponse.text()
        results.gemini.status = "error"

        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error?.code === 403) {
            results.gemini.error = "مفتاح API غير صالح أو منتهي الصلاحية (403 PERMISSION_DENIED)"
          } else {
            results.gemini.error = `HTTP ${geminiResponse.status}: ${errorData.error?.message || errorText}`
          }
        } catch (e) {
          results.gemini.error = `HTTP ${geminiResponse.status}: ${errorText}`
        }
      }
    }
  } catch (error) {
    results.gemini.status = "error"
    results.gemini.error = String(error)
  }

  return NextResponse.json(results)
}
