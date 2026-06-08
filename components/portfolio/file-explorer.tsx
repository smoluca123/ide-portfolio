"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"
import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { portfolio } from "@/lib/portfolio"
import { useIDEStore } from "@/lib/store/ide-store"
import { absolutePath, relativePath } from "@/lib/file-paths"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export interface FileEntry {
  name: string
  ext: "tsx" | "html" | "js" | "json" | "ts" | "css" | "md" | "pdf"
}

interface FileExplorerProps {
  /** Optional overrides; when omitted the component reads from the IDE store. */
  activeFile?: string
  onFileSelect?: (file: string) => void
}

const files: FileEntry[] = [
  { name: "Welcome.md",        ext: "md"   },
  { name: "home.tsx",          ext: "tsx"  },
  { name: "about.html",        ext: "html" },
  { name: "projects.js",       ext: "js"   },
  { name: "skills.json",       ext: "json" },
  { name: "experience.ts",     ext: "ts"   },
  { name: "contact.css",       ext: "css"  },
  { name: "README.md",         ext: "md"   },
  { name: "Resume.pdf",        ext: "pdf"  },
]

const EXT_COLOR: Record<FileEntry["ext"], string> = {
  tsx:  "#5EC8FF",
  ts:   "#2DA8FF",
  js:   "#F7DF1E",
  json: "#FFBD2E",
  html: "#F97316",
  css:  "#FF61D8",
  md:   "#CCCCCC",
  pdf:  "#FF5A5F",
}

const EXT_LABEL: Record<FileEntry["ext"], string> = {
  tsx:  "TSX",
  ts:   "TS",
  js:   "JS",
  json: "{}",
  html: "HTM",
  css:  "CSS",
  md:   "MD",
  pdf:  "PDF",
}

function FileIcon({ ext }: { ext: FileEntry["ext"] }) {
  const color = EXT_COLOR[ext]
  return (
    <span
      className="flex h-4 w-[26px] shrink-0 items-center justify-center rounded-sm font-mono text-[8px] font-bold"
      style={{
        color,
        border: `1px solid ${color}33`,
        background: `${color}11`,
      }}
    >
      {EXT_LABEL[ext]}
    </span>
  )
}

export function FileExplorer({ activeFile: activeFileProp, onFileSelect }: FileExplorerProps) {
  const [open, setOpen] = useState(true)
  const { theme } = useTheme()
  const storeActiveFile = useIDEStore((s) => s.activeFile)
  const openFile = useIDEStore((s) => s.openFile)
  const openTabs = useIDEStore((s) => s.openTabs)
  const closeTab = useIDEStore((s) => s.closeTab)
  const activeFile = activeFileProp ?? storeActiveFile
  const handleSelect = onFileSelect ?? openFile
  const username = portfolio.identity.fullName.toLowerCase().replace(/\s+/g, '-')

  return (
    <div
      className="flex h-full w-full min-w-0 shrink-0 flex-col border-r"
      style={{
        background: theme.sidebar,
        borderColor: theme.border,
      }}
    >
      {/* Section label */}
      <div className="px-4 pb-1 pt-3">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: theme.subtle }}
        >
          Portfolio
        </span>
      </div>

      {/* Folder toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 px-3 py-1 text-left transition-colors"
        style={{ color: theme.foreground }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = withAlpha(theme.surface, "60")
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"
        }}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="font-mono text-[12px]">{username}</span>
      </button>

      {/* Files */}
      {open && (
        <div className="flex flex-col pl-2">
          {files.map((file) => {
            const isActive = activeFile === file.name
            const isOpen = openTabs.some((t) => t.name === file.name)
            return (
              <ContextMenu key={file.name}>
                <ContextMenuTrigger asChild>
                  <button
                    onClick={() => handleSelect(file.name)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-3 py-[5px] text-left font-mono text-[12px] transition-colors",
                    )}
                    style={{
                      backgroundColor: isActive ? theme.surface : "transparent",
                      color: theme.foreground,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = withAlpha(theme.surface, "60")
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent"
                      }
                    }}
                  >
                    <FileIcon ext={file.ext} />
                    <span className="truncate">{file.name}</span>
                    {isActive && (
                      <span
                        className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: theme.tabActiveAccent }}
                      />
                    )}
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent
                  className="min-w-52 font-mono text-[12px]"
                  style={{ backgroundColor: theme.background, borderColor: theme.border }}
                >
                  <ContextMenuItem onSelect={() => handleSelect(file.name)}>
                    Open
                  </ContextMenuItem>
                  <ContextMenuItem disabled={!isOpen} onSelect={() => closeTab(file.name)}>
                    Close
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onSelect={() => {
                      navigator.clipboard?.writeText(absolutePath(file.name))
                      toast.success("Path copied to clipboard")
                    }}
                  >
                    Copy Path
                  </ContextMenuItem>
                  <ContextMenuItem
                    onSelect={() => {
                      navigator.clipboard?.writeText(relativePath(file.name))
                      toast.success("Relative path copied to clipboard")
                    }}
                  >
                    Copy Relative Path
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}
        </div>
      )}

      {/* Copilot badge at bottom */}
      <div className="mt-auto p-3">
        <div
          className="flex items-center gap-2 rounded-sm border px-3 py-2"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }}
        >
          <span className="font-mono text-[10px]" style={{ color: theme.pink }}>
            ✦ {portfolio.identity.firstName}&apos;s
          </span>
          <span className="font-mono text-[10px]" style={{ color: theme.foreground }}>
            Copilot
          </span>
          <span
            className="ml-auto rounded-sm border px-1 font-mono text-[9px]"
            style={{
              borderColor: withAlpha(theme.cyan, "80"),
              color: theme.cyan,
            }}
          >
            open
          </span>
        </div>
      </div>
    </div>
  )
}
