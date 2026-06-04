"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Sparkles } from "lucide-react"
import { useTheme } from "./theme-context"
import { portfolio } from "@/lib/portfolio"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Command {
  id: string
  label: string
  shortcut?: string
  icon?: React.ReactNode
  action?: () => void
}

interface FileItem {
  name: string
  path: string
  ext: "tsx" | "html" | "js" | "json" | "ts" | "css" | "md" | "pdf"
}

const COMMANDS: Command[] = [
  {
    id: "open-copilot",
    label: `Open ${portfolio.identity.firstName}'s Copilot`,
    shortcut: "Ctrl+Shift+C",
    icon: <Sparkles className="h-4 w-4" />,
  },
]

const FILES: FileItem[] = [
  { name: "Welcome.md", path: "./", ext: "md" },
  { name: "home.tsx", path: "src/", ext: "tsx" },
  { name: "about.html", path: "src/", ext: "html" },
  { name: "projects.js", path: "src/", ext: "js" },
  { name: "skills.json", path: "data/", ext: "json" },
  { name: "experience.ts", path: "src/", ext: "ts" },
  { name: "contact.css", path: "src/", ext: "css" },
  { name: "README.md", path: "./", ext: "md" },
  { name: "Resume.pdf", path: "./", ext: "pdf" },
]

const EXT_COLOR: Record<FileItem["ext"], string> = {
  tsx: "#5EC8FF",
  ts: "#2DA8FF",
  js: "#F7DF1E",
  json: "#FFBD2E",
  html: "#F97316",
  css: "#FF61D8",
  md: "#CCCCCC",
  pdf: "#FF5A5F",
}

const EXT_LABEL: Record<FileItem["ext"], string> = {
  tsx: "TSX",
  ts: "TS",
  js: "JS",
  json: "{}",
  html: "HTM",
  css: "CSS",
  md: "MD",
  pdf: "PDF",
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect?: (file: string) => void
  onCommand?: (commandId: string) => void
}

export function CommandPalette({
  isOpen,
  onClose,
  onFileSelect,
  onCommand,
}: CommandPaletteProps) {
  const { theme } = useTheme()
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredFiles = FILES.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase()),
  )

  const allItems = [...filteredCommands, ...filteredFiles]

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selected = allItems[selectedIndex]
        if (!selected) return

        if ("action" in selected) {
          selected.action?.()
          onCommand?.(selected.id)
        } else {
          onFileSelect?.((selected as FileItem).name)
        }
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, allItems, onClose, onFileSelect, onCommand])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="top-[20%] left-1/2 w-[min(40rem,calc(100vw-2rem))] max-w-none -translate-x-1/2 translate-y-0 gap-0 overflow-hidden border p-0 shadow-2xl sm:max-w-none"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search for files or execute commands
        </DialogDescription>
        <div className="flex flex-col" style={{ backgroundColor: theme.background }}>
          {/* Input area */}
          <div
            className="flex items-center gap-3 border-b px-4 py-3"
            style={{ borderColor: theme.border }}
          >
            <Search className="h-5 w-5 shrink-0" style={{ color: theme.subtle }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Go to file or run command..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-mono text-sm outline-none"
              style={{ color: theme.foreground }}
            />
            <span
              className="rounded-md border px-2 py-1 font-mono text-xs"
              style={{ borderColor: theme.border, color: theme.subtle }}
            >
              Esc
            </span>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {allItems.length === 0 ? (
              <div
                className="px-4 py-8 text-center font-mono text-sm"
                style={{ color: theme.subtle }}
              >
                No results found
              </div>
            ) : (
              <>
                {filteredCommands.length > 0 && (
                  <>
                    <div
                      className="px-4 py-2 font-mono text-xs uppercase tracking-widest"
                      style={{ color: theme.subtle }}
                    >
                      Commands
                    </div>
                    {filteredCommands.map((cmd, idx) => {
                      const isSelected = selectedIndex === idx
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action?.()
                            onCommand?.(cmd.id)
                            onClose()
                          }}
                          className="w-full px-4 py-2 text-left font-mono text-sm transition-colors"
                          style={{
                            backgroundColor: isSelected ? theme.accent : "transparent",
                            color: isSelected ? theme.accentForeground : theme.foreground,
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {cmd.icon && (
                                <span style={{ color: isSelected ? theme.accentForeground : theme.pink }}>
                                  {cmd.icon}
                                </span>
                              )}
                              <span>{cmd.label}</span>
                            </div>
                            {cmd.shortcut && (
                              <span
                                className="text-xs"
                                style={{ color: isSelected ? theme.accentForeground : theme.subtle }}
                              >
                                {cmd.shortcut}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </>
                )}

                {filteredFiles.length > 0 && (
                  <>
                    <div
                      className="px-4 py-2 font-mono text-xs uppercase tracking-widest"
                      style={{
                        color: theme.subtle,
                        borderTopColor: theme.border,
                        borderTopWidth: filteredCommands.length > 0 ? 1 : 0,
                      }}
                    >
                      Files
                    </div>
                    {filteredFiles.map((file, idx) => {
                      const itemIndex = filteredCommands.length + idx
                      const isSelected = selectedIndex === itemIndex
                      return (
                        <button
                          key={file.name}
                          onClick={() => {
                            onFileSelect?.(file.name)
                            onClose()
                          }}
                          className="w-full px-4 py-2 text-left font-mono text-sm transition-colors"
                          style={{
                            backgroundColor: isSelected ? theme.accent : "transparent",
                            color: isSelected ? theme.accentForeground : theme.foreground,
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="flex h-4 w-6 shrink-0 items-center justify-center rounded-sm font-mono text-[8px] font-bold"
                                style={{
                                  color: EXT_COLOR[file.ext],
                                  border: `1px solid ${EXT_COLOR[file.ext]}33`,
                                  background: `${EXT_COLOR[file.ext]}11`,
                                }}
                              >
                                {EXT_LABEL[file.ext]}
                              </span>
                              <span>{file.name}</span>
                            </div>
                            <span
                              className="text-xs"
                              style={{ color: isSelected ? theme.accentForeground : theme.subtle }}
                            >
                              {file.path}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="border-t px-4 py-2 font-mono text-xs"
            style={{ borderColor: theme.border, color: theme.subtle }}
          >
            <div className="flex items-center justify-between">
              <span>↑↓ navigate · ◆ open · Esc close</span>
              <span>Tip: type &quot;copilot&quot; to open AI chat</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
