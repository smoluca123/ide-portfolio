"use client"

import { Play, Keyboard, Coffee, Sparkles, FileText, Code2, Zap } from "lucide-react"
import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { portfolio } from "@/lib/portfolio"
import { useIDEStore } from "@/lib/store/ide-store"

interface WelcomeContentProps {
  /** Optional override; when omitted the component reads from the IDE store. */
  onFileSelect?: (file: string) => void
}

export function WelcomeContent({ onFileSelect }: WelcomeContentProps) {
  const { theme } = useTheme()
  const openFile = useIDEStore((s) => s.openFile)
  const handleSelect = onFileSelect ?? openFile

  // Use data from portfolio.json
  const recentFiles = [
    { name: "home.tsx", desc: "Personal intro and highlights", icon: "🏠" },
    { name: "projects.js", desc: "Featured projects showcase", icon: "⚡" },
    { name: "experience.ts", desc: "Professional journey", icon: "💼" },
    { name: "README.md", desc: "Portfolio overview", icon: "📖" },
  ]

  const shortcuts = [
    { keys: "Ctrl+P", desc: "Open command palette" },
    { keys: "Ctrl+B", desc: "Toggle file explorer" },
    { keys: "Ctrl+L", desc: "Toggle AI copilot" },
    { keys: "Ctrl+`", desc: "Toggle terminal" },
    { keys: "Ctrl+Shift+F", desc: "Search workspace" },
  ]

  // Get name and roles from portfolio data
  const { firstName, lastName, roles } = portfolio.identity
  const mainRole = roles[0] || "Fullstack Developer"

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ backgroundColor: theme.background }}
    >
      <div className="mx-auto max-w-4xl p-8 md:p-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div
            className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: withAlpha(theme.accent, "20"),
              border: `2px solid ${withAlpha(theme.accent, "40")}`,
            }}
          >
            <Sparkles className="h-10 w-10" style={{ color: theme.accent }} />
          </div>
          <h1
            className="mb-3 font-serif text-4xl font-bold md:text-5xl"
            style={{ color: theme.foreground }}
          >
            Welcome to {firstName}'s Portfolio
          </h1>
          <p
            className="mx-auto max-w-2xl font-mono text-sm leading-relaxed md:text-base"
            style={{ color: theme.muted }}
          >
            A VS Code-inspired interactive portfolio. {mainRole} specializing in building 
            high-performance web applications. Explore projects, skills, and experience 
            through this developer-friendly interface.
          </p>
        </div>

        {/* Quick Start Grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {/* Recent Files */}
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" style={{ color: theme.cyan }} />
              <h2
                className="font-mono text-sm font-semibold uppercase tracking-wide"
                style={{ color: theme.foreground }}
              >
                Start Here
              </h2>
            </div>
            <div className="space-y-2">
              {recentFiles.map((file) => (
                <button
                  key={file.name}
                  onClick={() => handleSelect(file.name)}
                  className="group flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.accent
                    e.currentTarget.style.backgroundColor = withAlpha(theme.accent, "10")
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border
                    e.currentTarget.style.backgroundColor = theme.background
                  }}
                >
                  <span className="text-xl">{file.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono text-sm font-medium"
                      style={{ color: theme.foreground }}
                    >
                      {file.name}
                    </div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: theme.subtle }}
                    >
                      {file.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Keyboard className="h-5 w-5" style={{ color: theme.purple }} />
              <h2
                className="font-mono text-sm font-semibold uppercase tracking-wide"
                style={{ color: theme.foreground }}
              >
                Keyboard Shortcuts
              </h2>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span
                    className="font-mono text-xs"
                    style={{ color: theme.muted }}
                  >
                    {shortcut.desc}
                  </span>
                  <kbd
                    className="shrink-0 rounded border px-2 py-1 font-mono text-[10px] font-semibold"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.foreground,
                    }}
                  >
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mb-10">
          <h2
            className="mb-4 font-mono text-sm font-semibold uppercase tracking-wide"
            style={{ color: theme.subtle }}
          >
            Features
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Code2 className="h-5 w-5" />}
              title="Interactive IDE"
              desc="Browse like VS Code"
              color={theme.cyan}
              bgColor={theme.surface}
              borderColor={theme.border}
              textColor={theme.foreground}
              subtleColor={theme.subtle}
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Assistant"
              desc={`Ask about ${firstName}'s work (Ctrl+L)`}
              color={theme.pink}
              bgColor={theme.surface}
              borderColor={theme.border}
              textColor={theme.foreground}
              subtleColor={theme.subtle}
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Live Terminal"
              desc="Run commands (Ctrl+`)"
              color={theme.green}
              bgColor={theme.surface}
              borderColor={theme.border}
              textColor={theme.foreground}
              subtleColor={theme.subtle}
            />
          </div>
        </div>

        {/* Footer Tips */}
        <div
          className="rounded-lg border p-6 text-center"
          style={{
            backgroundColor: withAlpha(theme.accent, "10"),
            borderColor: withAlpha(theme.accent, "30"),
          }}
        >
          <Coffee className="mx-auto mb-2 h-6 w-6" style={{ color: theme.accent }} />
          <p className="font-mono text-xs" style={{ color: theme.muted }}>
            <strong style={{ color: theme.accent }}>Pro tip:</strong> Press{" "}
            <kbd
              className="mx-1 rounded border px-1.5 py-0.5 font-mono text-[10px]"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.foreground,
              }}
            >
              Ctrl+P
            </kbd>{" "}
            to quickly jump to any file or command
          </p>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  subtleColor: string
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
  bgColor,
  borderColor,
  textColor,
  subtleColor,
}: FeatureCardProps) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="mb-2" style={{ color }}>
        {icon}
      </div>
      <h3 className="mb-1 font-mono text-sm font-semibold" style={{ color: textColor }}>
        {title}
      </h3>
      <p className="font-mono text-xs" style={{ color: subtleColor }}>
        {desc}
      </p>
    </div>
  )
}
