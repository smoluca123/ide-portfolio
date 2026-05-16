"use client"

import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { Icon } from "./icon"
import { RichText } from "./rich-text"
import { portfolio } from "@/lib/portfolio"

const { about } = portfolio

export function AboutContent() {
  const { theme } = useTheme()

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        {about.fileBanner.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Professional Summary */}
        <section>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: theme.accent }}>
            Professional Summary
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: theme.muted }}>
            {about.professionalSummary.map((paragraph, i) => (
              <p key={i}>
                <RichText text={paragraph} semibold={false} />
              </p>
            ))}
          </div>
        </section>

        {/* Key Milestones */}
        <section>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: theme.accent }}>
            Key Milestones
          </h2>
          <ul className="space-y-3 text-sm" style={{ color: theme.muted }}>
            {about.milestones.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span style={{ color: theme.accent }} className="mt-1">
                  ›
                </span>
                <span>
                  <RichText text={item} semibold={false} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Personal Interests */}
        <section>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: theme.accent }}>
            Beyond the Code
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {about.interests.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-md border p-3"
                style={{ borderColor: withAlpha(theme.muted, "40") }}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  style={{ color: theme.accent }}
                  className="mt-1 flex-shrink-0"
                />
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs" style={{ color: theme.muted }}>
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: theme.accent }}>
            My Philosophy
          </h2>
          <div
            className="rounded-md border border-l-4 p-4"
            style={{ borderColor: theme.accent, borderLeftColor: theme.accent }}
          >
            <p className="text-sm" style={{ color: theme.muted }}>
              &quot;<RichText text={about.philosophy} semibold={false} />&quot;
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
