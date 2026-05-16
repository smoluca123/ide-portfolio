import * as React from "react"

/**
 * Subscribe to a CSS media query and re-render when its match state changes.
 *
 * Uses `useSyncExternalStore` so the very first client render already reflects
 * the real viewport (no false→true flash that would cause UI to jump after
 * hydration). On the server we conservatively report `false`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (typeof window === "undefined") return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener("change", notify)
      return () => mql.removeEventListener("change", notify)
    },
    [query],
  )

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
