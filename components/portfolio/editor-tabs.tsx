"use client"

import { useId } from "react"
import { X } from "lucide-react"
import { useTheme } from "./theme-context"
import type { ThemePalette } from "./themes"
import { withAlpha } from "./themes"
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
  ext: "tsx" | "html" | "js" | "json" | "ts" | "css" | "md"
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
}

function SortableTab({ tab, isActive, theme, onSelect, onClose }: SortableTabProps) {
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
  )
}

export function EditorTabs({ activeTab, onTabChange, tabs, onCloseTab, onReorderTabs }: EditorTabsProps) {
  const { theme } = useTheme()
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
          {tabs.map((tab) => (
            <SortableTab
              key={tab.name}
              tab={tab}
              isActive={activeTab === tab.name}
              theme={theme}
              onSelect={() => onTabChange(tab.name)}
              onClose={(e) => closeTab(e, tab.name)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
