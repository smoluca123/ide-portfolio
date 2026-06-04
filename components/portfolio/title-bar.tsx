"use client"

import { Search } from "lucide-react"
import { useTheme } from "./theme-context"
import { portfolio } from "@/lib/portfolio"

const menuItems = ["File", "Edit", "View", "Go", "Run", "Terminal", "Help", "Copilot"]

interface TitleBarProps {
  onCommandPaletteOpen?: () => void
}

export function TitleBar({ onCommandPaletteOpen }: TitleBarProps) {
  const { theme } = useTheme()

  return (
    <div
      className="relative flex h-9 shrink-0 items-center justify-between border-b px-3"
      style={{
        background: theme.titleBar,
        borderColor: theme.border,
      }}
    >
      {/* macOS traffic lights + menu */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 cursor-pointer rounded-full bg-[#FF5F56] transition-opacity hover:opacity-80" />
          <div className="h-3 w-3 cursor-pointer rounded-full bg-[#FFBD2E] transition-opacity hover:opacity-80" />
          <div className="h-3 w-3 cursor-pointer rounded-full bg-[#27C93F] transition-opacity hover:opacity-80" />
        </div>
        <nav className="hidden items-center gap-0.5 md:flex">
          {menuItems.map((item) => (
            <button
              key={item}
              className="rounded-sm px-2 py-1 font-mono text-[11px] transition-colors"
              style={{
                color: theme.foreground,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surface
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Centered command palette */}
      <div
        className="absolute left-1/2 hidden max-w-[60vw] -translate-x-1/2 cursor-pointer items-center gap-2 truncate rounded-md border px-3 py-1 transition-colors sm:flex"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.surface,
        }}
        onClick={onCommandPaletteOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onCommandPaletteOpen?.()
          }
        }}
        aria-label="Open command palette"
      >
        <Search className="h-3 w-3 shrink-0" style={{ color: theme.muted }} />
        <span
          className="truncate font-mono text-[11px]"
          style={{ color: theme.foreground }}
        >
          {portfolio.identity.fullName.toLowerCase().replace(/\s+/g, '-')}&nbsp;:&nbsp;portfolio
        </span>
        <span
          className="hidden shrink-0 rounded-sm px-1 font-mono text-[9px] md:inline"
          style={{
            backgroundColor: theme.background,
            color: theme.muted,
          }}
        >
          Ctrl P
        </span>
      </div>

      {/* Mobile-only compact search trigger */}
      <button
        type="button"
        onClick={onCommandPaletteOpen}
        aria-label="Open command palette"
        className="flex h-7 w-7 items-center justify-center rounded-sm transition-colors sm:hidden"
        style={{ color: theme.muted, backgroundColor: theme.surface }}
      >
        <Search className="h-3.5 w-3.5" />
      </button>

      {/* Spacer */}
      <div className="hidden w-24 sm:block" />
    </div>
  )
}
