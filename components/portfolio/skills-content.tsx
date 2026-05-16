"use client"

import { useTheme } from "./theme-context"
import { withAlpha } from "./themes"

interface Skill {
  name: string
  percentage: number
  /** Token name from the active theme palette to colour the bar with. */
  colorKey: ColorKey
}

type ColorKey = "red" | "orange" | "yellow" | "green" | "cyan" | "purple" | "pink" | "accent"

interface SkillCategory {
  title: string
  skills: Skill[]
}

const skillCategories: SkillCategory[] = [
  {
    title: "LANGUAGES",
    skills: [
      { name: "Python", percentage: 92, colorKey: "red" },
      { name: "Java", percentage: 73, colorKey: "orange" },
      { name: "JavaScript", percentage: 75, colorKey: "yellow" },
      { name: "TypeScript", percentage: 74, colorKey: "cyan" },
      { name: "SQL", percentage: 88, colorKey: "purple" },
    ],
  },
  {
    title: "GENERATIVE AI & LLM ENGINEERING",
    skills: [
      { name: "LangChain", percentage: 82, colorKey: "cyan" },
      { name: "RAG Pipelines", percentage: 85, colorKey: "green" },
      { name: "Prompt Engineering", percentage: 88, colorKey: "yellow" },
      { name: "Agentic Workflows", percentage: 80, colorKey: "pink" },
      { name: "Vector Search", percentage: 87, colorKey: "orange" },
    ],
  },
  {
    title: "AI, ML, DATA SCIENCE",
    skills: [
      { name: "PyTorch", percentage: 85, colorKey: "red" },
      { name: "TensorFlow", percentage: 80, colorKey: "orange" },
      { name: "Scikit-learn", percentage: 78, colorKey: "green" },
      { name: "Pandas", percentage: 85, colorKey: "purple" },
      { name: "NumPy", percentage: 87, colorKey: "cyan" },
      { name: "SciPy", percentage: 80, colorKey: "green" },
    ],
  },
  {
    title: "BACKEND & APIS",
    skills: [
      { name: "FastAPI", percentage: 90, colorKey: "green" },
      { name: "Flask", percentage: 82, colorKey: "cyan" },
      { name: "Django", percentage: 75, colorKey: "green" },
      { name: "Express", percentage: 78, colorKey: "yellow" },
      { name: "NestJS", percentage: 76, colorKey: "purple" },
    ],
  },
  {
    title: "DATABASES",
    skills: [
      { name: "PostgreSQL", percentage: 88, colorKey: "cyan" },
      { name: "Redis", percentage: 72, colorKey: "red" },
      { name: "MongoDB", percentage: 80, colorKey: "yellow" },
    ],
  },
  {
    title: "VECTOR DATABASES",
    skills: [
      { name: "Faiss", percentage: 82, colorKey: "cyan" },
      { name: "Pinecone", percentage: 78, colorKey: "purple" },
      { name: "Weaviate", percentage: 75, colorKey: "green" },
    ],
  },
  {
    title: "DEVOPS & TOOLS",
    skills: [
      { name: "Docker", percentage: 80, colorKey: "cyan" },
      { name: "Git", percentage: 90, colorKey: "orange" },
      { name: "GitHub Actions", percentage: 85, colorKey: "red" },
      { name: "AWS", percentage: 74, colorKey: "orange" },
      { name: "Vercel", percentage: 88, colorKey: "purple" },
    ],
  },
  {
    title: "FRONTEND",
    skills: [
      { name: "React", percentage: 88, colorKey: "cyan" },
      { name: "Next.js", percentage: 85, colorKey: "purple" },
      { name: "Vue.js", percentage: 72, colorKey: "green" },
      { name: "Responsive Design", percentage: 90, colorKey: "green" },
      { name: "Tailwind CSS", percentage: 88, colorKey: "cyan" },
    ],
  },
  {
    title: "DESIGN",
    skills: [
      { name: "Figma", percentage: 75, colorKey: "purple" },
      { name: "UI Prototyping", percentage: 78, colorKey: "green" },
    ],
  },
  {
    title: "DATA ANALYTICS",
    skills: [
      { name: "Tableau", percentage: 73, colorKey: "orange" },
      { name: "Power BI", percentage: 74, colorKey: "yellow" },
    ],
  },
]

const familiarTechs = [
  "Randal",
  "NumPy",
  "PyTorch/Libs",
  "QuicKit",
  "RLBfx",
  "OpenAI",
  "RAG",
  "FastLS",
  "PineconeAI",
  "LangChain",
]

export function SkillsContent() {
  const { theme } = useTheme()

  return (
    <div
      className="h-full overflow-y-auto p-6 font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Comment header */}
      <div className="mb-4 text-sm" style={{ color: theme.comment }}>
        <div>// skills.json - Tech stack &amp; tools i actively use</div>
      </div>

      {/* JSON-like interface declaration */}
      <div className="mb-6 text-sm" style={{ color: theme.comment }}>
        interface Skills {"{"} &quot;learning&quot;, &quot;passion&quot;, &quot;masterclass&quot; {"}"}
      </div>

      {/* Skills title */}
      <h1 className="mb-8 text-4xl font-bold" style={{ color: theme.foreground }}>
        Skills
      </h1>

      {/* Skills grid - 2 columns */}
      <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
        {skillCategories.map((category, idx) => (
          <div key={idx}>
            <div className="mb-4 flex items-center gap-3">
              <h2
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: theme.muted }}
              >
                {category.title}
              </h2>
              <div
                className="flex-1 border-b"
                style={{ borderColor: withAlpha(theme.muted, "40") }}
              />
            </div>

            <div className="space-y-3">
              {category.skills.map((skill) => {
                const color = theme[skill.colorKey]
                return (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span style={{ color: theme.foreground }}>{skill.name}</span>
                      <span style={{ color }} className="font-semibold">
                        {skill.percentage}%
                      </span>
                    </div>

                    <div
                      className="h-1.5 overflow-hidden rounded-full"
                      style={{ backgroundColor: withAlpha(theme.muted, "20") }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${skill.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Also familiar with section */}
      <div className="mt-12">
        <h3
          className="mb-4 text-xs font-bold uppercase tracking-widest"
          style={{ color: theme.muted }}
        >
          Also familiar with
        </h3>
        <div className="flex flex-wrap gap-2">
          {familiarTechs.map((tech) => (
            <span
              key={tech}
              className="rounded border px-3 py-1 text-xs"
              style={{
                borderColor: withAlpha(theme.muted, "60"),
                color: theme.muted,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
