"use client"

import { Files, Search, GitBranch, Sparkles, Settings, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "./theme-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SourceControl } from "./source-control"

interface ActivityBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onCommandPaletteOpen?: () => void
  gitButtonRef?: React.Ref<HTMLButtonElement>
  sourceControlOpen?: boolean
  onSourceControlOpenChange?: (open: boolean) => void
}

const topItems = [
  { id: "explorer", icon: Files,     label: "Explorer" },
  { id: "search",   icon: Search,    label: "Search" },
  { id: "git",      icon: GitBranch, label: "Source Control" },
  { id: "terminal", icon: Terminal,  label: "Terminal" },
  { id: "ai",       icon: Sparkles,  label: "AI Copilot" },
]

export function ActivityBar({
  activeTab,
  onTabChange,
  onCommandPaletteOpen,
  gitButtonRef,
  sourceControlOpen = false,
  onSourceControlOpenChange,
}: ActivityBarProps) {
  const { theme } = useTheme()

  return (
    <div
      className="flex h-full w-12 shrink-0 flex-col items-center justify-between border-r py-2"
      style={{
        background: theme.sidebar,
        borderColor: theme.border,
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {topItems.map(({ id, icon: Icon, label }) => {
          // Wrap git button in Popover
          if (id === "git") {
            return (
              <Popover key={id} open={sourceControlOpen} onOpenChange={onSourceControlOpenChange}>
                <PopoverTrigger asChild>
                  <button
                    ref={gitButtonRef}
                    title={label}
                    aria-label={label}
                    className={cn("relative flex h-10 w-10 items-center justify-center rounded-sm transition-colors")}
                    style={{
                      color: activeTab === id ? theme.foreground : theme.muted,
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== id) e.currentTarget.style.color = theme.foreground
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== id) e.currentTarget.style.color = theme.muted
                    }}
                  >
                    {activeTab === id && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-sm"
                        style={{ backgroundColor: theme.tabActiveAccent }}
                      />
                    )}
                    <Icon className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="start"
                  className="w-80 p-0"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <SourceControl />
                </PopoverContent>
              </Popover>
            )
          }

          return (
            <button
              key={id}
              title={label}
              onClick={() => {
                if (id === "search") {
                  onCommandPaletteOpen?.()
                } else {
                  onTabChange(id)
                }
              }}
              aria-label={label}
              className={cn("relative flex h-10 w-10 items-center justify-center rounded-sm transition-colors")}
              style={{
                color: activeTab === id ? theme.foreground : theme.muted,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== id) e.currentTarget.style.color = theme.foreground
              }}
              onMouseLeave={(e) => {
                if (activeTab !== id) e.currentTarget.style.color = theme.muted
              }}
            >
              {activeTab === id && (
                <span
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-sm"
                  style={{ backgroundColor: theme.tabActiveAccent }}
                />
              )}
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <button
          title="Settings"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-sm transition-colors"
          style={{ color: theme.muted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.foreground
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.muted
          }}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
