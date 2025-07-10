import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, round, previousDiscussion } = await request.json()

    const models = [
      {
        id: "together",
        name: "ديب سيك",
        personality: "محلل منطقي ومفكر عميق",
        endpoint: "/api/together",
      },
      {
        id: "gemini",
        name: "جيمناي",
        personality: "مبدع ومبتكر في الحلول",
        endpoint: "/api/gemini",
      },
      {
        id: "groq",
        name: "جروك",
        personality: "سريع وعملي في التنفيذ",
        endpoint: "/api/groq",
      },
    ]

    const discussionResults = []

    for (const model of models) {
      let discussionPrompt = ""

      if (round === 0) {
        // Introduction and initial analysis
        discussionPrompt = `أنا ${model.name}، ${model.personality}.

الموضوع للنقاش: ${prompt}

سأقدم تحليلي الأولي وأعرف نفسي للزملاء:`
      } else {
        // Respond to previous discussion
        const context = previousDiscussion.map((msg: any) => `${msg.model}: ${msg.message}`).join("\n\n---\n\n")

        discussionPrompt = `أنا ${model.name}، ${model.personality}.

النقاش السابق:
${context}

الموضوع الأساسي: ${prompt}

بناءً على ما قاله زملائي، سأضيف وجهة نظري وأرد على نقاطهم:`
      }

      try {
        const response = await fetch(`${request.nextUrl.origin}${model.endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: discussionPrompt,
            config: {
              temperature: 0.8, // Higher creativity for discussion
              maxOutputTokens: 1000,
            },
          }),
        })

        const data = await response.json()

        if (data.response && !data.error) {
          discussionResults.push({
            model: model.name,
            modelId: model.id,
            message: data.response,
            timestamp: Date.now(),
          })
        }
      } catch (error) {
        console.error(`Error with ${model.name}:`, error)
        discussionResults.push({
          model: model.name,
          modelId: model.id,
          message: `عذراً، واجهت مشكلة تقنية ولا أستطيع المشاركة في هذه الجولة.`,
          timestamp: Date.now(),
          error: true,
        })
      }

      // Add delay between model responses to simulate natural conversation
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    return NextResponse.json({
      round,
      responses: discussionResults,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Discussion error:", error)
    return NextResponse.json({ error: "فشل في إدارة النقاش" }, { status: 500 })
  }
}
