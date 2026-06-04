"use client"

import { useState, useEffect, useRef } from "react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { X } from "lucide-react"
import { ThemeProvider, useTheme } from "./theme-context"
import { TitleBar } from "./title-bar"
import { ActivityBar } from "./activity-bar"
import { FileExplorer } from "./file-explorer"
import { SearchView } from "./search-view"
import { EditorTabs } from "./editor-tabs"
import { Breadcrumbs } from "./breadcrumbs"
import { ExperienceContent } from "./experience-content"
import { HomeContent } from "./home-content"
import { AboutContent } from "./about-content"
import { ProjectsContent } from "./projects-content"
import { SkillsContent } from "./skills-content"
import { ContactContent } from "./contact-content"
import { ReadmeContent } from "./readme-content"
import { WelcomeContent } from "./welcome-content"
import { ResumeContent } from "./resume-content"
import { AICopilot } from "./ai-copilot"
import { StatusBar } from "./status-bar"
import { Terminal } from "./terminal"
import { CommandPalette } from "./command-palette"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useKeybindings } from "@/hooks/use-keybindings"
import { useURLState } from "@/hooks/use-url-state"
import { withAlpha } from "./themes"
import { portfolio } from "@/lib/portfolio"
import type { Tab } from "./editor-tabs"

const allTabs: Tab[] = [
  { name: "Welcome.md",      ext: "md"   },
  { name: "home.tsx",        ext: "tsx"  },
  { name: "about.html",      ext: "html" },
  { name: "projects.js",     ext: "js"   },
  { name: "skills.json",     ext: "json" },
  { name: "experience.ts",   ext: "ts"   },
  { name: "contact.css",     ext: "css"  },
  { name: "README.md",       ext: "md"   },
  { name: "Resume.pdf",      ext: "pdf"  },
]

export function IDELayout() {
  return (
    <ThemeProvider>
      <IDELayoutInner />
    </ThemeProvider>
  )
}

