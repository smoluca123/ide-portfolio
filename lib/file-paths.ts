/**
 * Single source of truth for the virtual "directory" each portfolio file lives
 * in. Used by the editor tabs and file explorer context menus (Copy Path /
 * Copy Relative Path) so paths stay consistent across the IDE chrome.
 */
import { portfolio } from "@/lib/portfolio"

/** Relative folder for each file, mirroring the command palette's file list. */
const FILE_DIR: Record<string, string> = {
  "Welcome.md": "",
  "home.tsx": "src",
  "about.html": "src",
  "projects.js": "src",
  "skills.json": "data",
  "experience.ts": "src",
  "contact.css": "src",
  "README.md": "",
  "Resume.pdf": "",
}

/** Workspace root folder name, derived from the portfolio owner's name. */
export function workspaceRoot(): string {
  return portfolio.identity.fullName.toLowerCase().replace(/\s+/g, "-")
}

/** Path relative to the workspace root, e.g. `src/home.tsx` or `Welcome.md`. */
export function relativePath(file: string): string {
  const dir = FILE_DIR[file] ?? ""
  return dir ? `${dir}/${file}` : file
}

/** Absolute-style path including the workspace root, e.g. `alex-doe/src/home.tsx`. */
export function absolutePath(file: string): string {
  return `${workspaceRoot()}/${relativePath(file)}`
}
