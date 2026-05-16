import promptData from "@/data/ai-system-prompt.json"

export interface PromptSection {
  title: string
  items: string[]
}

export interface SystemPromptConfig {
  persona: string
  sections: PromptSection[]
}

const config = promptData as SystemPromptConfig

/**
 * Assemble the full system prompt from the structured JSON config.
 *
 * Format:
 *   <persona>
 *
 *   <Section Title>:
 *   - item 1
 *   - item 2
 *
 *   <Next Section Title>:
 *   - ...
 */
function buildSystemPrompt({ persona, sections }: SystemPromptConfig): string {
  const blocks: string[] = [persona.trim()]

  for (const section of sections) {
    const lines = [`${section.title.trim()}:`]
    for (const item of section.items) {
      lines.push(`- ${item.trim()}`)
    }
    blocks.push(lines.join("\n"))
  }

  return blocks.join("\n\n")
}

export const SYSTEM_PROMPT: string = buildSystemPrompt(config)

export const systemPromptConfig: SystemPromptConfig = config
