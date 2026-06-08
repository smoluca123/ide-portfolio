import { track } from "@vercel/analytics"

/**
 * Thin wrapper around Vercel Analytics custom events.
 *
 * Events are no-ops in development and when analytics is disabled, so it's safe
 * to call these anywhere. Keep event names stable and properties small/scalar
 * (Vercel only accepts string | number | boolean | null values).
 */
type AnalyticsProps = Record<string, string | number | boolean | null>

function safeTrack(event: string, props?: AnalyticsProps) {
  try {
    track(event, props)
  } catch {
    // Analytics must never break the UI.
  }
}

/** A file/tab was opened in the IDE. */
export function trackFileOpen(file: string, source: "explorer" | "tab" | "palette" | "link" | "other" = "other") {
  safeTrack("file_open", { file, source })
}

/** A project case study was opened. */
export function trackProjectView(projectId: string, title: string) {
  safeTrack("project_view", { projectId, title })
}

/** An external project link (GitHub / live demo) was clicked. */
export function trackProjectLink(projectId: string, kind: "github" | "live") {
  safeTrack("project_link", { projectId, kind })
}

/** The résumé PDF was downloaded. */
export function trackResumeDownload() {
  safeTrack("resume_download")
}

/** A question was sent to the AI copilot. */
export function trackAiQuestion(length: number) {
  safeTrack("ai_question", { length })
}

/** A contact method (email, social, etc.) was clicked. */
export function trackContactClick(label: string) {
  safeTrack("contact_click", { label })
}
