"use client"

import { Github, Star, GitFork, AlertCircle, GitCommit, Globe } from "lucide-react"
import { useTheme } from "./theme-context"
import { useGithubRepo } from "@/hooks/use-github-repo"
import { withAlpha } from "./themes"
import { portfolio } from "@/lib/portfolio"

/** Displayed while data is being fetched */
function Skeleton({ color, subtle }: { color: string; subtle: string }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 rounded-md" style={{ backgroundColor: withAlpha(color, "15") }} />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 rounded-md" style={{ backgroundColor: withAlpha(color, "10") }} />
        <div className="h-16 rounded-md" style={{ backgroundColor: withAlpha(color, "10") }} />
      </div>
      <div className="h-12 rounded-md" style={{ backgroundColor: withAlpha(color, "10") }} />
      <div className="h-4 w-32 rounded" style={{ backgroundColor: withAlpha(subtle, "20") }} />
    </div>
  )
}

export function SourceControl() {
  const { theme } = useTheme()
  const { data, isLoading, error } = useGithubRepo()

  // GitHub profile URL fallback
  const githubUrl = portfolio.socials.find((s) => s.label === "GitHub")?.href ?? "https://github.com"
  const repoUrl = data ? `https://github.com/${data.fullName}` : githubUrl

  return (
    <div
      className="flex flex-col gap-5 overflow-y-auto p-4 text-sm"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Header */}
      <h2
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: theme.subtle }}
      >
        Source Control
      </h2>

      {isLoading && <Skeleton color={theme.accent} subtle={theme.subtle} />}

      {!isLoading && error && (
        <div
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs"
          style={{ borderColor: theme.red, color: theme.red, backgroundColor: withAlpha(theme.red, "10") }}
        >
          <AlertCircle size={14} />
          <span>Could not load repo data</span>
        </div>
      )}

      {!isLoading && !error && !data && (
        <p className="text-xs" style={{ color: theme.subtle }}>
          Configure <code className="font-mono">GITHUB_TOKEN</code> and{" "}
          <code className="font-mono">GITHUB_REPO</code> in <code className="font-mono">.env</code> to see
          live repository stats.
        </p>
      )}

      {!isLoading && data && (
        <>
          {/* Branch + visibility */}
          <div className="rounded-md border p-3" style={{ borderColor: theme.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github size={15} style={{ color: theme.accent }} />
                <span className="font-mono text-sm" style={{ color: theme.foreground }}>
                  {data.defaultBranch}
                </span>
              </div>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
                style={{
                  backgroundColor: withAlpha(data.visibility === "public" ? theme.green : theme.orange, "20"),
                  color: data.visibility === "public" ? theme.green : theme.orange,
                }}
              >
                {data.visibility}
              </span>
            </div>

            {/* Repo name */}
            <p className="mt-1.5 font-mono text-xs" style={{ color: theme.muted }}>
              {data.fullName}
            </p>

            {data.description && (
              <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.subtle }}>
                {data.description}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              icon={<Star size={13} />}
              label="Stars"
              value={data.stars}
              color={theme.yellow}
              border={theme.border}
              subtle={theme.subtle}
            />
            <StatCard
              icon={<GitFork size={13} />}
              label="Forks"
              value={data.forks}
              color={theme.cyan}
              border={theme.border}
              subtle={theme.subtle}
            />
            {data.totalCommits !== null && (
              <StatCard
                icon={<GitCommit size={13} />}
                label="Commits"
                value={data.totalCommits}
                color={theme.green}
                border={theme.border}
                subtle={theme.subtle}
              />
            )}
            {data.language && (
              <StatCard
                icon={<Globe size={13} />}
                label="Language"
                value={data.language}
                color={theme.accent}
                border={theme.border}
                subtle={theme.subtle}
              />
            )}
          </div>

          {/* Latest commit */}
          {data.latestCommit && (
            <div className="rounded-md border p-3" style={{ borderColor: theme.border }}>
              <p className="mb-1 text-[10px] uppercase tracking-wider" style={{ color: theme.subtle }}>
                Latest Commit
              </p>
              <p className="font-mono text-xs leading-snug" style={{ color: theme.foreground }}>
                {data.latestCommit.message}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <code
                  className="rounded px-1 py-0.5 font-mono text-[10px]"
                  style={{ backgroundColor: withAlpha(theme.accent, "15"), color: theme.accent }}
                >
                  {data.latestCommit.sha}
                </code>
                <span className="text-[10px]" style={{ color: theme.muted }}>
                  by {data.latestCommit.author}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* GitHub link — always visible */}
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-75"
        style={{ color: theme.accent }}
      >
        <Github size={13} />
        <span>View on GitHub</span>
        <span>↗</span>
      </a>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  border: string
  subtle: string
}

function StatCard({ icon, label, value, color, border, subtle }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 rounded-md border p-3"
      style={{ borderColor: border }}
    >
      <div className="flex items-center gap-1" style={{ color }}>
        {icon}
        <span className="font-mono text-lg font-bold">{value}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wide" style={{ color: subtle }}>
        {label}
      </span>
    </div>
  )
}
