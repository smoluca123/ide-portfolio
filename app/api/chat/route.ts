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

// Reject overly long prompts to bound token usage and abuse.
const MAX_MESSAGE_LENGTH = 2_000

// --- Simple in-memory, per-IP rate limiter -------------------------------
// Good enough for a single-instance portfolio deployment. For multi-instance
// or serverless-at-scale, swap this for a shared store (Redis, Upstash, etc.).
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15 // per window per IP

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

/** Returns true if the request is allowed, false if the IP is over the limit. */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const bucket = rateLimitBuckets.get(ip)

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) return false

  bucket.count += 1
  return true
}

// Opportunistically evict stale buckets so the map doesn't grow unbounded.
function sweepRateLimitBuckets() {
  const now = Date.now()
  for (const [ip, bucket] of rateLimitBuckets) {
    if (now > bucket.resetAt) rateLimitBuckets.delete(ip)
  }
}

// --- Streaming protocol --------------------------------------------------
// The endpoint streams newline-delimited JSON (NDJSON). Each line is one of:
//   { "type": "meta",  "source": "faq" | "ai" | "fallback" | "error", "faqId"?: string }
//   { "type": "delta", "content": "partial text chunk" }
//   { "type": "done" }
//   { "type": "error", "message": "..." }
// "meta" is always sent first so the client knows where the answer came from.
type StreamEvent =
  | { type: "meta"; source: "faq" | "ai" | "fallback" | "error"; faqId?: string }
  | { type: "delta"; content: string }
  | { type: "done" }
  | { type: "error"; message: string }

const encoder = new TextEncoder()

function ndjson(event: StreamEvent): Uint8Array {
  return encoder.encode(JSON.stringify(event) + "\n")
}

/**
 * Opens a streaming chat completion against the configured provider.
 * Returns the raw streaming Response (SSE body) for the caller to parse.
 * Throws typed errors (AI_NOT_CONFIGURED / AI_TIMEOUT / AI_NETWORK_ERROR / ...)
 * for the connection phase; once headers are received the timeout is cleared.
 */
async function openAIStream(
  message: string,
  history: ChatMessage[],
): Promise<Response> {
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
      process.env.OPENROUTER_TITLE ?? "Luca Nguyen Portfolio Copilot"
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
        stream: true,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if ((err as Error).name === "AbortError") {
      throw new Error("AI_TIMEOUT")
    }
    // Re-throw with more context. Network failures show up here.
    throw new Error(`AI_NETWORK_ERROR: ${(err as Error).message ?? "unknown"}`)
  }
  // Headers received — the slow part (model thinking) is the stream body, so
  // stop the connection timer and let the response flow.
  clearTimeout(timeout)

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`AI_REQUEST_FAILED: ${res.status} ${errText.slice(0, 200)}`)
  }
  if (!res.body) throw new Error("AI_EMPTY_RESPONSE")
  return res
}

/**
 * Reads an OpenAI-style SSE stream and yields the text deltas as they arrive.
 */
async function* parseOpenAIDeltas(
  res: Response,
): AsyncGenerator<string, void, unknown> {
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    // Keep the last (possibly partial) line in the buffer.
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith("data:")) continue
      const payload = trimmed.slice(5).trim()
      if (payload === "" || payload === "[DONE]") continue
      try {
        const json = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[]
        }
        const delta = json.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch {
        // Ignore keep-alive comments / unparseable partials.
      }
    }
  }
}

function userFacingError(reason: string): string {
  if (reason === "AI_TIMEOUT") {
    return "The AI is taking longer than expected. Try again, or pick one of the suggested questions."
  }
  if (reason.startsWith("AI_NETWORK_ERROR")) {
    return "I couldn't reach the AI service. Check your internet connection (or the API key/base URL) and try again."
  }
  return "Hmm, the AI service hit an error on that request. Try again in a moment, or pick one of the suggested questions."
}

const FALLBACK_REPLY = `I don't have a canned answer for that one, and the live AI isn't configured right now.

Try one of the suggested questions below, or reach Luca directly at luca.nguyen@example.com.`

export async function POST(req: NextRequest) {
  // Rate limit before doing any work.
  sweepRateLimitBuckets()
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        answer:
          "You're sending messages a bit too fast. Give it a minute and try again.",
        source: "rate_limited",
      },
      { status: 429 },
    )
  }

  let body: ChatRequest
  try {
    body = (await req.json()) as ChatRequest
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const message = (body.message ?? "").trim()
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` },
      { status: 413 },
    )
  }

  const history = body.history ?? []
  const match = matchFAQ(message)

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(ndjson(event))

      try {
        // 1. Predefined FAQ answers stream as a single chunk — the client's
        //    typewriter still reveals them gradually for a consistent feel.
        if (match) {
          send({ type: "meta", source: "faq", faqId: match.faq.id })
          send({ type: "delta", content: match.faq.answer })
          send({ type: "done" })
          controller.close()
          return
        }

        // 2. Otherwise stream live tokens from the AI provider.
        let res: Response
        try {
          res = await openAIStream(message, history)
        } catch (err) {
          const reason = err instanceof Error ? err.message : "unknown"
          console.error("[api/chat] AI call failed:", reason)

          if (reason === "AI_NOT_CONFIGURED") {
            send({ type: "meta", source: "fallback" })
            send({ type: "delta", content: FALLBACK_REPLY })
          } else {
            send({ type: "meta", source: "error" })
            send({ type: "delta", content: userFacingError(reason) })
          }
          send({ type: "done" })
          controller.close()
          return
        }

        send({ type: "meta", source: "ai" })
        let gotContent = false
        try {
          for await (const delta of parseOpenAIDeltas(res)) {
            gotContent = true
            send({ type: "delta", content: delta })
          }
        } catch (err) {
          const reason = err instanceof Error ? err.message : "unknown"
          console.error("[api/chat] streaming interrupted:", reason)
          if (!gotContent) {
            // Nothing reached the client yet — degrade to a readable message.
            send({ type: "delta", content: userFacingError("AI_NETWORK_ERROR") })
          }
        }

        if (!gotContent) {
          send({
            type: "delta",
            content:
              "The AI returned an empty response. Try rephrasing, or pick a suggested question.",
          })
        }
        send({ type: "done" })
        controller.close()
      } catch (err) {
        console.error("[api/chat] unexpected stream error:", err)
        send({ type: "error", message: "stream_failed" })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      // Disable proxy buffering (nginx) so chunks flush immediately.
      "X-Accel-Buffering": "no",
    },
  })
}
