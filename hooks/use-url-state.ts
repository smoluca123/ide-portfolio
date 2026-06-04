"use client"

import { useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface URLState {
  file?: string
  theme?: string
  explorer?: string
  copilot?: string
  terminal?: string
}

/**
 * Sync IDE state with URL query parameters for deep linking.
 * Allows sharing specific portfolio views via URL.
 * 
 * Note: Must be used within a Suspense boundary due to useSearchParams.
 */
export function useURLState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read current state from URL (safe for SSR)
  const getURLState = useCallback((): URLState => {
    if (!searchParams) return {}
    return {
      file: searchParams.get("file") || undefined,
      theme: searchParams.get("theme") || undefined,
      explorer: searchParams.get("explorer") || undefined,
      copilot: searchParams.get("copilot") || undefined,
      terminal: searchParams.get("terminal") || undefined,
    }
  }, [searchParams])

  // Update URL with new state (shallow routing, no page reload)
  const setURLState = useCallback(
    (updates: Partial<URLState>) => {
      if (typeof window === "undefined") return
      if (!searchParams) return

      const current = new URLSearchParams(searchParams.toString())

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          current.delete(key)
        } else {
          current.set(key, value)
        }
      })

      // Build new URL
      const query = current.toString()
      const newURL = query ? `${pathname}?${query}` : pathname

      // Shallow push (no reload, updates browser history)
      router.push(newURL, { scroll: false })
    },
    [searchParams, pathname, router],
  )

  return { getURLState, setURLState }
}
