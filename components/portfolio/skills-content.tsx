"use client"

import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { portfolio } from "@/lib/portfolio"

const { skills } = portfolio

export function SkillsContent() {
  const { theme } = useTheme()

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-4 text-sm" style={{ color: theme.comment }}>
        <div>// skills.json - Tech stack &amp; tools i actively use</div>
      </div>

      {/* JSON-like interface declaration */}
      <div className="mb-6 text-sm" style={{ color: theme.comment }}>
        interface Skills {"{"} &quot;learning&quot;, &quot;passion&quot;, &quot;masterclass&quot; {"}"}
      </div>

      {/* Skills title */}
      <h1 className="mb-8 text-4xl font-bold" style={{ color: theme.foreground }}>
        Skills
      </h1>

      {/* Skills grid - 2 columns */}
      <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
        {skills.categories.map((category) => (
          <div key={category.title}>
            <div className="mb-4 flex items-center gap-3">
              <h2
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: theme.muted }}
              >
                {category.title}
              </h2>
              <div
                className="flex-1 border-b"
                style={{ borderColor: withAlpha(theme.muted, "40") }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => {
                const color = theme[skill.color] ?? theme.accent
                return (
                  <span
                    key={skill.name}
                    className="rounded border px-2.5 py-1 text-xs font-medium transition-all hover:scale-105"
                    style={{
                      color,
                      backgroundColor: withAlpha(color, "12"),
                      borderColor: withAlpha(color, "40"),
                    }}
                  >
                    {skill.name}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Also familiar with section */}
      <div className="mt-12">
        <h3
          className="mb-4 text-xs font-bold uppercase tracking-widest"
          style={{ color: theme.muted }}
        >
          Also familiar with
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.familiar.map((tech) => (
            <span
              key={tech}
              className="rounded border px-3 py-1 text-xs"
              style={{
                borderColor: withAlpha(theme.muted, "60"),
                color: theme.muted,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
