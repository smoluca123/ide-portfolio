"use client"

import { useTheme } from "./theme-context"
import { Github, Linkedin, Mail, Globe, BookOpen, Code2 } from "lucide-react"
import { withAlpha } from "./themes"

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Globe, label: "Medium", href: "#" },
  { icon: BookOpen, label: "Tableau", href: "#" },
  { icon: Code2, label: "LeetCode", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
]

const stats = [
  { value: "3+", label: "YEARS" },
  { value: "10+", label: "PROJECTS" },
  { value: "∞", label: "CURIOSITY" },
  { value: "↑", label: "ALWAYS LEARNING" },
]

export function HomeContent() {
  const { theme } = useTheme()

  return (
    <div
      className="flex-1 overflow-y-auto px-10 py-8"
      style={{ backgroundColor: theme.background }}
    >
      {/* Code comment */}
      <p
        className="mb-8 font-mono text-[13px] italic"
        style={{ color: withAlpha(theme.comment, "cc") }}
      >
        {"// hello world !! Welcome to my portfolio"}
      </p>

      {/* Hero Name */}
      <div className="mb-8">
        <h1
          className="font-serif text-[84px] font-extrabold leading-none"
          style={{ color: theme.foreground, letterSpacing: "-0.03em" }}
        >
          Aahana
        </h1>
        <h1
          className="font-serif text-[84px] font-extrabold leading-none"
          style={{ color: theme.pink, letterSpacing: "-0.03em" }}
        >
          Bobade
        </h1>
      </div>

      {/* Skills badges */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Badge color={theme.muted} bg="transparent" border={withAlpha(theme.muted, "4d")}>
          Backend Engineer
        </Badge>
        <Badge color={theme.accent} bg={withAlpha(theme.accent, "1a")} border={withAlpha(theme.accent, "66")}>
          AI / ML Dev
        </Badge>
        <Badge color={theme.green} bg={withAlpha(theme.green, "1a")} border={withAlpha(theme.green, "66")}>
          Data Scientist
        </Badge>
        <Badge color={theme.pink} bg={withAlpha(theme.pink, "1a")} border={withAlpha(theme.pink, "66")}>
          EduVanceAI
        </Badge>
      </div>

      {/* Turning text with cursor */}
      <p className="mb-6 font-mono text-[13px]" style={{ color: theme.muted }}>
        <span className="font-bold" style={{ color: theme.pink }}>
          Turning
        </span>{" "}
        <span className="animate-pulse" style={{ color: theme.accent }}>
          |
        </span>
      </p>

      {/* Description */}
      <p
        className="mb-8 max-w-3xl font-mono text-[14px] leading-relaxed"
        style={{ color: theme.muted }}
      >
        I live at the crossroads of{" "}
        <span className="font-semibold" style={{ color: theme.accent }}>
          backend engineering
        </span>
        ,{" "}
        <span className="font-semibold" style={{ color: theme.accent }}>
          AI/ML
        </span>
        , and{" "}
        <span className="font-semibold" style={{ color: theme.accent }}>
          data science
        </span>
        . I build systems that are genuinely{" "}
        <span className="font-semibold" style={{ color: theme.cyan }}>
          intelligent
        </span>{" "}
        and{" "}
        <span className="font-semibold" style={{ color: theme.cyan }}>
          scalable
        </span>
        .
      </p>

      {/* Action buttons */}
      <div className="mb-16 flex gap-4">
        <button
          className="rounded-sm border px-4 py-2 font-mono text-[12px] font-semibold transition-all"
          style={{
            backgroundColor: theme.accent,
            color: theme.accentForeground,
            borderColor: withAlpha(theme.accent, "99"),
          }}
        >
          <span>▶</span> Projects
        </button>
        <button
          className="rounded-sm border bg-transparent px-4 py-2 font-mono text-[12px] font-semibold transition-all hover:opacity-80"
          style={{
            color: theme.muted,
            borderColor: withAlpha(theme.muted, "4d"),
          }}
        >
          <span style={{ marginRight: "6px" }}>ℹ</span> About Me
        </button>
        <button
          className="rounded-sm border bg-transparent px-4 py-2 font-mono text-[12px] font-semibold transition-all hover:opacity-80"
          style={{
            color: theme.muted,
            borderColor: withAlpha(theme.muted, "4d"),
          }}
        >
          <span style={{ marginRight: "6px" }}>✉</span> Contact
        </button>
      </div>

      {/* Stats grid */}
      <div
        className="mb-12 grid grid-cols-4 gap-4 border-b border-t py-8"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(135deg, ${withAlpha(theme.accent, "08")} 0%, ${withAlpha(theme.cyan, "08")} 100%)`,
        }}
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <p
              className="mb-1 font-serif text-[32px] font-bold"
              style={{ color: theme.accent, letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </p>
            <p
              className="font-mono text-[10px] tracking-wide"
              style={{ color: theme.subtle }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div className="flex gap-3">
        {socialLinks.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.label}
              href={link.href}
              title={link.label}
              className="rounded-sm border p-2.5 transition-all hover:opacity-80"
              style={{
                backgroundColor: withAlpha(theme.surface, "80"),
                borderColor: theme.border,
                color: theme.subtle,
              }}
            >
              <Icon size={16} />
            </a>
          )
        })}
      </div>
    </div>
  )
}

function Badge({
  children,
  color,
  bg,
  border,
}: {
  children: React.ReactNode
  color: string
  bg: string
  border: string
}) {
  return (
    <span
      className="rounded-sm border px-3 py-1.5 font-mono text-[11px] font-medium"
      style={{ color, backgroundColor: bg, borderColor: border }}
    >
      {children}
    </span>
  )
}
