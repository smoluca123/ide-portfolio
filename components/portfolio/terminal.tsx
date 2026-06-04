"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { X, ChevronUp, ChevronDown, TerminalSquare, AlertCircle, FileText } from "lucide-react"
import { useTheme } from "./theme-context"
import { ThemePicker } from "./theme-picker"
import { portfolio } from "@/lib/portfolio"

interface HistoryEntry {
  type: "command" | "output" | "error" | "success" | "info"
  content: string
  timestamp?: Date
}

const COMMANDS: Record<string, { description: string; output: string | string[] }> = {
  help: {
    description: "Show available commands",
    output: [
      "Available commands:",
      "",
      "  help      - Show this help message",
      "  clear     - Clear terminal history",
      `  about     - Learn about ${portfolio.identity.firstName}`,
      "  skills    - View technical skills",
      "  projects  - List featured projects",
      "  contact   - Get contact information",
      "  theme     - Cycle to the next colour theme",
      "  whoami    - Display current user",
      "  pwd       - Print working directory",
      "  date      - Display current date and time",
      "  exit      - Close the terminal panel",
      "",
      "Tip: Use Tab for autocomplete, Arrow keys for history",
    ],
  },
  about: {
    description: `Learn about ${portfolio.identity.firstName}`,
    output: [
      "┌─────────────────────────────────────────────┐",
      `│  ${portfolio.identity.fullName.padEnd(43)} │`,
      `│  ${portfolio.identity.roles[0].padEnd(43)} │`,
      "│                                             │",
      "│  Passionate about building intelligent      │",
      "│  backend systems and AI integrations.       │",
      `│  Currently working at ${portfolio.experiences[0]?.company || 'building cool stuff'}.${' '.repeat(Math.max(0, 23 - (portfolio.experiences[0]?.company || 'building cool stuff').length))} │`,
      "└─────────────────────────────────────────────┘",
    ],
  },
  skills: {
    description: "View technical skills",
    output: [
      "Technical Skills:",
      "",
      "  Languages   : Python, TypeScript, JavaScript, SQL",
      "  Backend     : FastAPI, Django, Node.js, PostgreSQL",
      "  Frontend    : React, Next.js, Tailwind CSS",
      "  DevOps      : Docker, AWS, CI/CD, Git",
      "  AI/ML       : RAG Pipelines, LangChain, GenAI",
    ],
  },
  projects: {
    description: "List featured projects",
    output: [
      "Featured Projects:",
      "",
      "  1. EdTech AI Platform",
      "     ML-powered personalization for learners",
      "",
      "  2. Portfolio IDE",
      "     VS Code inspired portfolio (you are here!)",
      "",
      "  3. Backend API Framework",
      "     Scalable FastAPI microservices template",
    ],
  },
  contact: {
    description: "Get contact information",
    output: [
      "Contact Information:",
      "",
      `  Email    : ${portfolio.contact.methods.find(m => m.label === 'Email')?.value || 'N/A'}`,
      `  GitHub   : ${portfolio.contact.methods.find(m => m.label === 'GitHub')?.value || 'N/A'}`,
      `  LinkedIn : ${portfolio.contact.methods.find(m => m.label === 'LinkedIn')?.value || 'N/A'}`,
    ],
  },
  whoami: {
    description: "Display current user",
    output: portfolio.identity.firstName.toLowerCase(),
  },
  pwd: {
    description: "Print working directory",
    output: `/home/${portfolio.identity.firstName.toLowerCase()}/portfolio`,
  },
  date: {
    description: "Display current date",
    output: "",
  },
  theme: {
    description: "Cycle theme",
    output: "",
  },
  clear: {
    description: "Clear terminal",
    output: "",
  },
  exit: {
    description: "Close terminal",
    output: "Closing terminal...",
  },
}

const SUGGESTIONS = ["help", "about", "skills", "projects", "contact", "theme"]

