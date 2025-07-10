import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    // تحقق من وجود مفتاح API
    if (!process.env.TOGETHER_API_KEY) {
      return NextResponse.json({ error: "مفتاح Together API غير موجود" }, { status: 500 })
    }

    console.log("Together API Request:", { prompt: prompt.substring(0, 50) + "..." })

    // استخدام نموذج مختلف مع حدود أعلى
    const models = [
      "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      "meta-llama/Llama-3.2-1B-Instruct-Turbo",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
    ]

    let lastError = null

    // جرب النماذج واحد تلو الآخر
    for (const model of models) {
      try {
        const response = await fetch("https://api.together.xyz/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
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
            max_tokens: 1000, // تقليل عدد الرموز لتجنب حدود المعدل
            temperature: 0.7,
            top_p: 0.9,
          }),
        })

        console.log(`Together API Response Status for ${model}:`, response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("Together API Success:", data.choices?.[0]?.message?.content?.substring(0, 100))

          return NextResponse.json({
            response: data.choices[0].message.content,
            model: `Together AI (${model})`,
            usage: data.usage,
            modelUsed: model,
          })
        } else {
          const errorData = await response.json()
          console.error(`Together API Error for ${model}:`, errorData)

          // إذا كان خطأ حد المعدل، جرب النموذج التالي
          if (errorData.error?.type === "model_rate_limit") {
            lastError = errorData
            console.log(`Rate limit hit for ${model}, trying next model...`)
            continue
          } else {
            // خطأ آخر، أرجع الخطأ مباشرة
            return NextResponse.json(
              {
                error: `خطأ في Together API (${response.status}): ${errorData.error?.message || "خطأ غير معروف"}`,
                details: errorData,
              },
              { status: 500 },
            )
          }
        }
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError)
        lastError = modelError
        continue
      }
    }

    // إذا فشلت جميع النماذج
    return NextResponse.json(
      {
        error: "فشل في جميع نماذج Together AI - قد تكون جميع النماذج قد وصلت لحد المعدل",
        details: lastError,
        suggestion: "حاول مرة أخرى بعد دقيقة أو استخدم خدمة أخرى",
      },
      { status: 429 },
    )
  } catch (error) {
    console.error("Together AI Error:", error)
    return NextResponse.json(
      {
        error: `فشل في الاتصال بـ Together AI: ${error}`,
      },
      { status: 500 },
    )
  }
}
