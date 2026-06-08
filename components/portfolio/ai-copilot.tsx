"use client"

import { X, Send, Sparkles, Bot, User, Loader2, RotateCcw } from "lucide-react"
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react"
import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { MarkdownContent } from "./markdown-content"
import { suggestedQuestions } from "@/lib/ai-faq"
import { portfolio } from "@/lib/portfolio"
import { trackAiQuestion } from "@/lib/analytics"

interface AICopilotProps {
  onClose: () => void
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  /** Where this assistant message came from. */
  source?: "faq" | "ai" | "fallback" | "error"
}

const initialAssistantMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    `Hi! I'm ${portfolio.identity.firstName}'s Copilot. Ask me about their projects, skills, experience — or pick one of the suggestions below to get started.`,
  source: "faq",
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function AICopilot({ onClose }: AICopilotProps) {
  const { theme } = useTheme()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialAssistantMessage,
  ])
  const [isSending, setIsSending] = useState(false)
  // Id of the assistant message currently being streamed (null when idle).
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Typewriter reveal queue. Deltas arrive in bursts from the network; this
  // drains them at a steady pace so the text appears to "type" smoothly.
  const queueRef = useRef<{ id: string; pending: string; done: boolean } | null>(
    null,
  )
  const timerRef = useRef<number | null>(null)

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Reveal a few characters per tick. Accelerates when a backlog builds up so
  // a fast model never lags noticeably behind the network.
  const tick = () => {
    const q = queueRef.current
    if (!q) return

    if (q.pending.length > 0) {
      const step = Math.max(2, Math.ceil(q.pending.length / 8))
      const chunk = q.pending.slice(0, step)
      q.pending = q.pending.slice(step)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === q.id ? { ...m, content: m.content + chunk } : m,
        ),
      )
    } else if (q.done) {
      // Stream finished and buffer drained — settle back to idle.
      stopTimer()
      queueRef.current = null
      setStreamingId(null)
      setIsSending(false)
      requestAnimationFrame(() => inputRef.current?.focus())
      return
    }
    timerRef.current = window.setTimeout(tick, 16)
  }

  const ensureTimer = () => {
    if (timerRef.current === null) tick()
  }

  // Clean up any running timer on unmount.
  useEffect(() => () => stopTimer(), [])

  // Auto-scroll on new messages / streamed content.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isSending])

  // Auto-resize the textarea to fit its content (caps at 120px).
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [message])

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isSending) return

    trackAiQuestion(text.length)

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
    }

    // Snapshot history *before* this turn for the API.
    const historyForApi = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }))

    // The placeholder assistant bubble we'll stream tokens into.
    const assistantId = makeId()

    setMessages((prev) => [...prev, userMsg])
    setMessage("")
    setIsSending(true)
    setStreamingId(null)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyForApi }),
      })

      // Rate limiting and validation errors come back as plain JSON.
      const contentType = res.headers.get("content-type") ?? ""
      if (!res.ok || !contentType.includes("ndjson") || !res.body) {
        let answer =
          "Sorry, something went wrong. Please try again in a moment."
        try {
          const data = (await res.json()) as { answer?: string; error?: string }
          answer = data.answer ?? data.error ?? answer
        } catch {
          /* keep default */
        }
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: answer, source: "error" },
        ])
        setIsSending(false)
        requestAnimationFrame(() => inputRef.current?.focus())
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let bubbleCreated = false

      const handleEvent = (line: string) => {
        const trimmed = line.trim()
        if (!trimmed) return
        let event: {
          type: string
          source?: ChatMessage["source"]
          content?: string
          message?: string
        }
        try {
          event = JSON.parse(trimmed)
        } catch {
          return
        }

        if (event.type === "meta") {
          // First event: create the assistant bubble and start the typewriter.
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: "",
              source: event.source ?? "ai",
            },
          ])
          bubbleCreated = true
          setStreamingId(assistantId)
          queueRef.current = { id: assistantId, pending: "", done: false }
        } else if (event.type === "delta" && event.content) {
          if (!queueRef.current) {
            queueRef.current = { id: assistantId, pending: "", done: false }
            if (!bubbleCreated) {
              setMessages((prev) => [
                ...prev,
                { id: assistantId, role: "assistant", content: "", source: "ai" },
              ])
              bubbleCreated = true
              setStreamingId(assistantId)
            }
          }
          queueRef.current.pending += event.content
          ensureTimer()
        } else if (event.type === "error") {
          if (queueRef.current) {
            queueRef.current.pending +=
              "\n\nThe response was interrupted. Please try again."
          }
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const line of lines) handleEvent(line)
      }
      if (buffer.trim()) handleEvent(buffer)

      // Mark the queue complete; the timer settles state once drained.
      if (queueRef.current) {
        queueRef.current.done = true
        ensureTimer()
      } else {
        // No content at all — surface a generic error and reset.
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "Sorry, I didn't get a response. Please try again.",
            source: "error",
          },
        ])
        setIsSending(false)
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    } catch {
      stopTimer()
      queueRef.current = null
      setStreamingId(null)
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content:
            "I couldn't reach the chat service. Check your connection and try again.",
          source: "error",
        },
      ])
      setIsSending(false)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(message)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(message)
    }
  }

  const handleSuggestion = (s: string) => {
    sendMessage(s)
  }

  const handleReset = () => {
    stopTimer()
    queueRef.current = null
    setStreamingId(null)
    setIsSending(false)
    setMessages([initialAssistantMessage])
    setMessage("")
  }

  const showSuggestions = messages.length <= 1 && !isSending

  return (
    <div
      className="flex h-full w-full min-w-0 shrink-0 flex-col border-l"
      style={{ backgroundColor: theme.sidebar, borderColor: theme.border }}
    >
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: theme.pink }} />
          <span
            className="font-mono text-[13px] font-semibold"
            style={{ color: theme.foreground }}
          >
            {portfolio.identity.firstName}&apos;s AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            aria-label="Reset conversation"
            title="Reset conversation"
            disabled={messages.length <= 1 && !message}
            className="flex h-6 w-6 items-center justify-center rounded-sm transition-colors disabled:opacity-40"
            style={{ color: theme.subtle }}
            onMouseEnter={(e) => {
              if (messages.length > 1 || message) {
                e.currentTarget.style.backgroundColor = theme.surface
                e.currentTarget.style.color = theme.foreground
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = theme.subtle
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close AI Assistant"
            className="flex h-6 w-6 items-center justify-center rounded-sm transition-colors"
            style={{ color: theme.subtle }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.surface
              e.currentTarget.style.color = theme.foreground
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = theme.subtle
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Workspace pill */}
      <div
        className="shrink-0 border-b px-4 py-2"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: withAlpha(theme.subtle, "99") }}
          >
            Workspace
          </span>
          <span
            className="rounded-sm px-2 py-0.5 font-mono text-[10px]"
            style={{
              backgroundColor: withAlpha(theme.accent, "26"),
              color: theme.accent,
            }}
          >
            ● portfolio · {portfolio.identity.fullName.toLowerCase().replace(/\s+/g, '-')}
          </span>
        </div>
      </div>

      {/* Body: chat transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4">
        {/* Initial avatar / greeting only on empty conversation */}
        {messages.length === 1 && (
          <div className="mb-4 flex flex-col items-center text-center">
            <div
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
            >
              <span className="text-2xl" style={{ color: theme.pink }}>
                ✦
              </span>
            </div>
            <h3
              className="mb-1 font-serif text-[16px] font-bold"
              style={{ color: theme.foreground }}
            >
              Hi! I&apos;m {portfolio.identity.firstName}&apos;s Copilot
            </h3>
            <p
              className="font-mono text-[11px] leading-relaxed"
              style={{ color: theme.muted }}
            >
              Ask me anything about their projects, skills, experience, or
              achievements.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.length > 1 && (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                isStreaming={msg.id === streamingId}
              />
            ))}
            {isSending && !streamingId && <TypingIndicator />}
          </div>
        )}

        {/* Suggestion chips */}
        {showSuggestions && (
          <div className="mt-4 grid grid-cols-2 gap-1.5">
            {suggestedQuestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                className="rounded-sm border px-2.5 py-2 text-left font-mono text-[10px] transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = withAlpha(
                    theme.accent,
                    "80",
                  )
                  e.currentTarget.style.color = theme.foreground
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border
                  e.currentTarget.style.color = theme.muted
                }}
              >
                ✦ {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t p-3"
        style={{ borderColor: theme.border }}
      >
        <div className="relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            rows={2}
            placeholder={`Ask about ${portfolio.identity.firstName}'s projects, skills...`}
            className="w-full resize-none rounded-sm border px-3 py-2 pr-10 font-mono text-[11px] outline-none transition-colors disabled:opacity-60"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.foreground,
              maxHeight: "120px",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = theme.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            aria-label="Send message"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor:
                message.trim() && !isSending ? theme.accent : "transparent",
              color:
                message.trim() && !isSending
                  ? theme.accentForeground
                  : theme.subtle,
            }}
          >
            {isSending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </button>
        </div>
        <p
          className="mt-2 text-center font-mono text-[9px]"
          style={{ color: theme.subtle }}
        >
          Press Enter to send · Shift+Enter for new line
        </p>
        <p
          className="mt-1 text-center font-mono text-[9px]"
          style={{ color: theme.subtle }}
        >
          AI can make mistakes · Contact {portfolio.identity.firstName} directly for{" "}
          <span style={{ color: theme.accent }}>important info</span>
        </p>
      </form>
    </div>
  )
}

