import portfolioData from "@/data/portfolio.json"

/**
 * Type definitions for the portfolio data file (`data/portfolio.json`).
 *
 * Keep this in sync with the JSON. The shape is intentionally flat and
 * serializable so it can be swapped for an API response (or a CMS payload)
 * later with no UI changes.
 *
 * Conventions
 * - `colorKey` / `color` strings reference tokens on the active theme palette
 *   (see `components/portfolio/themes.ts`). Resolution lives in the components.
 * - `icon` strings are lucide-react icon names (kebab-cased -> camelCase),
 *   resolved by the icon registry in `components/portfolio/icon.tsx`.
 * - Inline emphasis in copy uses `**bold accent**` and `__cyan__` markers
 *   parsed by `components/portfolio/rich-text.tsx`.
 */

export type ThemeColorKey =
  | "foreground"
  | "muted"
  | "subtle"
  | "accent"
  | "pink"
  | "cyan"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "red"
  | "comment"

export interface Identity {
  firstName: string
  lastName: string
  fullName: string
  roles: string[]
}

export interface HeroBadge {
  label: string
  color: ThemeColorKey
}

export interface HeroCta {
  label: string
  icon: string
  variant: "primary" | "ghost"
}

export interface Hero {
  intro: string
  taglines: string[]
  description: string
  badges: HeroBadge[]
  ctas: HeroCta[]
}

export interface Stat {
  value: string
  label: string
}

export interface SocialLink {
  label: string
  icon: string
  href: string
}

export interface AboutInterest {
  icon: string
  title: string
  description: string
}

export interface About {
  fileBanner: string[]
  professionalSummary: string[]
  milestones: string[]
  interests: AboutInterest[]
  philosophy: string
}

export interface Experience {
  period: string
  title: string
  company: string
  description: string
  techStack: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  problemSolved: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  thumbnail: string
  /** --- Optional case-study fields (used by the project detail view) --- */
  /** Year or period the project was built, e.g. "2024". */
  year?: string
  /** Your role on the project, e.g. "Lead Developer". */
  role?: string
  /** Lifecycle status; drives the status badge colour. */
  status?: "Live" | "In Progress" | "Archived"
  /** Longer narrative shown at the top of the detail view. */
  longDescription?: string
  /** Measurable results / impact, e.g. "Cut load time by 60%". */
  outcomes?: string[]
  /** Notable features or scope bullets. */
  features?: string[]
}

export interface Skill {
  name: string
  percentage: number
  color: ThemeColorKey
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export interface Skills {
  categories: SkillCategory[]
  familiar: string[]
}

export interface ContactMethod {
  icon: string
  iconColor: ThemeColorKey
  label: string
  value: string
  href: string
}

export interface Contact {
  fileBanner: string[]
  methods: ContactMethod[]
  responseTime: {
    title: string
    message: string
  }
}

export interface ReadmeSegment {
  text: string
  color: ThemeColorKey
}

export interface ReadmeQuickFact {
  value: string
  label: string
  color: ThemeColorKey
}

export interface ReadmeNavItem {
  tab: string
  icon: string
  description: string
}

export interface Readme {
  fileBanner: string[]
  subtitleSegments: ReadmeSegment[]
  mission: string
  quickFacts: ReadmeQuickFact[]
  navigation: ReadmeNavItem[]
  footer: {
    comment: string
    credit: string
  }
}

export interface PortfolioData {
  identity: Identity
  hero: Hero
  stats: Stat[]
  socials: SocialLink[]
  about: About
  experiences: Experience[]
  projects: Project[]
  skills: Skills
  contact: Contact
  readme: Readme
}

export const portfolio: PortfolioData = portfolioData as PortfolioData
