"use client"

import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { useEffect, useMemo } from "react"
import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"

interface MarkdownContentProps {
  /** Raw markdown source. */
  children: string
  /**
   * Optional className applied to the wrapper. Layout classes (max-width,
   * padding, etc.) live on the parent bubble; this is just for fine-tuning.
   */
  className?: string
}

/**
 * Renders Markdown for AI assistant messages.
 *
 * Notes:
 * - GitHub Flavoured Markdown (tables, task lists, strikethrough, autolinks).
 * - Styling is driven by the active theme palette so the output matches the
 *   surrounding IDE chrome across light/dark variants.
 * - All links open in a new tab with `rel="noopener noreferrer"`.
 * - Plain text and inline elements collapse cleanly inside chat bubbles
 *   (no extra leading/trailing margins on first/last block children).
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  const { theme } = useTheme()

  // Inject a theme-aware highlight.js colour scheme. We rebuild a tiny
  // stylesheet mapping the common hljs token classes to palette colours
  // whenever the theme changes, so syntax highlighting stays in sync with
  // the rest of the IDE chrome.
  useEffect(() => {
    const id = "hljs-theme-vars"
    let el = document.getElementById(id) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement("style")
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = `
      .hljs { color: ${theme.foreground}; background: transparent; }
      .hljs-comment, .hljs-quote { color: ${theme.subtle}; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-doctag { color: ${theme.purple}; }
      .hljs-string, .hljs-regexp, .hljs-template-string { color: ${theme.orange}; }
      .hljs-number, .hljs-literal { color: ${theme.cyan}; }
      .hljs-built_in, .hljs-builtin-name, .hljs-type { color: ${theme.cyan}; }
      .hljs-title, .hljs-title.class_, .hljs-title.function_, .hljs-section { color: ${theme.yellow}; }
      .hljs-attr, .hljs-attribute, .hljs-property { color: ${theme.cyan}; }
      .hljs-variable, .hljs-template-variable, .hljs-params { color: ${theme.foreground}; }
      .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class { color: ${theme.red}; }
      .hljs-meta, .hljs-meta .hljs-keyword { color: ${theme.muted}; }
      .hljs-symbol, .hljs-bullet, .hljs-link { color: ${theme.pink}; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: 600; }
      .hljs-addition { color: ${theme.green}; background: ${withAlpha(theme.green, "1f")}; }
      .hljs-deletion { color: ${theme.red}; background: ${withAlpha(theme.red, "1f")}; }
    `
  }, [theme])

  const components = useMemo<Components>(() => {
    const codeBg = withAlpha(theme.accent, "1f")
    const codeBorder = withAlpha(theme.accent, "33")
    const blockBg = withAlpha(theme.foreground, "0d")
    const blockBorder = theme.border
    const quoteBorder = withAlpha(theme.accent, "66")

    return {
      p: ({ children }) => (
        <p className="my-1.5 first:mt-0 last:mb-0 leading-relaxed">
          {children}
        </p>
      ),
      h1: ({ children }) => (
        <h1
          className="mt-3 mb-1.5 text-[13px] font-semibold first:mt-0"
          style={{ color: theme.foreground }}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className="mt-3 mb-1.5 text-[12px] font-semibold first:mt-0"
          style={{ color: theme.foreground }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className="mt-2 mb-1 text-[11px] font-semibold uppercase tracking-wide first:mt-0"
          style={{ color: theme.muted }}
        >
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4
          className="mt-2 mb-1 text-[11px] font-semibold first:mt-0"
          style={{ color: theme.muted }}
        >
          {children}
        </h4>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold" style={{ color: theme.foreground }}>
          {children}
        </strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      del: ({ children }) => (
        <del className="opacity-70">{children}</del>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:opacity-80"
          style={{ color: theme.accent }}
        >
          {children}
        </a>
      ),
      ul: ({ children }) => (
        <ul className="my-1.5 list-disc space-y-0.5 pl-5 first:mt-0 last:mb-0">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="my-1.5 list-decimal space-y-0.5 pl-5 first:mt-0 last:mb-0">
          {children}
        </ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      blockquote: ({ children }) => (
        <blockquote
          className="my-1.5 border-l-2 pl-3 italic first:mt-0 last:mb-0"
          style={{ borderColor: quoteBorder, color: theme.muted }}
        >
          {children}
        </blockquote>
      ),
      hr: () => (
        <hr
          className="my-2 border-0 border-t"
          style={{ borderColor: theme.border }}
        />
      ),
      code: ({ className: cls, children, ...props }) => {
        // `react-markdown` v9 marks block code by giving the <code> a
        // `language-*` className via the parent <pre>. `rehype-highlight`
        // additionally adds an `hljs` class to highlighted blocks. Inline
        // code has neither.
        const cn = cls ?? ""
        const isBlock = /language-/.test(cn) || /\bhljs\b/.test(cn)
        if (isBlock) {
          // Block code: let <pre> handle the chrome; just render <code>.
          return (
            <code className={cn} {...props}>
              {children}
            </code>
          )
        }
        return (
          <code
            className="rounded-sm border px-1 py-px font-mono text-[10.5px]"
            style={{
              backgroundColor: codeBg,
              borderColor: codeBorder,
              color: theme.accent,
            }}
            {...props}
          >
            {children}
          </code>
        )
      },
      pre: ({ children }) => (
        <pre
          className="my-2 overflow-x-auto rounded-sm border p-2 font-mono text-[10.5px] leading-snug first:mt-0 last:mb-0"
          style={{
            backgroundColor: blockBg,
            borderColor: blockBorder,
            color: theme.foreground,
          }}
        >
          {children}
        </pre>
      ),
      table: ({ children }) => (
        <div className="my-2 overflow-x-auto first:mt-0 last:mb-0">
          <table
            className="w-full border-collapse text-[10.5px]"
            style={{ color: theme.foreground }}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead style={{ backgroundColor: blockBg }}>{children}</thead>
      ),
      th: ({ children }) => (
        <th
          className="border px-2 py-1 text-left font-semibold"
          style={{ borderColor: theme.border }}
        >
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td
          className="border px-2 py-1 align-top"
          style={{ borderColor: theme.border }}
        >
          {children}
        </td>
      ),
      input: ({ type, checked, disabled }) =>
        type === "checkbox" ? (
          <input
            type="checkbox"
            checked={checked}
            readOnly
            disabled={disabled}
            className="mr-1 align-middle"
          />
        ) : null,
    }
  }, [theme])

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
