import { NextResponse } from "next/server"

/** Shape returned to the client */
export interface GithubRepoData {
  name: string
  fullName: string
  description: string | null
  defaultBranch: string
  stars: number
  forks: number
  openIssues: number
  language: string | null
  visibility: string
  totalCommits: number | null
  latestCommit: {
    sha: string
    message: string
    author: string
    date: string
  } | null
}

const GITHUB_API = "https://api.github.com"

/**
 * GET /api/github
 * Proxies GitHub API calls server-side so the PAT never leaks to the browser.
 */
export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO // "owner/repo"

  // Return empty data gracefully when env vars are not configured
  if (!token || !repo) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN or GITHUB_REPO not configured" },
      { status: 503 }
    )
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  try {
    // Fetch repo metadata and latest commit in parallel
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`${GITHUB_API}/repos/${repo}`, { headers, next: { revalidate: 300 } }),
      fetch(`${GITHUB_API}/repos/${repo}/commits?per_page=1`, {
        headers,
        next: { revalidate: 300 },
      }),
    ])

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${repoRes.status} ${repoRes.statusText}` },
        { status: repoRes.status }
      )
    }

    const repoData = await repoRes.json()
    const commitsData = commitsRes.ok ? await commitsRes.json() : []

    // Fetch total commit count via contributor stats (best-effort)
    const contributorsRes = await fetch(
      `${GITHUB_API}/repos/${repo}/contributors?per_page=1&anon=true`,
      { headers, next: { revalidate: 300 } }
    )

    // Parse Link header to get total pages = total commits from single-author repos
    let totalCommits: number | null = null
    if (contributorsRes.ok) {
      const contributors: { contributions: number }[] = await contributorsRes.json()
      if (Array.isArray(contributors) && contributors.length > 0) {
        // Sum contributions across all contributors as proxy for total commits
        totalCommits = contributors.reduce((sum, c) => sum + c.contributions, 0)
      }
    }

    const latestCommit =
      Array.isArray(commitsData) && commitsData.length > 0
        ? {
            sha: commitsData[0].sha.slice(0, 7),
            message: commitsData[0].commit.message.split("\n")[0],
            author:
              commitsData[0].commit.author?.name ??
              commitsData[0].author?.login ??
              "unknown",
            date: commitsData[0].commit.author?.date ?? "",
          }
        : null

    const response: GithubRepoData = {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      defaultBranch: repoData.default_branch,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      language: repoData.language,
      visibility: repoData.visibility,
      totalCommits,
      latestCommit,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error("[/api/github] Unexpected error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
