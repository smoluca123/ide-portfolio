"use client"

import { Github } from "lucide-react"
import { useTheme } from "./theme-context"

export interface SourceControlProps {
  branch?: string
  commitsAhead?: number
  modified?: number
  added?: number
  deleted?: number
}

export function SourceControl({
  branch = "main",
  commitsAhead = 1,
  modified = 3,
  added = 1,
  deleted = 0,
}: SourceControlProps) {
  const { theme } = useTheme()

  return (
    <div
      className="flex flex-col gap-6 overflow-y-auto p-4 text-sm"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Header */}
      <div className="space-y-4">
        <h2
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: theme.subtle }}
        >
          Source Control
        </h2>

        {/* Branch Info */}
        <div className="rounded-md border p-3" style={{ borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github size={16} style={{ color: theme.accent }} />
              <span className="font-mono" style={{ color: theme.foreground }}>
                {branch}
              </span>
            </div>
            {commitsAhead > 0 && (
              <span className="text-xs" style={{ color: theme.cyan }}>
                ↑ {commitsAhead} commit{commitsAhead !== 1 ? "s" : ""} ahead
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-3">
        <div className="flex justify-around gap-2">
          <Stat label="Modified" value={modified} color={theme.orange} border={theme.border} subtle={theme.subtle} />
          <Stat label="Added" value={added} color={theme.cyan} border={theme.border} subtle={theme.subtle} />
          <Stat label="Deleted" value={deleted} color={theme.red} border={theme.border} subtle={theme.subtle} />
        </div>
      </div>

      {/* GitHub Link */}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs transition-colors hover:opacity-80"
        style={{ color: theme.accent }}
      >
        <span>View on GitHub</span>
        <span>↗</span>
      </a>
    </div>
  )
}

function Stat({
  label,
  value,
  color,
  border,
  subtle,
}: {
  label: string
  value: number
  color: string
  border: string
  subtle: string
}) {
  return (
    <div
      className="flex flex-1 flex-col items-center gap-2 rounded-md border p-4"
      style={{ borderColor: border }}
    >
      <span className="font-mono text-2xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs uppercase tracking-wide" style={{ color: subtle }}>
        {label}
      </span>
    </div>
  )
}
