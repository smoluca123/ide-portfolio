"use client"

import { useId } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "./theme-context"
import type { ThemePalette } from "./themes"
import { withAlpha } from "./themes"
import { useIDEStore } from "@/lib/store/ide-store"
import { absolutePath, relativePath } from "@/lib/file-paths"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export interface Tab {
  name: string
  ext: "tsx" | "html" | "js" | "json" | "ts" | "css" | "md" | "pdf"
}

interface EditorTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Tab[]
  onCloseTab: (name: string) => void
  onReorderTabs: (tabs: Tab[]) => void
}

const EXT_COLOR: Record<Tab["ext"], string> = {
  tsx:  "#5EC8FF",
  ts:   "#2DA8FF",
  js:   "#F7DF1E",
  json: "#FFBD2E",
  html: "#F97316",
  css:  "#569CD6",
  md:   "#519ABA",
  pdf:  "#FF5A5F",
}

function TabFileIcon({ ext }: { ext: Tab["ext"] }) {
  const color = EXT_COLOR[ext]
  return (
    <span
      className="flex h-[14px] w-[20px] shrink-0 items-center justify-center rounded-sm font-mono text-[7px] font-bold"
      style={{ color, border: `1px solid ${color}44`, background: `${color}18` }}
    >
      {ext.toUpperCase().slice(0, 2)}
    </span>
  )
}

interface SortableTabProps {
  tab: Tab
  isActive: boolean
  theme: ThemePalette
  onSelect: () => void
  onClose: (e: React.MouseEvent) => void
  /** Close just this tab (used by the context menu). */
  onCloseSelf: () => void
  /** Position info so the context menu can enable/disable left/right actions. */
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
  onCloseAll: () => void
  onCloseOthers: () => void
  onCloseLeft: () => void
  onCloseRight: () => void
  onReveal: () => void
}

function SortableTab({
  tab,
  isActive,
  theme,
  onSelect,
  onClose,
  onCloseSelf,
  isFirst,
  isLast,
  isOnly,
  onCloseAll,
  onCloseOthers,
  onCloseLeft,
  onCloseRight,
  onReveal,
}: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.name })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    borderColor: theme.border,
    backgroundColor: isActive ? theme.tabActive : theme.tabInactive,
    color: isActive ? theme.foreground : theme.muted,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
    cursor: isDragging ? "grabbing" : "pointer",
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={onSelect}
          className="group relative flex shrink-0 items-center gap-1.5 border-r px-3 transition-colors"
          onMouseEnter={(e) => {
            if (!isActive && !isDragging) {
              e.currentTarget.style.backgroundColor = theme.surfaceHover
              e.currentTarget.style.color = theme.foreground
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive && !isDragging) {
              e.currentTarget.style.backgroundColor = theme.tabInactive
              e.currentTarget.style.color = theme.muted
            }
          }}
        >
          {isActive && (
            <span
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{ backgroundColor: theme.tabActiveAccent }}
            />
          )}
          <TabFileIcon ext={tab.ext} />
          <span className="select-none whitespace-nowrap font-mono text-[12px]">
            {tab.name}
          </span>
          <button
            // Prevent dnd-kit from hijacking the close button click
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label={`Close ${tab.name}`}
            className="flex h-4 w-4 items-center justify-center rounded-sm transition-colors"
            style={{
              color: isActive ? theme.foreground : "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.foreground
              e.currentTarget.style.backgroundColor = withAlpha(theme.border, "80")
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isActive ? theme.foreground : "transparent"
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent
        className="min-w-52 font-mono text-[12px]"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}
      >
        <ContextMenuItem onSelect={onCloseSelf}>
          Close
          <ContextMenuShortcut>Ctrl+W</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled={isOnly} onSelect={onCloseOthers}>
          Close Others
        </ContextMenuItem>
        <ContextMenuItem disabled={isFirst} onSelect={onCloseLeft}>
          Close to the Left
        </ContextMenuItem>
        <ContextMenuItem disabled={isLast} onSelect={onCloseRight}>
          Close to the Right
        </ContextMenuItem>
        <ContextMenuItem onSelect={onCloseAll}>Close All</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => {
            navigator.clipboard?.writeText(absolutePath(tab.name))
            toast.success("Path copied to clipboard")
          }}
        >
          Copy Path
          <ContextMenuShortcut>Ctrl+K Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => {
            navigator.clipboard?.writeText(relativePath(tab.name))
            toast.success("Relative path copied to clipboard")
          }}
        >
          Copy Relative Path
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={onReveal}>Reveal in Explorer</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function EditorTabs({ activeTab, onTabChange, tabs, onCloseTab, onReorderTabs }: EditorTabsProps) {
  const { theme } = useTheme()
  const closeAllTabs = useIDEStore((s) => s.closeAllTabs)
  const closeOtherTabs = useIDEStore((s) => s.closeOtherTabs)
  const closeTabsToLeft = useIDEStore((s) => s.closeTabsToLeft)
  const closeTabsToRight = useIDEStore((s) => s.closeTabsToRight)
  const revealInExplorer = useIDEStore((s) => s.revealInExplorer)
  // Stable id for DndContext so dnd-kit's internal aria-describedby ids are
  // identical on server and client, avoiding hydration mismatches.
  const dndContextId = useId()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tabs.findIndex((t) => t.name === active.id)
    const newIndex = tabs.findIndex((t) => t.name === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorderTabs(arrayMove(tabs, oldIndex, newIndex))
  }

  const closeTab = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    onCloseTab(name)
  }

  return (
    <div
      className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b"
      style={{
        background: theme.titleBar,
        borderColor: theme.border,
      }}
    >
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tabs.map((t) => t.name)} strategy={horizontalListSortingStrategy}>
          {tabs.map((tab, index) => (
            <SortableTab
              key={tab.name}
              tab={tab}
              isActive={activeTab === tab.name}
              theme={theme}
              onSelect={() => onTabChange(tab.name)}
              onClose={(e) => closeTab(e, tab.name)}
              onCloseSelf={() => onCloseTab(tab.name)}
              isFirst={index === 0}
              isLast={index === tabs.length - 1}
              isOnly={tabs.length === 1}
              onCloseAll={closeAllTabs}
              onCloseOthers={() => closeOtherTabs(tab.name)}
              onCloseLeft={() => closeTabsToLeft(tab.name)}
              onCloseRight={() => closeTabsToRight(tab.name)}
              onReveal={() => revealInExplorer(tab.name)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
