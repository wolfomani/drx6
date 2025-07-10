import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check all environment variables
    const envKeys = {
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      VERCEL_TOKEN: process.env.VERCEL_TOKEN,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_WEBHOOK: process.env.GITHUB_WEBHOOK,
    }

    // Create a safe response that doesn't expose full keys
    const safeKeys = Object.entries(envKeys).reduce(
      (acc, [key, value]) => {
        acc[key] = value ? `${value.substring(0, 8)}...` : null
        return acc
      },
      {} as Record<string, string | null>,
    )

    return NextResponse.json({
      status: "success",
      message: "Environment variables checked successfully",
      keys: safeKeys,
      summary: {
        total: Object.keys(envKeys).length,
        configured: Object.values(envKeys).filter(Boolean).length,
        missing: Object.values(envKeys).filter((v) => !v).length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check environment variables",
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { service } = await request.json()

    // Test specific service connectivity
    const testResults = {
      groq: false,
      together: false,
      gemini: false,
    }

    if (!service || service === "all") {
      // Test all services
      const testPrompt = "Hello, this is a connectivity test."

      // Test GROQ
      if (process.env.GROQ_API_KEY) {
        try {
          const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama3-8b-8192",
              messages: [{ role: "user", content: testPrompt }],
              max_tokens: 50,
            }),
          })
          testResults.groq = groqResponse.ok
        } catch (error) {
          console.error("GROQ test failed:", error)
        }
      }

      // Test Together AI
      if (process.env.TOGETHER_API_KEY) {
        try {
          const togetherResponse = await fetch("https://api.together.xyz/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
              messages: [{ role: "user", content: testPrompt }],
              max_tokens: 50,
            }),
          })
          testResults.together = togetherResponse.ok
        } catch (error) {
          console.error("Together AI test failed:", error)
        }
      }

      // Test Gemini
      if (process.env.GEMINI_API_KEY) {
        try {
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.GEMINI_API_KEY,
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: testPrompt }] }],
                generationConfig: { maxOutputTokens: 50 },
              }),
            },
          )
          testResults.gemini = geminiResponse.ok
        } catch (error) {
          console.error("Gemini test failed:", error)
        }
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Connectivity tests completed",
      results: testResults,
      summary: {
        working: Object.values(testResults).filter(Boolean).length,
        total: Object.keys(testResults).length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error testing connectivity:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to test connectivity",
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}