function IDELayoutInner() {
  const { theme, setThemeName } = useTheme()
  const isLgUp = useMediaQuery("(min-width: 1024px)")
  const isMdUp = useMediaQuery("(min-width: 768px)")
  const { getURLState, setURLState } = useURLState()

  const [activeTab, setActiveTab] = useState("explorer")
  const [activeFile, setActiveFile] = useState("Welcome.md")
  const [openTabs, setOpenTabs] = useState<Tab[]>([allTabs[0]]) // Start with Welcome only
  const [showExplorer, setShowExplorer] = useState(false)
  const [showCopilot, setShowCopilot] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showTerminal, setShowTerminal] = useState(true)
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [sourceControlOpen, setSourceControlOpen] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)
  const gitButtonRef = useRef<HTMLButtonElement>(null)

  // Initialize from URL on mount
  useEffect(() => {
    const urlState = getURLState()
    
    // Check if user has seen welcome before
    const welcomed = localStorage.getItem("portfolio-welcomed")
    setHasSeenWelcome(!!welcomed)

    // Apply URL state if present
    if (urlState.file) {
      const tab = allTabs.find((t) => t.name === urlState.file)
      if (tab) {
        setActiveFile(urlState.file)
        setOpenTabs((prev) => {
          if (prev.some((t) => t.name === urlState.file)) return prev
          return [...prev, tab]
        })
      }
    } else if (welcomed) {
      // If not first time, start with home instead of welcome
      setActiveFile("home.tsx")
      setOpenTabs([allTabs.find((t) => t.name === "home.tsx")!])
    }

    if (urlState.theme) {
      // Cast to ThemeId to handle dynamic theme names
      setThemeName(urlState.theme as any)
    }

    if (urlState.explorer === "true") setShowExplorer(true)
    if (urlState.copilot === "true") setShowCopilot(true)
    if (urlState.terminal === "false") setShowTerminal(false)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount, getURLState/setThemeName intentionally excluded

  // Sync state to URL when it changes (debounced to prevent loops)
  useEffect(() => {
    // Skip sync on initial mount or if in SSR
    if (typeof window === "undefined") return
    
    const timeoutId = setTimeout(() => {
      setURLState({
        file: activeFile,
        theme: theme.name,
        explorer: showExplorer ? "true" : undefined,
        copilot: showCopilot ? "true" : undefined,
        terminal: showTerminal ? undefined : "false",
      })
    }, 100) // Debounce to prevent rapid updates

    return () => clearTimeout(timeoutId)
  }, [activeFile, theme.name, showExplorer, showCopilot, showTerminal])
  // setURLState intentionally excluded from deps to prevent loop

  // Default state per breakpoint (only set if not already set by URL)
  // - On large screens, side panels open by default (docked, no animation).
  // - On small screens, they stay closed so nothing overlays the editor.
  const hasInitialized = useRef(false)
  useEffect(() => {
    // Only run once after mount, don't interfere with URL state
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Only set defaults if URL didn't specify
    const urlState = getURLState()
    if (!urlState.explorer) {
      setShowExplorer(isLgUp)
    }
    if (!urlState.copilot) {
      setShowCopilot(isLgUp)
    }
  }, [isLgUp, getURLState])

  const handleFileSelect = (file: string) => {
    // Mark welcome as seen when navigating away from it
    if (file !== "Welcome.md" && !hasSeenWelcome) {
      localStorage.setItem("portfolio-welcomed", "true")
      setHasSeenWelcome(true)
    }

    setActiveFile(file)
    setOpenTabs((prev) => {
      if (prev.some((t) => t.name === file)) return prev
      const tab = allTabs.find((t) => t.name === file)
      if (tab) return [...prev, tab]
      return prev
    })
    // On mobile, picking a file should close the drawer.
    if (!isLgUp) {
      setShowExplorer(false)
      setShowSearch(false)
    }
  }

  const handleCloseTab = (name: string) => {
    setOpenTabs((prev) => {
      const updated = prev.filter((t) => t.name !== name)
      if (activeFile === name && updated.length > 0) {
        setActiveFile(updated[updated.length - 1].name)
      }
      return updated
    })
  }

  // Ctrl+P / Ctrl+B / Ctrl+L / Ctrl+` / Ctrl+Shift+F — toggles for the IDE chrome.
  // All keybindings live in `hooks/use-keybindings.ts`; this layout owns
  // the panel state so it provides the handlers.
  useKeybindings({
    togglePalette: () => setCommandPaletteOpen((prev) => !prev),
    toggleExplorer: () => setShowExplorer((prev) => !prev),
    toggleCopilot: () => {
      setShowCopilot((prev) => !prev)
      setActiveTab("ai")
    },
    toggleTerminal: () => {
      setShowTerminal((prev) => !prev)
      setIsTerminalMinimized(false)
    },
    toggleSearch: () => {
      setShowSearch((prev) => !prev)
      setActiveTab("search")
    },
  })

  const handleActivityChange = (tab: string) => {
    if (tab === "explorer") {
      setShowExplorer((prev) => !prev)
      if (showSearch) setShowSearch(false)
    } else if (tab === "search") {
      setShowSearch((prev) => !prev)
      if (showExplorer) setShowExplorer(false)
    } else if (tab === "ai") {
      setShowCopilot((prev) => !prev)
    } else if (tab === "terminal") {
      setShowTerminal((prev) => !prev)
      setIsTerminalMinimized(false)
    } else if (tab === "git") {
      return
    }
    setActiveTab(tab)
  }

  // On large screens the panels are docked and resizable.
  const leftPanelDocked = (showExplorer || showSearch) && isLgUp
  const copilotDocked = showCopilot && isLgUp
  // Below lg they render as overlay drawers.
  const leftPanelOverlay = (showExplorer || showSearch) && !isLgUp
  const copilotOverlay = showCopilot && !isLgUp

  // The autoSaveId varies based on which docked panels are mounted so the
  // saved layout matches the panel count.
  const layoutKey = `ide-${leftPanelDocked ? "L" : ""}M${copilotDocked ? "R" : ""}`

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onFileSelect={handleFileSelect}
        onCommand={(id) => {
          if (id === "open-copilot") {
            setShowCopilot(true)
            setActiveTab("ai")
          }
        }}
      />

      <TitleBar onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />

      {/* Body: activity bar (fixed) + resizable panel group + overlay drawers */}
      <div className="relative flex flex-1 overflow-hidden">
        <ActivityBar
          activeTab={activeTab}
          onTabChange={handleActivityChange}
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          gitButtonRef={gitButtonRef}
          sourceControlOpen={sourceControlOpen}
          onSourceControlOpenChange={setSourceControlOpen}
        />

        <PanelGroup
          key={layoutKey}
          direction="horizontal"
          autoSaveId={layoutKey}
          className="flex-1"
        >
          {leftPanelDocked && (
            <>
              <Panel
                id="sidebar"
                order={1}
                defaultSize={16}
                minSize={10}
                maxSize={35}
                collapsible
                collapsedSize={0}
              >
                {showExplorer && (
                  <FileExplorer activeFile={activeFile} onFileSelect={handleFileSelect} />
                )}
                {showSearch && <SearchView onFileSelect={handleFileSelect} />}
              </Panel>
              <ResizeHandle borderColor={theme.border} accent={theme.accent} />
            </>
          )}

          <Panel id="main" order={2} minSize={30}>
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex flex-1 flex-col overflow-hidden">
                <EditorTabs
                  activeTab={activeFile}
                  onTabChange={handleFileSelect}
                  tabs={openTabs}
                  onCloseTab={handleCloseTab}
                  onReorderTabs={setOpenTabs}
                />
                {isMdUp && (
                  <Breadcrumbs path={[portfolio.identity.fullName.toLowerCase().replace(/\s+/g, '-'), "src", activeFile]} />
                )}
                {activeFile === "Welcome.md" && <WelcomeContent onFileSelect={handleFileSelect} />}
                {activeFile === "home.tsx" && <HomeContent />}
                {activeFile === "experience.ts" && <ExperienceContent />}
                {activeFile === "about.html" && <AboutContent />}
                {activeFile === "projects.js" && <ProjectsContent />}
                {activeFile === "skills.json" && <SkillsContent />}
                {activeFile === "contact.css" && <ContactContent />}
                {activeFile === "README.md" && <ReadmeContent />}
                {activeFile === "Resume.pdf" && <ResumeContent />}
              </div>

              {showTerminal && !isTerminalMinimized && (
                <Terminal
                  onClose={() => setShowTerminal(false)}
                  isMinimized={isTerminalMinimized}
                  onToggleMinimize={() => setIsTerminalMinimized((prev) => !prev)}
                />
              )}
            </div>
          </Panel>

          {copilotDocked && (
            <>
              <ResizeHandle borderColor={theme.border} accent={theme.accent} />
              <Panel
                id="copilot"
                order={3}
                defaultSize={22}
                minSize={14}
                maxSize={45}
                collapsible
                collapsedSize={0}
              >
                <AICopilot onClose={() => setShowCopilot(false)} />
              </Panel>
            </>
          )}
        </PanelGroup>

        {/* Mobile / tablet: side panels render as overlay drawers */}
        <Drawer
          open={leftPanelOverlay}
          side="left"
          onClose={() => {
            setShowExplorer(false)
            setShowSearch(false)
          }}
          theme={theme}
          width={isMdUp ? 280 : 260}
          ariaLabel={showExplorer ? "File explorer" : "Search"}
          showCloseButton
        >
          {showExplorer && (
            <FileExplorer activeFile={activeFile} onFileSelect={handleFileSelect} />
          )}
          {showSearch && <SearchView onFileSelect={handleFileSelect} />}
        </Drawer>

        <Drawer
          open={copilotOverlay}
          side="right"
          onClose={() => setShowCopilot(false)}
          theme={theme}
          width={isMdUp ? 340 : 300}
          ariaLabel="AI copilot"
        >
          <AICopilot onClose={() => setShowCopilot(false)} />
        </Drawer>
      </div>

      <StatusBar />
    </div>
  )
}

