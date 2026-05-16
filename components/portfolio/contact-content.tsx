"use client"

import { useTheme } from "./theme-context"
import { Mail, Linkedin, MessageCircle, Github, Send, CheckCircle } from "lucide-react"
import { useState } from "react"
import { withAlpha } from "./themes"

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

  const contactMethods = [
    {
      icon: <Mail size={24} style={{ color: theme.green }} />,
      label: "Email",
      value: "aahana.bobade@example.com",
      href: "mailto:aahana.bobade@example.com",
    },
    {
      icon: <MessageCircle size={24} style={{ color: theme.accent }} />,
      label: "Telegram",
      value: "@aahana_bobade",
      href: "https://t.me/aahana_bobade",
    },
    {
      icon: <Github size={24} style={{ color: theme.pink }} />,
      label: "GitHub",
      value: "github.com/aahana",
      href: "https://github.com/aahana",
    },
    {
      icon: <Linkedin size={24} style={{ color: theme.orange }} />,
      label: "LinkedIn",
      value: "linkedin.com/in/aahana",
      href: "https://linkedin.com/in/aahana",
    },
  ]

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
        <div>// contact.css - Let&apos;s connect &amp; collaborate</div>
        <div>// Always open to interesting projects and discussions</div>
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
            {contactMethods.map((method) => (
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
                <div className="flex-shrink-0">{method.icon}</div>
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
            <div className="mb-1 font-semibold">Response Time</div>
            <div>I typically respond within 24 hours</div>
          </div>
        </section>
      </div>
    </div>
  )
}
