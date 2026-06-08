"use client"

import { useState, useMemo } from "react"
import { Search, FileText, X, Sparkles } from "lucide-react"
import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { portfolio } from "@/lib/portfolio"
import { useIDEStore } from "@/lib/store/ide-store"

interface SearchResult {
  file: string
  section: string
  content: string
  match: string
}

interface SearchViewProps {
  /** Optional override; when omitted the component reads from the IDE store. */
  onFileSelect?: (file: string) => void
}

export function SearchView({ onFileSelect }: SearchViewProps) {
  const { theme } = useTheme()
  const [query, setQuery] = useState("")
  const openFile = useIDEStore((s) => s.openFile)
  const handleSelect = onFileSelect ?? openFile

  // Build search index from portfolio data
  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return []

    const results: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    // Helper to add result with file mapping
    const addResult = (file: string, section: string, content: string) => {
      results.push({ file, section, content, match: lowerQuery })
    }

    // Search in hero/home.tsx
    const heroText = `${portfolio.hero.intro} ${portfolio.hero.description} ${portfolio.hero.taglines.join(" ")} ${portfolio.hero.badges.map(b => b.label).join(" ")} ${portfolio.hero.ctas.map(c => c.label).join(" ")} ${portfolio.socials.map(s => `${s.label} ${s.href}`).join(" ")}`
    if (heroText.toLowerCase().includes(lowerQuery)) {
      addResult("home.tsx", "Hero Section", portfolio.hero.description)
    }

    // Search hero badges specifically
    portfolio.hero.badges.forEach((badge) => {
      if (badge.label.toLowerCase().includes(lowerQuery)) {
        addResult("home.tsx", `Badge: ${badge.label}`, badge.label)
      }
    })

    // Search hero CTAs
    portfolio.hero.ctas.forEach((cta) => {
      if (cta.label.toLowerCase().includes(lowerQuery)) {
        addResult("home.tsx", `CTA: ${cta.label}`, cta.label)
      }
    })

    // Search socials (rendered in home area)
    portfolio.socials.forEach((social) => {
      if (social.label.toLowerCase().includes(lowerQuery)) {
        addResult("home.tsx", `Social: ${social.label}`, social.label)
      }
    })

    // Search in stats (home.tsx)
    portfolio.stats.forEach((stat) => {
      const statText = `${stat.value} ${stat.label}`
      if (statText.toLowerCase().includes(lowerQuery)) {
        addResult("home.tsx", "Stats", `${stat.value} ${stat.label}`)
      }
    })

    // Search in about.html
    const aboutText = `${portfolio.about.fileBanner.join(" ")} ${portfolio.about.professionalSummary.join(" ")} ${portfolio.about.philosophy} ${portfolio.about.milestones.join(" ")}`
    if (aboutText.toLowerCase().includes(lowerQuery)) {
      addResult("about.html", "About Me", portfolio.about.professionalSummary[0])
    }

    // Search about file banner
    portfolio.about.fileBanner.forEach((line) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        addResult("about.html", "Banner", line)
      }
    })

    // Search about interests
    portfolio.about.interests.forEach((interest) => {
      const interestText = `${interest.title} ${interest.description}`
      if (interestText.toLowerCase().includes(lowerQuery)) {
        addResult("about.html", `Interest: ${interest.title}`, interest.description)
      }
    })

    // Search in experiences (experience.ts)
    portfolio.experiences.forEach((exp) => {
      const expText = `${exp.title} ${exp.company} ${exp.description} ${exp.techStack.join(" ")}`
      if (expText.toLowerCase().includes(lowerQuery)) {
        addResult("experience.ts", `${exp.title} at ${exp.company}`, exp.description)
      }
    })

    // Search in projects (projects.js)
    portfolio.projects.forEach((proj) => {
      const projText = `${proj.title} ${proj.description} ${proj.problemSolved} ${proj.techStack.join(" ")}`
      if (projText.toLowerCase().includes(lowerQuery)) {
        addResult("projects.js", proj.title, proj.description)
      }
    })

    // Search in skills (skills.json)
    portfolio.skills.categories.forEach((cat) => {
      // Search category title
      if (cat.title.toLowerCase().includes(lowerQuery)) {
        addResult("skills.json", cat.title, `Category: ${cat.title}`)
      }
      
      // Search individual skills
      cat.skills.forEach((skill) => {
        if (skill.name.toLowerCase().includes(lowerQuery)) {
          addResult("skills.json", `${cat.title} - ${skill.name}`, `${skill.name} (${skill.percentage}%)`)
        }
      })
    })

    // Search familiar skills
    portfolio.skills.familiar.forEach((item) => {
      if (item.toLowerCase().includes(lowerQuery)) {
        addResult("skills.json", "Familiar", item)
      }
    })

    // Search in contact (contact.css)
    portfolio.contact.methods.forEach((method) => {
      const contactText = `${method.label} ${method.value}`
      if (contactText.toLowerCase().includes(lowerQuery)) {
        addResult("contact.css", method.label, method.value)
      }
    })

    // Search contact file banner
    portfolio.contact.fileBanner.forEach((line) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        addResult("contact.css", "Banner", line)
      }
    })

    // Search contact response time
    const responseText = `${portfolio.contact.responseTime.title} ${portfolio.contact.responseTime.message}`
    if (responseText.toLowerCase().includes(lowerQuery)) {
      addResult("contact.css", portfolio.contact.responseTime.title, portfolio.contact.responseTime.message)
    }

    // Search in README.md
    const readmeText = `${portfolio.readme.fileBanner.join(" ")} ${portfolio.readme.mission} ${portfolio.readme.subtitleSegments.map(s => s.text).join(" ")} ${portfolio.readme.quickFacts.map(f => `${f.value} ${f.label}`).join(" ")} ${portfolio.readme.navigation.map(n => `${n.tab} ${n.description}`).join(" ")} ${portfolio.readme.footer.comment} ${portfolio.readme.footer.credit}`
    if (readmeText.toLowerCase().includes(lowerQuery)) {
      addResult("README.md", "Overview", portfolio.readme.mission)
    }

    // Search readme file banner
    portfolio.readme.fileBanner.forEach((line) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        addResult("README.md", "Banner", line)
      }
    })

    // Search readme navigation
    portfolio.readme.navigation.forEach((nav) => {
      const navText = `${nav.tab} ${nav.description}`
      if (navText.toLowerCase().includes(lowerQuery)) {
        addResult("README.md", `Nav: ${nav.tab}`, nav.description)
      }
    })

    // Search readme footer
    if (portfolio.readme.footer.comment.toLowerCase().includes(lowerQuery)) {
      addResult("README.md", "Footer", portfolio.readme.footer.comment)
    }
    if (portfolio.readme.footer.credit.toLowerCase().includes(lowerQuery)) {
      addResult("README.md", "Footer", portfolio.readme.footer.credit)
    }

    // Search in Welcome.md (dynamic content from welcome-content.tsx)
    const welcomeSnippets: { section: string; text: string }[] = [
      { section: "Hero", text: `Welcome to ${portfolio.identity.firstName}'s Portfolio` },
      { section: "Description", text: `A VS Code-inspired interactive portfolio. ${portfolio.identity.roles[0] || "Fullstack Developer"} specializing in building high-performance web applications. Explore projects, skills, and experience through this developer-friendly interface.` },
      { section: "Feature", text: "Interactive IDE" },
      { section: "Feature", text: "Browse like VS Code" },
      { section: "Feature", text: "AI Assistant" },
      { section: "Feature", text: `Ask about ${portfolio.identity.firstName}'s work (Ctrl+L)` },
      { section: "Feature", text: "Live Terminal" },
      { section: "Feature", text: "Run commands (Ctrl+`)" },
      { section: "Recent Files", text: "Personal intro and highlights" },
      { section: "Recent Files", text: "Featured projects showcase" },
      { section: "Recent Files", text: "Professional journey" },
      { section: "Recent Files", text: "Portfolio overview" },
      { section: "Shortcuts", text: "Open command palette" },
      { section: "Shortcuts", text: "Toggle file explorer" },
      { section: "Shortcuts", text: "Toggle AI copilot" },
      { section: "Shortcuts", text: "Toggle terminal" },
      { section: "Shortcuts", text: "Search workspace" },
      { section: "Pro Tip", text: "Pro tip: Press Ctrl+P to quickly jump to any file or command" },
    ]

    welcomeSnippets.forEach((snippet) => {
      if (snippet.text.toLowerCase().includes(lowerQuery)) {
        addResult("Welcome.md", snippet.section, snippet.text)
      }
    })

    // Also search identity names in Welcome.md
    const identityText = `${portfolio.identity.firstName} ${portfolio.identity.lastName} ${portfolio.identity.fullName} ${portfolio.identity.roles.join(" ")}`
    if (identityText.toLowerCase().includes(lowerQuery)) {
      addResult("Welcome.md", "Identity", `${portfolio.identity.fullName} - ${portfolio.identity.roles[0]}`)
    }

    return results
  }, [query])

  const handleResultClick = (file: string) => {
    handleSelect(file)
  }

  return (
    <div
      className="flex h-full flex-col border-r"
      style={{
        backgroundColor: theme.sidebar,
        borderColor: theme.border,
      }}
    >
      {/* Header */}
      <div
        className="shrink-0 border-b px-4 py-3"
        style={{ borderColor: theme.border }}
      >
        <h2
          className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: theme.subtle }}
        >
          Search
        </h2>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: theme.subtle }}
          />
          <input
            type="text"
            placeholder="Search in portfolio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded border bg-transparent py-1.5 pl-8 pr-8 font-mono text-xs outline-none transition-colors"
            style={{
              borderColor: theme.border,
              color: theme.foreground,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = theme.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
              style={{ color: theme.subtle }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.foreground
                e.currentTarget.style.backgroundColor = theme.surface
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.subtle
                e.currentTarget.style.backgroundColor = "transparent"
              }}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!query || query.length < 2 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Search
              className="mb-3 h-12 w-12"
              style={{ color: theme.subtle }}
            />
            <p
              className="mb-2 font-mono text-xs font-semibold"
              style={{ color: theme.foreground }}
            >
              Search Workspace
            </p>
            <p
              className="max-w-[200px] font-mono text-[10px] leading-relaxed"
              style={{ color: theme.subtle }}
            >
              Search across all portfolio content, projects, skills, and experience.
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText
              className="mb-3 h-10 w-10"
              style={{ color: theme.subtle }}
            />
            <p
              className="mb-1 font-mono text-xs font-semibold"
              style={{ color: theme.foreground }}
            >
              No results found
            </p>
            <p
              className="font-mono text-[10px]"
              style={{ color: theme.subtle }}
            >
              Try a different search term
            </p>
          </div>
        ) : (
          <div>
            <div
              className="sticky top-0 border-b px-4 py-2"
              style={{
                backgroundColor: theme.sidebar,
                borderColor: theme.border,
              }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: theme.subtle }}
              >
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} in workspace
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: theme.border }}>
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResultClick(result.file)}
                  className="group flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors"
                  style={{ backgroundColor: theme.sidebar }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.surface
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.sidebar
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FileText
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: theme.accent }}
                    />
                    <span
                      className="truncate font-mono text-xs font-medium"
                      style={{ color: theme.foreground }}
                    >
                      {result.file}
                    </span>
                  </div>
                  <p
                    className="font-mono text-[10px] font-semibold"
                    style={{ color: theme.cyan }}
                  >
                    {result.section}
                  </p>
                  <p
                    className="line-clamp-2 font-mono text-[10px] leading-relaxed"
                    style={{ color: theme.muted }}
                  >
                    {highlightMatch(result.content, result.match, theme)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {query && searchResults.length > 0 && (
        <div
          className="shrink-0 border-t px-4 py-2"
          style={{
            backgroundColor: withAlpha(theme.accent, "10"),
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" style={{ color: theme.accent }} />
            <p
              className="font-mono text-[9px]"
              style={{ color: theme.subtle }}
            >
              Click any result to open that file
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function highlightMatch(text: string, match: string, theme: ReturnType<typeof useTheme>["theme"]) {
  const parts = text.split(new RegExp(`(${match})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === match.toLowerCase() ? (
          <mark
            key={i}
            className="rounded px-0.5"
            style={{
              backgroundColor: withAlpha(theme.accent, "30"),
              color: theme.accent,
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
