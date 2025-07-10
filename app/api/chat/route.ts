import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Use Groq as default for single responses (fastest)
    const response = await fetch(`${request.nextUrl.origin}/api/groq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    })

    const data = await response.json()

    return NextResponse.json({
      response: data.response || "I apologize, but I couldn't process your request at the moment.",
      model: data.model || "AI Assistant",
      usage: data.usage,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process your message" }, { status: 500 })
  }
}
