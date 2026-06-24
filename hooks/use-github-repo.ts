"use client"

import { useEffect, useState } from "react"
import type { GithubRepoData } from "@/app/api/github/route"

interface UseGithubRepoReturn {
  data: GithubRepoData | null
  isLoading: boolean
  error: string | null
}

/**
 * Fetches portfolio repository stats from the server-side GitHub proxy.
 * Falls back gracefully when the API is unavailable (no token configured).
 */
export function useGithubRepo(): UseGithubRepoReturn {
  const [data, setData] = useState<GithubRepoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRepo() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch("/api/github")

        if (!res.ok) {
          // 503 means env vars not set — treat as soft failure, not an error
          if (res.status === 503) {
            setData(null)
            return
          }
          throw new Error(`HTTP ${res.status}`)
        }

        const json: GithubRepoData = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchRepo()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, isLoading, error }
}
