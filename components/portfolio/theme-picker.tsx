"use client"

import { Check, Palette } from "lucide-react"
import { useTheme } from "./theme-context"
import type { ThemeId } from "./themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ThemePickerProps {
  /** Visual style of the trigger button. Defaults to "ghost" (status bar style). */
  variant?: "ghost" | "icon"
  /** Optional className for trigger override (e.g. status bar text colour). */
  className?: string
  /** Hide the textual theme name (icon-only). */
  iconOnly?: boolean
  /** Title attribute on the trigger. */
  title?: string
  /** Side the dropdown should pop on. Defaults to "top" (good for status bar). */
  side?: "top" | "bottom" | "left" | "right"
  /** Alignment for popper. */
  align?: "start" | "center" | "end"
}

export function ThemePicker({
  variant = "ghost",
  className,
  iconOnly = false,
  title = "Switch theme",
  side = "top",
  align = "end",
}: ThemePickerProps) {
  const { theme, themeId, themes, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={title}
          aria-label={title}
          className={
            "flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-white/20 " +
            (variant === "icon" ? "px-1 " : "") +
            (className ?? "")
          }
        >
          <Palette className="h-3 w-3" />
          {!iconOnly && <span className="font-mono text-[11px]">{theme.name}</span>}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        className="min-w-[220px]"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          color: theme.foreground,
        }}
      >
        <DropdownMenuLabel
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: theme.subtle }}
        >
          Color Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: theme.border }} />

        {themes.map((t) => {
          const isActive = t.id === themeId
          return (
            <DropdownMenuItem
              key={t.id}
              onSelect={() => setTheme(t.id as ThemeId)}
              className="flex cursor-pointer items-center gap-2 font-mono text-[12px]"
              style={{
                color: isActive ? t.accent : theme.foreground,
              }}
            >
              {/* Mini palette preview */}
              <span
                className="flex h-4 w-6 shrink-0 items-center overflow-hidden rounded-sm border"
                style={{ borderColor: t.border }}
                aria-hidden
              >
                <span className="h-full w-1/3" style={{ backgroundColor: t.background }} />
                <span className="h-full w-1/3" style={{ backgroundColor: t.accent }} />
                <span className="h-full w-1/3" style={{ backgroundColor: t.pink }} />
              </span>
              <span className="flex-1">{t.name}</span>
              {isActive && <Check className="h-3.5 w-3.5" style={{ color: t.accent }} />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
