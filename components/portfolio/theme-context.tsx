"use client"

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react"
import { themes, defaultThemeId, themeList, type ThemeId, type ThemePalette } from "./themes"

interface ThemeContextType {
  /** Current theme id (e.g. "dracula"). */
  themeId: ThemeId
  /** Resolved colour palette for the current theme. Read tokens from this. */
  theme: ThemePalette
  /** Switch to a specific theme by id. */
  setTheme: (id: ThemeId) => void
  /** Cycle to the next available theme (handy for keyboard shortcut / button). */
  cycleTheme: () => void
  /** All registered themes, in declaration order, for pickers. */
  themes: ThemePalette[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const STORAGE_KEY = "portfolio-theme"

function isThemeId(value: string): value is ThemeId {
  return Object.prototype.hasOwnProperty.call(themes, value)
}

/**
 * Push palette tokens into CSS variables on <html> so:
 * - Tailwind tokens (`bg-background`, `text-foreground`, ...) follow the theme
 * - Custom tokens defined in globals.css (`--surface`, `--accent-pink`, ...) too
 */
function applyThemeVars(palette: ThemePalette) {
  if (typeof document === "undefined") return
  const root = document.documentElement

  // data-theme is a stable hook for theme-specific CSS (scrollbar, etc.)
  root.dataset.theme = palette.id

  const cssVars: Record<string, string> = {
    // Core shadcn tokens
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--card": palette.background,
    "--card-foreground": palette.foreground,
    "--popover": palette.surface,
    "--popover-foreground": palette.foreground,
    "--primary": palette.foreground,
    "--primary-foreground": palette.background,
    "--secondary": palette.surface,
    "--secondary-foreground": palette.foreground,
    "--muted": palette.surface,
    "--muted-foreground": palette.muted,
    "--accent": palette.accent,
    "--accent-foreground": palette.accentForeground,
    "--destructive": palette.error,
    "--destructive-foreground": palette.foreground,
    "--border": palette.border,
    "--input": palette.surface,
    "--ring": palette.accent,

    // Sidebar tokens
    "--sidebar": palette.sidebar,
    "--sidebar-foreground": palette.foreground,
    "--sidebar-primary": palette.accent,
    "--sidebar-primary-foreground": palette.accentForeground,
    "--sidebar-accent": palette.surface,
    "--sidebar-accent-foreground": palette.foreground,
    "--sidebar-border": palette.border,
    "--sidebar-ring": palette.accent,

    // Custom tokens used in globals.css / consumers
    "--surface": palette.surface,
    "--accent-pink": palette.pink,
    "--accent-cyan": palette.cyan,
    "--accent-blue": palette.accent,
    "--accent-electric": palette.accentSecondary,
    "--title-bar": palette.titleBar,
    "--tab-active": palette.tabActive,
    "--tab-inactive": palette.tabInactive,
    "--status-bar": palette.statusBar,

    // Terminal tokens
    "--terminal-bg": palette.terminalBg,
    "--terminal-header": palette.terminalHeader,
    "--terminal-text": palette.terminalText,
    "--terminal-success": palette.terminalSuccess,
    "--terminal-error": palette.terminalError,
    "--terminal-prompt-user": palette.terminalPromptUser,
    "--terminal-prompt-host": palette.terminalPromptHost,
    "--terminal-comment": palette.terminalComment,
  }

  for (const [key, value] of Object.entries(cssVars)) {
    root.style.setProperty(key, value)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(defaultThemeId)

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    const resolved: ThemeId = saved && isThemeId(saved) ? saved : defaultThemeId
    setThemeIdState(resolved)
    applyThemeVars(themes[resolved])
  }, [])

  const setTheme = (id: ThemeId) => {
    if (!isThemeId(id)) return
    setThemeIdState(id)
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id)
    applyThemeVars(themes[id])
  }

  const cycleTheme = () => {
    const ids = themeList.map((t) => t.id) as ThemeId[]
    const idx = ids.indexOf(themeId)
    const next = ids[(idx + 1) % ids.length]
    setTheme(next)
  }

  const value = useMemo<ThemeContextType>(
    () => ({
      themeId,
      theme: themes[themeId],
      setTheme,
      cycleTheme,
      themes: themeList,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeId],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return ctx
}

export type { ThemePalette, ThemeId } from "./themes"
