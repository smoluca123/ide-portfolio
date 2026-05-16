"use client"

import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Code2,
  Coffee,
  ExternalLink,
  Eye,
  Github,
  Globe,
  Guitar,
  Info,
  Linkedin,
  Mail,
  MessageCircle,
  Play,
  Send,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

/**
 * Single source of truth for icon names referenced from `data/portfolio.json`.
 *
 * The keys are the strings used in the JSON (camelCase). To add a new icon,
 * import it from `lucide-react` and register it here; the data file can then
 * reference it by key. Unknown keys render nothing (with a console warning in
 * development) so a typo in JSON doesn't crash the page.
 */
const REGISTRY: Record<string, LucideIcon> = {
  arrowRight: ArrowRight,
  bookOpen: BookOpen,
  checkCircle: CheckCircle,
  code2: Code2,
  coffee: Coffee,
  externalLink: ExternalLink,
  eye: Eye,
  github: Github,
  globe: Globe,
  guitar: Guitar,
  info: Info,
  linkedin: Linkedin,
  mail: Mail,
  messageCircle: MessageCircle,
  play: Play,
  send: Send,
  zap: Zap,
}

interface IconProps extends LucideProps {
  /** Registered icon name (see REGISTRY above). */
  name: string
}

export function Icon({ name, ...props }: IconProps) {
  const Component = REGISTRY[name]
  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] Unknown icon name: "${name}"`)
    }
    return null
  }
  return <Component {...props} />
}
