"use client"

import { ChevronRight } from "lucide-react"
import { useTheme } from "./theme-context"

interface BreadcrumbsProps {
  path: string[]
}

export function Breadcrumbs({ path }: BreadcrumbsProps) {
  const { theme } = useTheme()

  return (
    <div
      className="flex h-7 shrink-0 items-center gap-1 border-b px-4 font-mono text-[11px]"
      style={{
        backgroundColor: theme.background,
        color: theme.muted,
        borderColor: theme.border,
      }}
    >
      {path.map((segment, i) => {
        const isLast = i === path.length - 1
        return (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" style={{ color: theme.subtle }} />}
            <span
              className="cursor-pointer transition-colors"
              style={{ color: isLast ? theme.foreground : theme.muted }}
            >
              {segment}
            </span>
          </div>
        )
      })}
    </div>
  )
}
