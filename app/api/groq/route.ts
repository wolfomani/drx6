import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    // تحقق من وجود مفتاح API
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "مفتاح Groq API غير موجود" }, { status: 500 })
    }

    console.log("Groq API Request:", { prompt: prompt.substring(0, 50) + "..." })

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "أنت مساعد ذكي ومفيد. أجب باللغة العربية بطريقة واضحة ومفصلة.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
      }),
    })

    console.log("Groq API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API Error:", errorText)
      return NextResponse.json(
        {
          error: `خطأ في Groq API (${response.status}): ${errorText}`,
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    console.log("Groq API Success:", data.choices?.[0]?.message?.content?.substring(0, 100))

    return NextResponse.json({
      response: data.choices[0].message.content,
      model: "Groq (Llama3-8b)",
      usage: data.usage,
    })
  } catch (error) {
    console.error("Groq Error:", error)
    return NextResponse.json(
      {
        error: `فشل في الاتصال بـ Groq: ${error}`,
      },
      { status: 500 },
    )
  }
}
