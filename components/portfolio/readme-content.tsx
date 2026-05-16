"use client"

import { useTheme } from "./theme-context"
import { ArrowRight, BookOpen, Code2, Eye, Zap } from "lucide-react"
import { withAlpha } from "./themes"

export function ReadmeContent() {
  const { theme } = useTheme()

  const navigationItems = [
    { tab: "home.tsx", icon: <Eye size={18} />, description: "My personal intro and core stats" },
    { tab: "experience.ts", icon: <Code2 size={18} />, description: "Professional journey and roles" },
    { tab: "about.html", icon: <BookOpen size={18} />, description: "Background, philosophy, and interests" },
    { tab: "projects.js", icon: <Zap size={18} />, description: "Featured projects and impact" },
    { tab: "skills.json", icon: <Code2 size={18} />, description: "Technical expertise by category" },
    { tab: "contact.css", icon: <ArrowRight size={18} />, description: "Get in touch and connect" },
  ]

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Header comment */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        <div>// README.md - Welcome to Aahana&apos;s Portfolio</div>
        <div>// A fullstack developer&apos;s playground and professional showcase</div>
      </div>

      {/* Main intro */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold" style={{ color: theme.accent }}>
          Aahana Bobade
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>
          <span style={{ color: theme.accent }}>Fullstack Developer</span> •{" "}
          <span style={{ color: theme.green }}>Problem Solver</span> •{" "}
          <span style={{ color: theme.accent }}>Perpetual Learner</span>
        </p>
      </div>

      {/* Mission statement */}
      <div
        className="mb-8 rounded-lg border-l-4 p-4"
        style={{
          borderColor: theme.accent,
          backgroundColor: withAlpha(theme.accent, "10"),
        }}
      >
        <p className="text-sm" style={{ color: theme.muted }}>
          &quot;Building high-performance web products that prioritize user experience and technical
          excellence. From concept to production, I obsess over code quality, performance
          optimization, and solving real problems.&quot;
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold" style={{ color: theme.accent }}>
          Quick Facts
        </h2>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { value: "3+", label: "Years Experience", color: theme.accent },
            { value: "10+", label: "Projects Built", color: theme.green },
            { value: "100%", label: "Commitment", color: theme.pink },
            { value: "∞", label: "Learning", color: theme.orange },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded p-3"
              style={{ backgroundColor: withAlpha(stat.color, "15") }}
            >
              <div className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: theme.muted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation guide */}
      <div>
        <h2 className="mb-4 text-lg font-bold" style={{ color: theme.accent }}>
          Explore This Portfolio
        </h2>
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded p-3 transition-colors hover:opacity-75"
              style={{ backgroundColor: withAlpha(theme.surface, "40") }}
            >
              <span style={{ color: theme.green }} className="mt-1 flex-shrink-0">
                {item.icon}
              </span>
              <div>
                <div className="text-sm font-semibold" style={{ color: theme.accent }}>
                  {item.tab}
                </div>
                <div className="text-xs" style={{ color: theme.muted }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-8 rounded p-4 text-center text-xs"
        style={{
          backgroundColor: withAlpha(theme.accent, "10"),
          color: theme.muted,
        }}
      >
        <div style={{ color: theme.comment }} className="mb-2">
          // Built with React, Next.js &amp; Tailwind CSS
        </div>
        <div>
          Designed &amp; developed by{" "}
          <span style={{ color: theme.accent }}>Aahana Bobade</span>
        </div>
      </div>
    </div>
  )
}
