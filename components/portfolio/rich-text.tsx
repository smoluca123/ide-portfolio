"use client"

import { Fragment } from "react"
import { useTheme } from "./theme-context"
import type { ThemeColorKey } from "@/lib/portfolio"

interface RichTextProps {
  /**
   * Plain string with inline markers:
   * - `**text**` -> styled with `boldColor` (default: theme.accent), bold weight
   * - `__text__` -> styled with `italicColor` (default: theme.cyan), bold weight
   *
   * Markers may not be nested; nested or unbalanced markers fall through as
   * plain text. Whitespace inside markers is preserved.
   */
  text: string
  /** Theme palette key for `**...**` markers. Defaults to `accent`. */
  boldColor?: ThemeColorKey
  /** Theme palette key for `__...__` markers. Defaults to `cyan`. */
  italicColor?: ThemeColorKey
  /** Make matched segments use semibold (default true). */
  semibold?: boolean
}

/**
 * Lightweight inline-emphasis renderer for portfolio copy stored as plain
 * strings in JSON. Avoids dragging a full markdown parser into static content
 * tabs — emphasis is the only feature we actually need there.
 */
export function RichText({
  text,
  boldColor = "accent",
  italicColor = "cyan",
  semibold = true,
}: RichTextProps) {
  const { theme } = useTheme()
  const segments = parse(text)

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <Fragment key={i}>{seg.value}</Fragment>
        }
        const color =
          seg.type === "bold" ? theme[boldColor] : theme[italicColor]
        return (
          <span
            key={i}
            style={{ color }}
            className={semibold ? "font-semibold" : undefined}
          >
            {seg.value}
          </span>
        )
      })}
    </>
  )
}

type Segment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }

/**
 * Tokenize the input by `**` and `__` pairs. Greedy left-to-right; if a marker
 * has no closing pair, the leading marker is treated as plain text so input
 * never disappears.
 */
function parse(input: string): Segment[] {
  const out: Segment[] = []
  let i = 0
  let buf = ""

  const flush = () => {
    if (buf) {
      out.push({ type: "text", value: buf })
      buf = ""
    }
  }

  while (i < input.length) {
    const two = input.slice(i, i + 2)
    if (two === "**" || two === "__") {
      const close = input.indexOf(two, i + 2)
      if (close === -1) {
        // Unbalanced marker: keep as literal characters.
        buf += two
        i += 2
        continue
      }
      flush()
      out.push({
        type: two === "**" ? "bold" : "italic",
        value: input.slice(i + 2, close),
      })
      i = close + 2
      continue
    }
    buf += input[i]
    i += 1
  }
  flush()
  return out
}
