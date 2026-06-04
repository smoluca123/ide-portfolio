"use client"

import { useHotkeys } from "react-hotkeys-hook"

/**
 * Central keybinding registry for the IDE chrome.
 *
 * Adding a new shortcut:
 * 1. Append an entry to `KEYBINDINGS` with a unique `id` (also add it to
 *    the `KeybindingId` union below).
 * 2. Pass a callback for that `id` to `useKeybindings({ ... })` from the
 *    component that owns the relevant state (typically the layout root).
 *
 * Notes:
 * - `keys` uses `react-hotkeys-hook` syntax. `mod` matches Cmd on macOS
 *   and Ctrl elsewhere — same as VS Code's "Ctrl/Cmd" shortcuts.
 * - Multiple alternatives can be passed as a comma-separated list.
 * - Bindings fire even when focus is in form fields so the IDE chrome
 *   stays responsive while typing in the chat input or terminal.
 */

export type KeybindingId =
  | "togglePalette"
  | "toggleExplorer"
  | "toggleCopilot"
  | "toggleTerminal"
  | "toggleSearch"

export interface Keybinding {
  /** Stable identifier — keep these in sync with `KeybindingId`. */
  id: KeybindingId
  /** Hotkey expression(s) understood by `react-hotkeys-hook`. */
  keys: string
  /** Short label for command palette, tooltips, status hints, etc. */
  description: string
  /** Loose grouping for UI display. */
  category: "view" | "navigation"
  /** Human-friendly key combo for tooltips/badges. */
  display: string
}

export const KEYBINDINGS: readonly Keybinding[] = [
  {
    id: "togglePalette",
    keys: "mod+p",
    description: "Open Command Palette",
    category: "navigation",
    display: "Ctrl+P",
  },
  {
    id: "toggleExplorer",
    keys: "mod+b",
    description: "Toggle File Explorer",
    category: "view",
    display: "Ctrl+B",
  },
  {
    id: "toggleCopilot",
    keys: "mod+l",
    description: "Toggle AI Copilot",
    category: "view",
    display: "Ctrl+L",
  },
  {
    id: "toggleTerminal",
    // Backtick (`) on US layouts. Some keyboards report it as "Backquote";
    // listing both keeps the binding portable across layouts.
    keys: "mod+`,mod+Backquote",
    description: "Toggle Terminal",
    category: "view",
    display: "Ctrl+`",
  },
  {
    id: "toggleSearch",
    keys: "mod+shift+f",
    description: "Search Workspace",
    category: "navigation",
    display: "Ctrl+Shift+F",
  },
] as const

export type KeybindingHandlers = Partial<Record<KeybindingId, () => void>>

/**
 * Register the global IDE keybindings. Components that own the relevant
 * state pass in just the handlers they care about; missing entries are
 * registered as no-ops so the underlying browser shortcut still works.
 *
 * The hook list is stable (same length, same order across renders) because
 * `KEYBINDINGS` is a module-level constant, so calling `useHotkeys` in a
 * loop here is safe.
 */
export function useKeybindings(handlers: KeybindingHandlers): void {
  for (const binding of KEYBINDINGS) {
    const handler = handlers[binding.id]
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(
      binding.keys,
      (e) => {
        if (!handler) return
        e.preventDefault()
        handler()
      },
      {
        enableOnFormTags: true,
        enableOnContentEditable: true,
        preventDefault: false,
      },
      // Re-register when the handler identity changes so closures stay fresh.
      [handler],
    )
  }
}
