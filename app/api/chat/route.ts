import { NextRequest, NextResponse } from "next/server"
import { matchFAQ } from "@/lib/ai-faq"
import { SYSTEM_PROMPT } from "@/lib/ai-system-prompt"

// Use Node.js runtime instead of edge: edge sandbox in Next.js dev has been
// flaky for outbound fetch on Windows (corp proxies, custom CAs, DNS).
// Node runtime uses undici with the system trust store and is the safe default.
export const runtime = "nodejs"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

const REQUEST_TIMEOUT_MS = 20_000

async function callOpenAI(
  message: string,
  history: ChatMessage[],
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  const rawBaseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  const baseUrl = rawBaseUrl.replace(/\/+$/, "") // strip trailing slashes
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED")
  }

  // Cap conversation history to keep prompt size predictable. 20 turns is
  // enough for short follow-ups without blowing up token usage on long chats.
  const MAX_HISTORY = 20
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-MAX_HISTORY),
    { role: "user", content: message },
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  // Some providers (e.g. OpenRouter) recommend HTTP-Referer / X-Title headers
  // for analytics and free-tier credit attribution. They're harmless elsewhere.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  }
  if (baseUrl.includes("openrouter.ai")) {
    headers["HTTP-Referer"] =
      process.env.OPENROUTER_REFERER ?? "https://localhost:3000"
    headers["X-Title"] =
      process.env.OPENROUTER_TITLE ?? "Aahana Portfolio Copilot"
  }

  let res: Response
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if ((err as Error).name === "AbortError") {
      throw new Error("AI_TIMEOUT")
    }
    // Re-throw with more context. Network failures show up here.
    throw new Error(
      `AI_NETWORK_ERROR: ${(err as Error).message ?? "unknown"}`,
    )
  }
  clearTimeout(timeout)

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`AI_REQUEST_FAILED: ${res.status} ${errText.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const reply = data.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error("AI_EMPTY_RESPONSE")
  return reply
}

const FALLBACK_REPLY = `I don't have a canned answer for that one, and the live AI isn't configured right now.

Try one of the suggested questions below, or reach Aahana directly at aahana.bobade@example.com.`

export async function POST(req: NextRequest) {
  let body: ChatRequest
  try {
    body = (await req.json()) as ChatRequest
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const message = (body.message ?? "").trim()
  if (!message) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 },
    )
  }

  // 1. Try the predefined FAQ first.
  const match = matchFAQ(message)
  if (match) {
    return NextResponse.json({
      answer: match.faq.answer,
      source: "faq",
      faqId: match.faq.id,
    })
  }

  // 2. Otherwise, hand off to the AI provider.
  try {
    const answer = await callOpenAI(message, body.history ?? [])
    return NextResponse.json({ answer, source: "ai" })
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown"
    // Log server-side so the developer can diagnose, but never leak provider
    // errors to the client.
    console.error("[api/chat] AI call failed:", reason)

    if (reason === "AI_NOT_CONFIGURED") {
      return NextResponse.json({
        answer: FALLBACK_REPLY,
        source: "fallback",
      })
    }

    let userFacing =
      "Hmm, the AI service hit an error on that request. Try again in a moment, or pick one of the suggested questions."
    if (reason === "AI_TIMEOUT") {
      userFacing =
        "The AI is taking longer than expected. Try again, or pick one of the suggested questions."
    } else if (reason.startsWith("AI_NETWORK_ERROR")) {
      userFacing =
        "I couldn't reach the AI service. Check your internet connection (or the API key/base URL) and try again."
    }

    return NextResponse.json(
      { answer: userFacing, source: "error" },
      { status: 200 },
    )
  }
}
