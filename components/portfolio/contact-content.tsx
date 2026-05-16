"use client"

import { useTheme } from "./theme-context"
import { Send, CheckCircle } from "lucide-react"
import { useState } from "react"
import { withAlpha } from "./themes"
import { Icon } from "./icon"
import { portfolio } from "@/lib/portfolio"

const { contact } = portfolio

export function ContactContent() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", message: "" })
    }, 3000)
  }

  const inputStyles: React.CSSProperties = {
    backgroundColor: theme.surface,
    color: theme.foreground,
    border: `1px solid ${withAlpha(theme.muted, "40")}`,
  }

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        {contact.fileBanner.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <section>
          <h2 className="mb-4 text-xl font-bold" style={{ color: theme.accent }}>
            Send me a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="mb-2 block text-xs font-semibold"
                style={{ color: theme.muted }}
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded px-3 py-2 font-mono text-sm transition-colors focus:outline-none"
                style={inputStyles}
                required
              />
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-semibold"
                style={{ color: theme.muted }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded px-3 py-2 font-mono text-sm transition-colors focus:outline-none"
                style={inputStyles}
                required
              />
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-semibold"
                style={{ color: theme.muted }}
              >
                Message
              </label>
              <textarea
                placeholder="Your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full resize-none rounded px-3 py-2 font-mono text-sm transition-colors focus:outline-none"
                style={inputStyles}
                required
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-75"
              style={{
                backgroundColor: theme.accent,
                color: theme.accentForeground,
              }}
            >
              {submitted ? (
                <>
                  <CheckCircle size={16} />
                  <span>Message Sent!</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Contact Methods */}
        <section>
          <h2 className="mb-4 text-xl font-bold" style={{ color: theme.accent }}>
            Other Ways to Connect
          </h2>
          <div className="space-y-3">
            {contact.methods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg p-4 transition-all hover:opacity-75"
                style={{
                  backgroundColor: withAlpha(theme.surface, "66"),
                  border: `1px solid ${withAlpha(theme.muted, "40")}`,
                }}
              >
                <div className="flex-shrink-0">
                  <Icon
                    name={method.icon}
                    size={24}
                    style={{ color: theme[method.iconColor] ?? theme.accent }}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: theme.foreground }}>
                    {method.label}
                  </div>
                  <div className="text-xs" style={{ color: theme.muted }}>
                    {method.value}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Response time */}
          <div
            className="mt-6 rounded-lg p-4 text-sm"
            style={{
              backgroundColor: withAlpha(theme.green, "1a"),
              border: `1px solid ${withAlpha(theme.green, "66")}`,
              color: theme.green,
            }}
          >
            <div className="mb-1 font-semibold">{contact.responseTime.title}</div>
            <div>{contact.responseTime.message}</div>
          </div>
        </section>
      </div>
    </div>
  )
}