function ChatBubble({
  msg,
  isStreaming = false,
}: {
  msg: ChatMessage
  isStreaming?: boolean
}) {
  const { theme } = useTheme()
  const isUser = msg.role === "user"

  const bubbleBg = isUser
    ? withAlpha(theme.accent, "1f")
    : theme.surface
  const bubbleBorder = isUser
    ? withAlpha(theme.accent, "55")
    : theme.border
  const textColor = theme.foreground

  return (
    <div
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: isUser
            ? withAlpha(theme.accent, "33")
            : withAlpha(theme.pink, "26"),
          color: isUser ? theme.accent : theme.pink,
        }}
      >
        {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
      </div>
      <div
        className="max-w-[85%] wrap-break-word rounded-md border px-3 py-2 font-mono text-[11px] leading-relaxed"
        style={{
          backgroundColor: bubbleBg,
          borderColor: bubbleBorder,
          color: textColor,
        }}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{msg.content}</span>
        ) : (
          <>
            {msg.content && <MarkdownContent>{msg.content}</MarkdownContent>}
            {isStreaming && (
              <span
                className="ml-0.5 inline-block h-3 w-0.5 animate-pulse align-middle"
                style={{ backgroundColor: theme.accent }}
                aria-hidden="true"
              />
            )}
          </>
        )}
        {!isUser && !isStreaming && msg.source && msg.source !== "faq" && (
          <SourceTag source={msg.source} />
        )}
      </div>
    </div>
  )
}

