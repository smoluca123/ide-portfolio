"use client"

import { GitBranch, AlertCircle, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "./theme-context"
import { ThemePicker } from "./theme-picker"

export function StatusBar() {
  const { theme } = useTheme()
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      )
    }
    update()
    const id = setInterval(update, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex h-6 shrink-0 items-center justify-between gap-2 px-3 font-mono text-[11px]"
      style={{ background: theme.statusBar, color: theme.statusBarText }}
    >
      {/* Left cluster */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex shrink-0 items-center gap-1">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>
        <span className="hidden shrink-0 opacity-80 sm:inline">
          <span className="text-yellow-200">↑1</span>{" "}
          <span className="text-green-200">+3</span>
        </span>
        <div className="flex shrink-0 items-center gap-1 opacity-80">
          <AlertCircle className="h-3 w-3" />
          <span>0</span>
        </div>
        <span className="hidden truncate opacity-70 md:inline">
          Aahana&apos;s Portfolio
        </span>
      </div>

      {/* Right cluster */}
      <div className="flex shrink-0 items-center gap-3 opacity-90">
        <div className="hidden items-center gap-1 sm:flex">
          <Sparkles className="h-3 w-3" />
          <span>Copilot</span>
        </div>
        <span className="hidden md:inline">TypeScript React</span>
        <span className="hidden lg:inline">UTF-8</span>
        <span className="hidden lg:inline">Prettier</span>
        <ThemePicker side="top" align="end" />
        {time && <span className="tabular-nums">{time}</span>}
      </div>
    </div>
  )
}