/**
 * Vertical drag handle between horizontal panels. Mimics the VS Code feel:
 * a 1px divider that lights up on hover/drag.
 */
function ResizeHandle({
  borderColor,
  accent,
}: {
  borderColor: string
  accent: string
}) {
  return (
    <PanelResizeHandle
      className="group relative w-px shrink-0 cursor-col-resize transition-colors"
      style={{ backgroundColor: borderColor }}
    >
      <div
        className="absolute inset-y-0 -left-1 -right-1 z-10 transition-colors group-hover:bg-(--rh-accent) group-data-[resize-handle-state=drag]:bg-(--rh-accent)"
        style={
          {
            "--rh-accent": `${accent}66`,
          } as React.CSSProperties
        }
      />
    </PanelResizeHandle>
  )
}

interface DrawerProps {
  open: boolean
  side: "left" | "right"
  onClose: () => void
  theme: ReturnType<typeof useTheme>["theme"]
  width: number
  ariaLabel: string
  /** Show an X close button overlaid on the drawer (for panels that don't have their own). */
  showCloseButton?: boolean
  children: React.ReactNode
}

/**
 * Slide-in drawer used on small screens for the file explorer and AI copilot.
 * - Backdrop click closes it.
 * - Esc closes it.
 * - Width clamps to 90vw so it never overflows on narrow phones.
 */
function Drawer({
  open,
  side,
  onClose,
  theme,
  width,
  ariaLabel,
  showCloseButton = false,
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const isLeft = side === "left"
  const translate = open ? "translate-x-0" : isLeft ? "-translate-x-full" : "translate-x-full"
  const positionClasses = isLeft ? "left-0" : "right-0"

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`absolute inset-0 z-30 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-hidden={!open}
        className={`absolute top-0 bottom-0 z-40 flex flex-col shadow-2xl transition-transform duration-200 ease-out ${positionClasses} ${translate}`}
        style={{
          width: `min(${width}px, 90vw)`,
          backgroundColor: theme.sidebar,
          borderLeft: isLeft ? "none" : `1px solid ${theme.border}`,
          borderRight: isLeft ? `1px solid ${theme.border}` : "none",
        }}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${ariaLabel}`}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-sm transition-colors"
            style={{
              color: theme.subtle,
              backgroundColor: withAlpha(theme.surface, "cc"),
              border: `1px solid ${theme.border}`,
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>
      </aside>
    </>
  )
}
