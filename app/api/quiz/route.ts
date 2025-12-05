import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful teacher helping students learn about NIRD (Resilience, Inclusion, Responsibility, Durability). Give concise, encouraging answers in French.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to get quiz response" }, { status: response.status })
    }

    const data = await response.json()
    const answer = data.choices[0].message.content

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("[v0] Quiz API error:", error)
    return NextResponse.json({ error: "Failed to process quiz request" }, { status: 500 })
  }
}
