"use client"

import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"

interface Experience {
  period: string
  title: string
  company: string
  description: string
  techStack: string[]
}

const experiences: Experience[] = [
  {
    period: "2025 - Present",
    title: "Junior Software Developer",
    company: "EduVanceAI",
    description:
      "Building intelligent backend systems and AI integrations for an EdTech platform. ML-powered personalization, RAG pipelines, and scalable APIs serving thousands of learners daily.",
    techStack: ["FastAPI", "Python", "Django", "PostgreSQL", "Docker", "AWS", "GenAI", "React"],
  },
  {
    period: "Jun 2023 – Aug 2023",
    title: "User Experience Designer",
    company: "Zepto Digital Labs",
    description:
      "Designed UI for a simulation platform and improved user experience through design thinking principles. Delivered research-backed interface improvements that enhanced usability.",
    techStack: ["Figma", "UX Research", "Design Thinking", "Prototyping"],
  },
  {
    period: "Jun 2023 – Jul 2023",
    title: "Back End Intern",
    company: "Laser Technologies Pvt Ltd",
    description:
      "Managed and maintained backend systems and databases to support enterprise-level web applications. Ensured uptime, performance, and data integrity across production systems.",
    techStack: ["Backend", "Databases", "SQL", "Web Applications"],
  },
]

export function ExperienceContent() {
  const { theme } = useTheme()

  return (
    <div
      className="flex-1 overflow-y-auto px-10 py-8"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Code comment */}
      <p
        className="mb-5 font-mono text-[13px] italic"
        style={{ color: withAlpha(theme.comment, "cc") }}
      >
        {"// experience.ts - professional journey"}
      </p>

      {/* Hero headline */}
      <h1
        className="mb-3 font-serif text-[52px] font-extrabold leading-none tracking-tight"
        style={{ color: theme.foreground, letterSpacing: "-0.02em" }}
      >
        Experience
      </h1>

      {/* TypeScript interface stub */}
      <p className="mb-10 font-mono text-[13px]">
        <span style={{ color: theme.cyan }}>interface</span>{" "}
        <span style={{ color: theme.accent }}>Career</span>{" "}
        <span style={{ color: theme.cyan }}>extends</span>{" "}
        <span style={{ color: theme.accent }}>Timeline</span>{" "}
        <span style={{ color: withAlpha(theme.foreground, "99") }}>{"{}"}</span>
      </p>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute bottom-0 left-[7px] top-2 w-px"
          style={{ backgroundColor: theme.border }}
        />

        <div className="flex flex-col gap-12">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative pl-10">
              {/* Dot */}
              <div
                className="absolute left-0 top-[3px] h-4 w-4 rounded-full border-2"
                style={{ borderColor: theme.accent, backgroundColor: theme.background }}
              />

              <p
                className="mb-1.5 font-mono text-[12px]"
                style={{ color: theme.muted }}
              >
                {exp.period}
              </p>

              <h2
                className="mb-1 font-serif text-[22px] font-bold leading-snug"
                style={{ color: theme.foreground }}
              >
                {exp.title}
              </h2>

              <p className="mb-3 font-mono text-[13px]">
                <span style={{ color: theme.subtle }}>@ </span>
                <span style={{ color: theme.accent }}>{exp.company}</span>
              </p>

              <p
                className="mb-4 max-w-2xl font-mono text-[13px] leading-relaxed"
                style={{ color: theme.muted }}
              >
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border px-2.5 py-[3px] font-mono text-[11px] font-medium"
                    style={{
                      borderColor: withAlpha(theme.accent, "66"),
                      backgroundColor: withAlpha(theme.accent, "1a"),
                      color: theme.accent,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
