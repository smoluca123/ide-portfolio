import faqData from "@/data/ai-faq.json"

export interface FAQ {
  id: string
  question: string
  keywords: string[]
  answer: string
}

export interface FAQMatch {
  faq: FAQ
  score: number
}

export const faqs: FAQ[] = (faqData as { faqs: FAQ[] }).faqs

/** Normalize text for matching: lowercase, strip punctuation, collapse whitespace. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Match a user message against the FAQ.
 *
 * Strategy:
 * 1. Exact (normalized) match on the canonical question -> instant hit.
 * 2. Substring match on canonical question or any keyword -> high score.
 * 3. Token-overlap scoring as a soft fallback.
 */
export function matchFAQ(
  message: string,
  threshold = 0.5,
): FAQMatch | null {
  const normalizedMsg = normalize(message)
  if (!normalizedMsg) return null

  const messageTokens = new Set(
    normalizedMsg.split(" ").filter((t) => t.length > 1),
  )

  let best: FAQMatch | null = null

  for (const faq of faqs) {
    const normalizedQ = normalize(faq.question)

    // 1. Exact normalized match — strongest signal (clicked suggestions hit this).
    if (normalizedMsg === normalizedQ) {
      return { faq, score: 1 }
    }

    // 2. Substring containment.
    let score = 0
    if (
      normalizedMsg.includes(normalizedQ) ||
      normalizedQ.includes(normalizedMsg)
    ) {
      score = Math.max(score, 0.9)
    }

    for (const keyword of faq.keywords) {
      const normalizedKw = normalize(keyword)
      if (!normalizedKw) continue
      if (normalizedMsg.includes(normalizedKw)) {
        score = Math.max(score, 0.85)
      }
    }

    // 3. Token overlap — proportion of FAQ keyword tokens hit by the message.
    const faqTokens = new Set(
      [normalizedQ, ...faq.keywords.map(normalize)]
        .flatMap((s) => s.split(" "))
        .filter((t) => t.length > 2),
    )

    if (faqTokens.size > 0) {
      let overlap = 0
      for (const token of faqTokens) {
        if (messageTokens.has(token)) overlap++
      }
      const overlapScore = overlap / faqTokens.size
      score = Math.max(score, overlapScore)
    }

    if (score >= threshold && (!best || score > best.score)) {
      best = { faq, score }
    }
  }

  return best
}

/** Public list of suggested questions (mirrors the order in the JSON). */
export const suggestedQuestions: string[] = faqs.map((f) => f.question)
