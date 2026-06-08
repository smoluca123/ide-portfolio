import { portfolio } from "@/lib/portfolio"

/**
 * Server-rendered, semantic representation of the portfolio content.
 *
 * The interactive IDE UI (`IDELayout`) is fully client-rendered, so search
 * engine crawlers and assistive technologies would otherwise see an empty
 * shell. This component emits the real content as plain, accessible HTML at
 * request/build time so it is indexable and screen-reader friendly.
 *
 * It is visually hidden via the `sr-only` utility but remains in the DOM and
 * the accessibility tree — it is NOT `display:none` or `aria-hidden`.
 */
export function SeoContent() {
  const { identity, about, experiences, projects, skills, contact } = portfolio

  return (
    <div className="sr-only">
      <header>
        <h1>{identity.fullName}</h1>
        <p>{identity.roles.join(" · ")}</p>
      </header>

      <section aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        {about.professionalSummary.map((paragraph, index) => (
          <p key={index}>{stripMarkers(paragraph)}</p>
        ))}
        <p>{stripMarkers(about.philosophy)}</p>
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        <ul>
          {experiences.map((experience) => (
            <li key={`${experience.company}-${experience.period}`}>
              <h3>
                {experience.title} — {experience.company}
              </h3>
              <p>{experience.period}</p>
              <p>{experience.description}</p>
              <p>Tech stack: {experience.techStack.join(", ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>{project.problemSolved}</p>
              <p>Tech stack: {project.techStack.join(", ")}</p>
              {project.liveUrl ? (
                <a href={project.liveUrl} rel="noopener noreferrer">
                  View {project.title}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        {skills.categories.map((category) => (
          <div key={category.title}>
            <h3>{category.title}</h3>
            <p>{category.skills.map((skill) => skill.name).join(", ")}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
        <ul>
          {contact.methods.map((method) => (
            <li key={method.label}>
              <a href={method.href} rel="noopener noreferrer">
                {method.label}: {method.value}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/** Removes the inline emphasis markers (`**bold**`, `__cyan__`) used in copy. */
function stripMarkers(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1")
}