function SourceTag({ source }: { source: NonNullable<ChatMessage["source"]> }) {
  const { theme } = useTheme()
  const map: Record<NonNullable<ChatMessage["source"]>, { label: string; color: string }> = {
    faq: { label: "FAQ", color: theme.green },
    ai: { label: "AI", color: theme.purple },
    fallback: { label: "Offline", color: theme.subtle },
    error: { label: "Error", color: theme.red },
  }
  const { label, color } = map[source]
  return (
    <span
      className="ml-2 inline-block rounded-sm px-1.5 py-0.5 align-middle font-mono text-[8px] uppercase tracking-wider"
      style={{
        backgroundColor: withAlpha(color, "26"),
        color,
      }}
    >
      {label}
    </span>
  )
}

function TypingIndicator() {
  const { theme } = useTheme()
  return (
    <div className="flex gap-2">
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: withAlpha(theme.pink, "26"),
          color: theme.pink,
        }}
      >
        <Bot className="h-3 w-3" />
      </div>
      <div
        className="rounded-md border px-3 py-2 font-mono text-[11px]"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          color: theme.muted,
        }}
      >
        <span className="inline-flex gap-1">
          <Dot delay="0ms" color={theme.subtle} />
          <Dot delay="150ms" color={theme.subtle} />
          <Dot delay="300ms" color={theme.subtle} />
        </span>
      </div>
    </div>
  )
}

function Dot({ delay, color }: { delay: string; color: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full"
      style={{ backgroundColor: color, animationDelay: delay }}
    />
  )
}
