import { create } from "zustand"
import type { Tab } from "@/components/portfolio/editor-tabs"
import { trackFileOpen } from "@/lib/analytics"

/**
 * Canonical list of files/tabs available in the IDE. Kept here so the store
 * (and any consumer) can resolve a file name to a full `Tab` without duplicating
 * the list across components.
 */
export const ALL_TABS: Tab[] = [
  { name: "Welcome.md",    ext: "md"   },
  { name: "home.tsx",      ext: "tsx"  },
  { name: "about.html",    ext: "html" },
  { name: "projects.js",   ext: "js"   },
  { name: "skills.json",   ext: "json" },
  { name: "experience.ts", ext: "ts"   },
  { name: "contact.css",   ext: "css"  },
  { name: "README.md",     ext: "md"   },
  { name: "Resume.pdf",    ext: "pdf"  },
]

export type ActivityTab = "explorer" | "search" | "ai" | "terminal" | "git"

interface IDEState {
  // --- file / tabs ---
  activeFile: string
  openTabs: Tab[]
  activeTab: ActivityTab

  // --- panels ---
  showExplorer: boolean
  showSearch: boolean
  showCopilot: boolean
  showTerminal: boolean
  isTerminalMinimized: boolean

  // --- overlays ---
  commandPaletteOpen: boolean
  sourceControlOpen: boolean

  // --- misc ---
  hasSeenWelcome: boolean
  /** Whether the viewport is >= lg. Synced from the layout's media query. */
  isLgUp: boolean
}

interface IDEActions {
  // file / tabs
  /**
   * Open a file in the editor. On small screens (`isLgUp === false`) the left
   * drawer is closed automatically so the editor isn't covered.
   * Also flips `hasSeenWelcome` (and persists it) the first time the user
   * navigates away from Welcome.md.
   */
  openFile: (file: string) => void
  closeTab: (name: string) => void
  /** Close every open tab. */
  closeAllTabs: () => void
  /** Close all tabs except the given one. */
  closeOtherTabs: (name: string) => void
  /** Close all tabs to the left of the given one. */
  closeTabsToLeft: (name: string) => void
  /** Close all tabs to the right of the given one. */
  closeTabsToRight: (name: string) => void
  reorderTabs: (tabs: Tab[]) => void
  setActiveFile: (file: string) => void

  // panels — toggle
  toggleExplorer: () => void
  toggleSearch: () => void
  toggleCopilot: () => void
  toggleTerminal: () => void
  toggleTerminalMinimized: () => void

  // panels — set directly
  setShowExplorer: (v: boolean) => void
  setShowSearch: (v: boolean) => void
  setShowCopilot: (v: boolean) => void
  setShowTerminal: (v: boolean) => void

  // activity bar
  setActiveTab: (tab: ActivityTab) => void
  handleActivityChange: (tab: ActivityTab) => void
  /** Open the file explorer (and the file) — used by "Reveal in Explorer". */
  revealInExplorer: (file: string) => void

  // overlays
  setCommandPaletteOpen: (v: boolean) => void
  toggleCommandPalette: () => void
  setSourceControlOpen: (v: boolean) => void

  // welcome
  markWelcomeSeen: () => void
  setHasSeenWelcome: (v: boolean) => void
  setIsLgUp: (v: boolean) => void

  // bulk hydrate (restore from URL on mount)
  hydrateFromURL: (partial: Partial<IDEState>) => void
}

export type IDEStore = IDEState & IDEActions

