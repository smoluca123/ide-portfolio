"use client"

import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { Icon } from "./icon"
import { RichText } from "./rich-text"
import { portfolio } from "@/lib/portfolio"
import { useIDEStore } from "@/lib/store/ide-store"

const { identity, readme } = portfolio

export function ReadmeContent() {
  const { theme } = useTheme()
  const openFile = useIDEStore((s) => s.openFile)

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Header comment */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        {readme.fileBanner.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Main intro */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold" style={{ color: theme.accent }}>
          {identity.fullName}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>
          {readme.subtitleSegments.map((seg, i) => (
            <span key={seg.text}>
              <span style={{ color: theme[seg.color] ?? theme.accent }}>
                {seg.text}
              </span>
              {i < readme.subtitleSegments.length - 1 && " • "}
            </span>
          ))}
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
          &quot;{readme.mission}&quot;
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold" style={{ color: theme.accent }}>
          Quick Facts
        </h2>
        <div className="grid gap-3 md:grid-cols-4">
          {readme.quickFacts.map((stat) => {
            const color = theme[stat.color] ?? theme.accent
            return (
              <div
                key={stat.label}
                className="rounded p-3"
                style={{ backgroundColor: withAlpha(color, "15") }}
              >
                <div className="text-lg font-bold" style={{ color }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: theme.muted }}>
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation guide */}
      <div>
        <h2 className="mb-4 text-lg font-bold" style={{ color: theme.accent }}>
          Explore This Portfolio
        </h2>
        <div className="space-y-2">
          {readme.navigation.map((item) => (
            <button
              key={item.tab}
              onClick={() => openFile(item.tab)}
              className="flex w-full items-start gap-3 rounded p-3 text-left transition-colors hover:opacity-75"
              style={{ backgroundColor: withAlpha(theme.surface, "40"), cursor: "pointer" }}
            >
              <span style={{ color: theme.green }} className="mt-1 flex-shrink-0">
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <div className="text-sm font-semibold" style={{ color: theme.accent }}>
                  {item.tab}
                </div>
                <div className="text-xs" style={{ color: theme.muted }}>
                  {item.description}
                </div>
              </div>
            </button>
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
          {readme.footer.comment}
        </div>
        <div>
          <RichText text={readme.footer.credit} semibold={false} />
        </div>
      </div>
    </div>
  )
}
