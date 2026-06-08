"use client"

import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"
import { Icon } from "./icon"
import { RichText } from "./rich-text"
import { portfolio, type ThemeColorKey } from "@/lib/portfolio"
import { TypeAnimation } from "react-type-animation"
import { useMemo } from "react"
import { useIDEStore } from "@/lib/store/ide-store"

const { identity, hero, stats, socials } = portfolio

interface HomeContentProps {
  /** Optional override; when omitted the component reads from the IDE store. */
  onFileSelect?: (file: string) => void
}

export function HomeContent({ onFileSelect }: HomeContentProps) {
  const { theme } = useTheme()
  const openFile = useIDEStore((s) => s.openFile)
  const handleSelect = onFileSelect ?? openFile

  // Build the typing sequence: type each tagline, hold for ~2s, delete, repeat.
  // `react-type-animation` interleaves strings (to type) and numbers (delays
  // in ms). Passing an empty string after a delay triggers a backspace clear.
  const typeSequence = useMemo(() => {
    const seq: (string | number)[] = []
    for (const line of hero.taglines) {
      seq.push(line, 2200, "", 400)
    }
    return seq
  }, [])

  return (
    <div
      className="flex-1 overflow-y-auto px-10 py-8"
      style={{ backgroundColor: theme.background }}
    >
      {/* Code comment */}
      <p
        className="mb-8 font-mono text-[13px] italic"
        style={{ color: withAlpha(theme.comment, "cc") }}
      >
        {hero.intro}
      </p>

      {/* Hero Name */}
      <div className="mb-8">
        <h1
          className="font-serif text-[84px] font-extrabold leading-none"
          style={{ color: theme.foreground, letterSpacing: "-0.03em" }}
        >
          {identity.firstName}
        </h1>
        <h1
          className="font-serif text-[84px] font-extrabold leading-none"
          style={{ color: theme.pink, letterSpacing: "-0.03em" }}
        >
          {identity.lastName}
        </h1>
      </div>

      {/* Skills badges */}
      <div className="mb-8 flex flex-wrap gap-3">
        {hero.badges.map((badge) => {
          const color = theme[badge.color as ThemeColorKey] ?? theme.muted
          const isMuted = badge.color === "muted"
          return (
            <span
              key={badge.label}
              className="rounded-sm border px-3 py-1.5 font-mono text-[11px] font-medium"
              style={{
                color,
                backgroundColor: isMuted ? "transparent" : withAlpha(color, "1a"),
                borderColor: isMuted
                  ? withAlpha(color, "4d")
                  : withAlpha(color, "66"),
              }}
            >
              {badge.label}
            </span>
          )
        })}
      </div>

      {/* Tagline rotator with typing effect */}
      <p
        className="mb-6 flex min-h-[1.6em] items-center gap-1 font-mono text-[13px]"
        style={{ color: theme.muted }}
      >
        <TypeAnimation
          // Re-mount when the palette key changes so the animation restarts
          // cleanly if the user swaps themes; not strictly necessary but
          // avoids any chance of a stale style snapshot in dev.
          key={theme.id}
          sequence={typeSequence}
          wrapper="span"
          speed={55}
          deletionSpeed={70}
          repeat={Infinity}
          cursor={false}
          className="font-bold"
          style={{ color: theme.pink, display: "inline-block" }}
          aria-label={`${identity.firstName}'s rotating tagline`}
        />
        <span
          className="animate-pulse"
          style={{ color: theme.accent }}
          aria-hidden="true"
        >
          |
        </span>
      </p>

      {/* Description */}
      <p
        className="mb-8 max-w-3xl font-mono text-[14px] leading-relaxed"
        style={{ color: theme.muted }}
      >
        <RichText text={hero.description} />
      </p>

      {/* Action buttons */}
      <div className="mb-16 flex gap-4">
        {hero.ctas.map((cta) => {
          const isPrimary = cta.variant === "primary"
          const fileMap: Record<string, string> = {
            Projects: "projects.js",
            "About Me": "about.html",
            Contact: "contact.css",
          }
          const file = fileMap[cta.label]
          return (
            <button
              key={cta.label}
              onClick={() => file && handleSelect(file)}
              className="flex items-center gap-2 rounded-sm border px-4 py-2 font-mono text-[12px] font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: isPrimary ? theme.accent : "transparent",
                color: isPrimary ? theme.accentForeground : theme.muted,
                borderColor: isPrimary
                  ? withAlpha(theme.accent, "99")
                  : withAlpha(theme.muted, "4d"),
              }}
            >
              <Icon name={cta.icon} size={14} />
              <span>{cta.label}</span>
            </button>
          )
        })}
      </div>

      {/* Stats grid */}
      <div
        className="mb-12 grid grid-cols-4 gap-4 border-b border-t py-8"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(135deg, ${withAlpha(theme.accent, "08")} 0%, ${withAlpha(theme.cyan, "08")} 100%)`,
        }}
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <p
              className="mb-1 font-serif text-[32px] font-bold"
              style={{ color: theme.accent, letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </p>
            <p
              className="font-mono text-[10px] tracking-wide"
              style={{ color: theme.subtle }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div className="flex gap-3">
        {socials.map((link) => (
          <a
            key={link.label}
            href={link.href}
            title={link.label}
            className="rounded-sm border p-2.5 transition-all hover:opacity-80"
            style={{
              backgroundColor: withAlpha(theme.surface, "80"),
              borderColor: theme.border,
              color: theme.subtle,
            }}
          >
            <Icon name={link.icon} size={16} />
          </a>
        ))}
      </div>
    </div>
  )
}