export const useIDEStore = create<IDEStore>((set, get) => ({
  // ---- initial state ----
  activeFile: "Welcome.md",
  openTabs: [ALL_TABS[0]],
  activeTab: "explorer",
  showExplorer: false,
  showSearch: false,
  showCopilot: false,
  showTerminal: true,
  isTerminalMinimized: false,
  commandPaletteOpen: false,
  sourceControlOpen: false,
  hasSeenWelcome: false,
  isLgUp: true,

  // ---- file / tabs ----
  openFile: (file) => {
    const { hasSeenWelcome, openTabs, isLgUp } = get()

    trackFileOpen(file)

    // Mark welcome as seen when navigating away from it.
    if (file !== "Welcome.md" && !hasSeenWelcome) {
      if (typeof window !== "undefined") {
        localStorage.setItem("portfolio-welcomed", "true")
      }
      set({ hasSeenWelcome: true })
    }

    const tab = ALL_TABS.find((t) => t.name === file)
    const alreadyOpen = openTabs.some((t) => t.name === file)
    const nextTabs = alreadyOpen || !tab ? openTabs : [...openTabs, tab]

    set({
      activeFile: file,
      openTabs: nextTabs,
      // On mobile, picking a file should close the left drawer.
      ...(isLgUp ? {} : { showExplorer: false, showSearch: false }),
    })
  },

  closeTab: (name) => {
    const { openTabs, activeFile } = get()
    const updated = openTabs.filter((t) => t.name !== name)
    set({
      openTabs: updated,
      activeFile:
        activeFile === name && updated.length > 0
          ? updated[updated.length - 1].name
          : activeFile,
    })
  },

  closeAllTabs: () => set({ openTabs: [] }),

  closeOtherTabs: (name) => {
    const tab = get().openTabs.find((t) => t.name === name)
    if (!tab) return
    set({ openTabs: [tab], activeFile: name })
  },

  closeTabsToLeft: (name) => {
    const { openTabs, activeFile } = get()
    const index = openTabs.findIndex((t) => t.name === name)
    if (index <= 0) return
    const updated = openTabs.slice(index)
    // If the active tab was among those removed, focus the target tab.
    const stillOpen = updated.some((t) => t.name === activeFile)
    set({ openTabs: updated, activeFile: stillOpen ? activeFile : name })
  },

  closeTabsToRight: (name) => {
    const { openTabs, activeFile } = get()
    const index = openTabs.findIndex((t) => t.name === name)
    if (index === -1 || index === openTabs.length - 1) return
    const updated = openTabs.slice(0, index + 1)
    const stillOpen = updated.some((t) => t.name === activeFile)
    set({ openTabs: updated, activeFile: stillOpen ? activeFile : name })
  },

  reorderTabs: (tabs) => set({ openTabs: tabs }),
  setActiveFile: (file) => set({ activeFile: file }),

  // ---- panels: toggle ----
  toggleExplorer: () => set((s) => ({ showExplorer: !s.showExplorer })),
  toggleSearch: () => set((s) => ({ showSearch: !s.showSearch })),
  toggleCopilot: () => set((s) => ({ showCopilot: !s.showCopilot, activeTab: "ai" })),
  toggleTerminal: () =>
    set((s) => ({ showTerminal: !s.showTerminal, isTerminalMinimized: false })),
  toggleTerminalMinimized: () =>
    set((s) => ({ isTerminalMinimized: !s.isTerminalMinimized })),

  // ---- panels: set ----
  setShowExplorer: (v) => set({ showExplorer: v }),
  setShowSearch: (v) => set({ showSearch: v }),
  setShowCopilot: (v) => set({ showCopilot: v }),
  setShowTerminal: (v) => set({ showTerminal: v }),

  // ---- activity bar ----
  setActiveTab: (tab) => set({ activeTab: tab }),
  handleActivityChange: (tab) => {
    const s = get()
    if (tab === "explorer") {
      set({ showExplorer: !s.showExplorer, ...(s.showSearch ? { showSearch: false } : {}), activeTab: tab })
    } else if (tab === "search") {
      set({ showSearch: !s.showSearch, ...(s.showExplorer ? { showExplorer: false } : {}), activeTab: tab })
    } else if (tab === "ai") {
      set({ showCopilot: !s.showCopilot, activeTab: tab })
    } else if (tab === "terminal") {
      set({ showTerminal: !s.showTerminal, isTerminalMinimized: false, activeTab: tab })
    } else if (tab === "git") {
      // Source control is driven by a popover; don't change the active tab.
      return
    }
  },

  revealInExplorer: (file) => {
    const tab = ALL_TABS.find((t) => t.name === file)
    set({
      showExplorer: true,
      showSearch: false,
      activeTab: "explorer",
      activeFile: file,
      ...(tab && !get().openTabs.some((t) => t.name === file)
        ? { openTabs: [...get().openTabs, tab] }
        : {}),
    })
  },

  // ---- overlays ----
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setSourceControlOpen: (v) => set({ sourceControlOpen: v }),

  // ---- welcome ----
  markWelcomeSeen: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-welcomed", "true")
    }
    set({ hasSeenWelcome: true })
  },
  setHasSeenWelcome: (v) => set({ hasSeenWelcome: v }),
  setIsLgUp: (v) => set({ isLgUp: v }),

  // ---- hydrate ----
  hydrateFromURL: (partial) => set(partial),
}))
