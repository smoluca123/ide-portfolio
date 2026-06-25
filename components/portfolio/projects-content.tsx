"use client"

import { useState } from "react"
import { useTheme } from "./theme-context"
import { Github, ExternalLink, Code2, ArrowLeft, CheckCircle2, Sparkles, Calendar, UserRound } from "lucide-react"
import { withAlpha } from "./themes"
import { portfolio, type Project } from "@/lib/portfolio"
import { trackProjectView, trackProjectLink } from "@/lib/analytics"

const { projects } = portfolio

export function ProjectsContent() {
  const { theme } = useTheme()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = selectedId ? projects.find((p) => p.id === selectedId) ?? null : null

  const openProject = (project: Project) => {
    setSelectedId(project.id)
    trackProjectView(project.id, project.title)
  }

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        <div>// projects.js - Showcase of work &amp; impact</div>
        <div>// Click a project to open the full case study</div>
      </div>

      {/* Projects grid */}
      <div className="space-y-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => openProject(project)}
            className="group block w-full overflow-hidden rounded-lg border text-left transition-all hover:shadow-lg"
            style={{
              backgroundColor: theme.surface,
              borderColor: withAlpha(theme.muted, "40"),
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = withAlpha(theme.muted, "40"))}
          >
            {/* Project thumbnail placeholder */}
            <div
              className="flex h-32 items-center justify-center p-4 text-center text-sm"
              style={{
                backgroundColor: withAlpha(theme.muted, "15"),
                color: theme.muted,
              }}
            >
              {project.thumbnail}
            </div>

            {/* Project content */}
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold" style={{ color: theme.accent }}>
                  {project.id}. {project.title}
                </h3>
                {project.status && <StatusBadge status={project.status} />}
              </div>

              <p className="text-sm" style={{ color: theme.muted }}>
                {project.description}
              </p>

              <div className="flex items-start gap-2">
                <Code2 size={16} style={{ color: theme.green }} className="mt-0.5 shrink-0" />
                <p className="text-sm" style={{ color: theme.muted }}>
                  <span style={{ color: theme.green }}>Problem:</span> {project.problemSolved}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: withAlpha(theme.accent, "20"),
                      color: theme.accent,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
                  style={{ color: theme.accent }}
                >
                  View case study
                  <ExternalLink size={12} />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const { theme } = useTheme()

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Back link */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-75"
        style={{ color: theme.muted }}
      >
        <ArrowLeft size={14} />
        <span>projects.js</span>
      </button>

      {/* Title block */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: theme.accent }}>
            {project.title}
          </h1>
          {project.status && <StatusBadge status={project.status} />}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: theme.subtle }}>
          {project.year && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} /> {project.year}
            </span>
          )}
          {project.role && (
            <span className="inline-flex items-center gap-1.5">
              <UserRound size={12} /> {project.role}
            </span>
          )}
        </div>
      </div>

      {/* Overview */}
      <p className="mb-6 max-w-2xl text-sm leading-relaxed" style={{ color: theme.foreground }}>
        {project.longDescription ?? project.description}
      </p>

      {/* Tech stack */}
      <Section title="Tech Stack" theme={theme}>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded px-2 py-1 text-xs font-semibold"
              style={{ backgroundColor: withAlpha(theme.accent, "20"), color: theme.accent }}
            >
              {tech}
            </span>
          ))}
        </div>
      </Section>

      {/* The problem */}
      <Section title="The Problem" theme={theme}>
        <p className="max-w-2xl text-sm leading-relaxed" style={{ color: theme.muted }}>
          {project.problemSolved}
        </p>
      </Section>

      {/* Outcomes */}
      {project.outcomes && project.outcomes.length > 0 && (
        <Section title="Impact & Outcomes" theme={theme}>
          <ul className="space-y-2">
            {project.outcomes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: theme.foreground }}>
                <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: theme.green }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Features */}
      {project.features && project.features.length > 0 && (
        <Section title="Key Features" theme={theme}>
          <ul className="space-y-2">
            {project.features.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: theme.muted }}>
                <Sparkles size={15} className="mt-0.5 shrink-0" style={{ color: theme.pink }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}


      {/* Links */}
      <div className="mt-8 flex flex-wrap gap-3">
        {/* GitHub repo links — supports single string or multiple { label, url } entries */}
        {Array.isArray(project.githubUrl) ? (
          project.githubUrl.map((repo) => (
            <a
              key={repo.url + repo.label}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProjectLink(project.id, "github")}
              className="inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ borderColor: theme.border, color: theme.foreground }}
            >
              <Github size={14} />
              <span>{repo.label}</span>
            </a>
          ))
        ) : (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackProjectLink(project.id, "github")}
            className="inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ borderColor: theme.border, color: theme.foreground }}
          >
            <Github size={14} />
            <span>View Code</span>
          </a>
        )}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackProjectLink(project.id, "live")}
          className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: theme.accent, color: theme.accentForeground }}
        >
          <ExternalLink size={14} />
          <span>Live Demo</span>
        </a>
      </div>
    </div>
  )
}

function Section({
  title,
  theme,
  children,
}: {
  title: string
  theme: ReturnType<typeof useTheme>["theme"]
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <h2
        className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: theme.subtle }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: NonNullable<Project["status"]> }) {
  const { theme } = useTheme()
  const color =
    status === "Live" ? theme.green : status === "In Progress" ? theme.yellow : theme.subtle
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: withAlpha(color, "20"), color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  )
}

