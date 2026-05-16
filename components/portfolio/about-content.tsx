"use client"

import { useTheme } from "./theme-context"
import { Code2, Coffee, Guitar } from "lucide-react"
import { withAlpha } from "./themes"

export function AboutContent() {
  const { theme } = useTheme()

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        <div>// about.html - Aahana&apos;s Professional &amp; Personal Story</div>
        <div>// Fullstack Developer | Problem Solver | Coffee &amp; Code Enthusiast</div>
      </div>

      <div className="space-y-8">
        {/* Professional Summary */}
        <section>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: theme.accent }}>
            Professional Summary
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: theme.muted }}>
            <p>
              I&apos;m a <span style={{ color: theme.accent }}>fullstack developer</span> with{" "}
              <span style={{ color: theme.accent }}>3+ years</span> of experience building
              high-performance web applications. My expertise spans from crafting seamless user
              interfaces to architecting scalable backend systems.
            </p>
            <p>
              Specializing in <span style={{ color: theme.accent }}>Next.js</span>,{" "}
              <span style={{ color: theme.accent }}>React</span>, and{" "}
              <span style={{ color: theme.accent }}>PostgreSQL</span>, I focus on technical SEO
              optimization and delivering products that prioritize user experience. I believe great
              software solves real problems elegantly.
            </p>
          </div>
        </section>

        {/* Key Milestones */}
        <section>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: theme.accent }}>
            Key Milestones
          </h2>
          <ul className="space-y-3 text-sm" style={{ color: theme.muted }}>
            {[
              <>
                Developed <span style={{ color: theme.accent }}>Ling&apos;s Home</span> - A
                comprehensive digital service management platform that streamlined operations for
                100+ businesses
              </>,
              <>
                Mastered <span style={{ color: theme.accent }}>technical SEO</span> and{" "}
                <span style={{ color: theme.accent }}>performance optimization</span>, improving
                page load times by 60% on average
              </>,
              <>
                Built <span style={{ color: theme.accent }}>AI-powered features</span> and{" "}
                <span style={{ color: theme.accent }}>ML integrations</span> as part of EdTech
                solutions
              </>,
              <>
                Contributed to <span style={{ color: theme.accent }}>10+ production projects</span>{" "}
                across e-commerce, SaaS, and education sectors
              </>,
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span style={{ color: theme.accent }} className="mt-1">
                  ›
                </span>
                <span>{item}</span>
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
            {[
              { icon: Code2, title: "Coding", desc: "Exploring new technologies and open-source contributions" },
              { icon: Coffee, title: "Coffee", desc: "My fuel for debugging, thinking, and solving problems" },
              { icon: Guitar, title: "Guitar", desc: "Balancing technical precision with creative expression" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-md border p-3"
                style={{ borderColor: withAlpha(theme.muted, "40") }}
              >
                <Icon size={20} style={{ color: theme.accent }} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-xs" style={{ color: theme.muted }}>
                    {desc}
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
              &quot;Great software is built on three pillars:{" "}
              <span style={{ color: theme.accent }}>clean code</span>,{" "}
              <span style={{ color: theme.accent }}>user empathy</span>, and{" "}
              <span style={{ color: theme.accent }}>continuous learning</span>. I strive to create
              products that are not just functional, but truly delightful to use.&quot;
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