interface TerminalProps {
  onClose?: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function Terminal({ onClose, isMinimized = false, onToggleMinimize }: TerminalProps) {
  const { theme, cycleTheme } = useTheme()
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "success", content: "Welcome! Type 'help' to see available commands." },
  ])
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeTab, setActiveTab] = useState<"terminal" | "problems" | "output">("terminal")

  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal becomes visible
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMinimized])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    setHistory((prev) => [...prev, { type: "command", content: `$ ${cmd}` }])
    if (trimmed) {
      setCommandHistory((prev) => [...prev.filter((c) => c !== trimmed), trimmed])
    }
    setHistoryIndex(-1)

    if (!trimmed) return

    if (trimmed === "clear") {
      setHistory([])
      return
    }

    if (trimmed === "exit") {
      setHistory((prev) => [...prev, { type: "output", content: "Closing terminal..." }])
      setTimeout(() => onClose?.(), 500)
      return
    }

    if (trimmed === "theme") {
      cycleTheme()
      setHistory((prev) => [
        ...prev,
        { type: "success", content: `Theme cycled` },
      ])
      return
    }

    if (trimmed === "date") {
      const now = new Date()
      setHistory((prev) => [...prev, { type: "output", content: now.toLocaleString() }])
      return
    }

    const command = COMMANDS[trimmed]
    if (command) {
      const output = Array.isArray(command.output) ? command.output : [command.output]
      output.forEach((line) => {
        if (line) {
          setHistory((prev) => [...prev, { type: "output", content: line }])
        }
      })
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: "error",
          content: `Command not found: ${trimmed}. Type 'help' for available commands.`,
        },
      ])
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input)
      setInput("")
      setShowSuggestions(false)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const matches = Object.keys(COMMANDS).filter((cmd) => cmd.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
        setShowSuggestions(false)
      } else if (matches.length > 1) {
        setShowSuggestions(true)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const filteredSuggestions = input
    ? Object.keys(COMMANDS).filter((cmd) => cmd.startsWith(input.toLowerCase()))
    : []

  const tabs = [
    { id: "terminal" as const, label: "TERMINAL", icon: TerminalSquare },
    { id: "problems" as const, label: "PROBLEMS", icon: AlertCircle },
    { id: "output" as const, label: "OUTPUT", icon: FileText },
  ]

  if (isMinimized) {
    return null
  }

  return (
    <div
      className="flex flex-col border-t"
      style={{ background: theme.terminalBg, borderColor: theme.border }}
    >
      {/* Terminal Header with Tabs */}
      <div
        className="flex h-9 items-center justify-between border-b px-2"
        style={{ background: theme.terminalHeader, borderColor: theme.border }}
      >
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors"
              style={{
                color: activeTab === tab.id ? theme.foreground : theme.subtle,
                borderBottom:
                  activeTab === tab.id ? `2px solid ${theme.accent}` : "2px solid transparent",
              }}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <ThemePicker
            side="top"
            align="end"
            className="text-[10px]"
            iconOnly
            title="Choose colour theme"
          />
          <button
            onClick={onToggleMinimize}
            className="rounded p-1 transition-colors"
            style={{ color: theme.subtle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.surface)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Minimize terminal"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleMinimize}
            className="rounded p-1 transition-colors"
            style={{ color: theme.subtle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.surface)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Maximize terminal"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded p-1 transition-colors"
            style={{ color: theme.subtle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.surface)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Close terminal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex flex-1 flex-col" style={{ minHeight: "200px", maxHeight: "300px" }}>
        {activeTab === "terminal" ? (
          <>
            {/* Output Area */}
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((entry, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap"
                  style={{
                    color:
                      entry.type === "command"
                        ? theme.terminalText
                        : entry.type === "error"
                          ? theme.terminalError
                          : entry.type === "success"
                            ? theme.terminalSuccess
                            : entry.type === "info"
                              ? theme.cyan
                              : theme.terminalComment,
                  }}
                >
                  {entry.content}
                </div>
              ))}

              {/* Autocomplete suggestions */}
              {showSuggestions && filteredSuggestions.length > 1 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion)
                        setShowSuggestions(false)
                        inputRef.current?.focus()
                      }}
                      className="rounded border px-2 py-0.5 font-mono text-[11px] transition-colors"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: theme.surface,
                        color: theme.accent,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom section with input */}
            <div className="border-t" style={{ borderColor: theme.border }}>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="font-mono text-[13px]" style={{ color: theme.terminalPromptUser }}>
                  {portfolio.identity.firstName.toLowerCase()}
                </span>
                <span className="font-mono text-[13px]" style={{ color: theme.terminalPromptHost }}>
                  @portfolio
                </span>
                <span className="font-mono text-[13px]" style={{ color: theme.subtle }}>
                  : ~ $
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent font-mono text-[13px] outline-none"
                  style={{ color: theme.foreground }}
                  placeholder="Type a command..."
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </>
        ) : activeTab === "problems" ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="font-mono text-[13px]" style={{ color: theme.subtle }}>
              No problems detected in workspace.
            </p>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="font-mono text-[13px]" style={{ color: theme.subtle }}>
              No output to display.
            </p>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      {activeTab === "terminal" && (
        <div
          className="flex flex-wrap items-center gap-2 border-t px-3 py-2"
          style={{ background: theme.terminalHeader, borderColor: theme.border }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-wide"
            style={{ color: theme.subtle }}
          >
            Try:
          </span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setInput(suggestion)
                inputRef.current?.focus()
              }}
              className="rounded border px-2 py-0.5 font-mono text-[10px] transition-colors"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.surface,
                color: theme.foreground,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.accent
                e.currentTarget.style.color = theme.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border
                e.currentTarget.style.color = theme.foreground
              }}
            >
              {suggestion}
            </button>
          ))}
          <span
            className="ml-auto rounded px-2 py-0.5 font-mono text-[10px]"
            style={{ backgroundColor: theme.surface, color: theme.accent }}
          >
            {theme.name}
          </span>
        </div>
      )}
    </div>
  )
}
