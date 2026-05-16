"use client"

import { useTheme } from "./theme-context"
import { Github, ExternalLink, Code2 } from "lucide-react"
import { withAlpha } from "./themes"

interface Project {
  id: string
  title: string
  description: string
  problemSolved: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  thumbnail: string
}

const projects: Project[] = [
  {
    id: "1",
    title: "Ling's Home",
    description: "A comprehensive digital service management platform for seamless business operations",
    problemSolved: "Automated service booking, scheduling, and customer management for 100+ businesses",
    techStack: ["Next.js", "React", "PostgreSQL", "Tailwind CSS", "Stripe", "Vercel"],
    githubUrl: "https://github.com",
    liveUrl: "https://lingshome.com",
    thumbnail: "Dashboard with service listings and booking management",
  },
  {
    id: "2",
    title: "EduVance Platform",
    description: "AI-powered educational platform with personalized learning paths and GenAI integration",
    problemSolved: "Created ML-powered personalization engine and RAG pipelines for adaptive learning",
    techStack: ["FastAPI", "Python", "React", "PostgreSQL", "GenAI", "Docker", "AWS"],
    githubUrl: "https://github.com",
    liveUrl: "https://eduvance.ai",
    thumbnail: "Learning dashboard with AI-powered course recommendations",
  },
  {
    id: "3",
    title: "Performance Dashboard",
    description: "Real-time analytics and performance monitoring dashboard with technical SEO metrics",
    problemSolved: "Optimized SEO and performance tracking, improving page load times by 60%",
    techStack: ["Next.js", "React", "PostgreSQL", "D3.js", "Tailwind CSS"],
    githubUrl: "https://github.com",
    liveUrl: "https://dashboard.example.com",
    thumbnail: "Analytics dashboard with real-time metrics and charts",
  },
  {
    id: "4",
    title: "Design System UI Library",
    description: "Reusable component library for building consistent UIs across multiple projects",
    problemSolved: "Reduced development time by 40% through standardized, accessible components",
    techStack: ["React", "Storybook", "TypeScript", "Tailwind CSS", "npm"],
    githubUrl: "https://github.com",
    liveUrl: "https://ui-library.example.com",
    thumbnail: "Collection of reusable UI components and design tokens",
  },
  {
    id: "5",
    title: "E-commerce Platform",
    description: "Full-featured e-commerce platform with inventory management and payment integration",
    problemSolved: "Built complete transaction flow with Stripe integration and real-time inventory sync",
    techStack: ["Next.js", "PostgreSQL", "Stripe", "Vercel", "Redis"],
    githubUrl: "https://github.com",
    liveUrl: "https://ecommerce.example.com",
    thumbnail: "E-commerce product showcase and checkout flow",
  },
]

export function ProjectsContent() {
  const { theme } = useTheme()

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-8 text-sm" style={{ color: theme.comment }}>
        <div>// projects.js - Showcase of work &amp; impact</div>
        <div>// Building solutions that solve real problems</div>
      </div>

      {/* Projects grid */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="overflow-hidden rounded-lg border transition-all hover:border-opacity-100"
            style={{
              backgroundColor: theme.surface,
              borderColor: withAlpha(theme.muted, "40"),
            }}
          >
            {/* Project thumbnail placeholder */}
            <div
              className="flex h-32 items-center justify-center p-4 text-center text-sm"
              style={{
                backgroundColor: withAlpha(theme.muted, "15"),
                color: theme.muted,
              }}
            >
              {project.thumbnail}
            </div>

            {/* Project content */}
            <div className="space-y-3 p-4">
              <h3 className="text-lg font-bold" style={{ color: theme.accent }}>
                {project.id}. {project.title}
              </h3>

              <p className="text-sm" style={{ color: theme.muted }}>
                {project.description}
              </p>

              <div className="flex items-start gap-2">
                <Code2 size={16} style={{ color: theme.green }} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm" style={{ color: theme.muted }}>
                  <span style={{ color: theme.green }}>Problem:</span> {project.problemSolved}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: withAlpha(theme.accent, "20"),
                      color: theme.accent,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs transition-opacity hover:opacity-75"
                  style={{ color: theme.accent }}
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs transition-opacity hover:opacity-75"
                  style={{ color: theme.green }}
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
