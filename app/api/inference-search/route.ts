import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, candidateCount = 50 } = await request.json()

    // Generate multiple responses from different models
    const candidates = []
    const models = ["together", "groq", "gemini"]

    for (let i = 0; i < candidateCount; i++) {
      const modelId = models[i % models.length]
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/${modelId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })

        const data = await response.json()
        if (data.response && !data.error) {
          candidates.push({
            response: data.response,
            model: modelId,
            score: Math.random() * 30 + 70, // Simulate scoring
          })
        }
      } catch (error) {
        console.error(`Error with model ${modelId}:`, error)
      }

      // Break early if we have enough good candidates
      if (candidates.length >= Math.min(10, candidateCount / 5)) break
    }

    // Select best candidate (highest score)
    const bestCandidate = candidates.reduce((best, current) => (current.score > best.score ? current : best))

    return NextResponse.json({
      result: bestCandidate.response,
      candidates: candidates.length,
      bestModel: bestCandidate.model,
      score: bestCandidate.score,
    })
  } catch (error) {
    console.error("Inference search error:", error)
    return NextResponse.json({ error: "فشل في البحث الذكي" }, { status: 500 })
  }
}
