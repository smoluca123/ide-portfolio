/**
 * Theme palette registry.
 *
 * Each palette is a complete VS Code-style colour set used across the IDE
 * portfolio components. Adding a new theme is as simple as defining a new
 * `ThemePalette` object and registering it in `themes` below.
 */

export interface ThemePalette {
  id: string
  name: string
  isDark: boolean

  // Surfaces
  background: string      // main editor / content area
  sidebar: string         // file explorer, activity bar, title bar bg
  titleBar: string        // window title bar bg
  surface: string         // panels, cards, popovers
  surfaceHover: string    // hover state for surfaces
  border: string
  borderSubtle: string

  // Text
  foreground: string      // primary text
  muted: string           // secondary text
  subtle: string          // tertiary / disabled text

  // Status bar
  statusBar: string
  statusBarText: string

  // Brand / semantic
  accent: string          // primary accent (links, buttons, focused tab)
  accentForeground: string
  accentSecondary: string // alt accent (gradients, hovers)
  pink: string
  cyan: string
  green: string
  yellow: string
  orange: string
  purple: string
  red: string

  success: string
  error: string
  warning: string
  info: string

  // Tabs
  tabActive: string
  tabInactive: string
  tabActiveAccent: string

  // Terminal
  terminalBg: string
  terminalHeader: string
  terminalText: string
  terminalSuccess: string
  terminalError: string
  terminalPromptUser: string
  terminalPromptHost: string
  terminalComment: string

  // Misc
  comment: string         // // comment colour in mocked source views
}

const lucaDark: ThemePalette = {
  id: "luca-dark",
  name: "Luca Dark",
  isDark: true,
  background: "#1E1E1E",
  sidebar: "#1A1A1A",
  titleBar: "#1A1A1A",
  surface: "#262626",
  surfaceHover: "#2D2D2D",
  border: "#374151",
  borderSubtle: "#2A2A2A",
  foreground: "#FFFFFF",
  muted: "#CCCCCC",
  subtle: "#808080",
  statusBar: "#0078d4",
  statusBarText: "#FFFFFF",
  accent: "#2DA8FF",
  accentForeground: "#1E1E1E",
  accentSecondary: "#5EC8FF",
  pink: "#FF61D8",
  cyan: "#49D0C3",
  green: "#4EC994",
  yellow: "#FACC15",
  orange: "#F97316",
  purple: "#A78BFA",
  red: "#FF5A5F",
  success: "#4EC994",
  error: "#FF5A5F",
  warning: "#FACC15",
  info: "#2DA8FF",
  tabActive: "#1E1E1E",
  tabInactive: "#1A1A1A",
  tabActiveAccent: "#2DA8FF",
  terminalBg: "#1E1E1E",
  terminalHeader: "#1A1A1A",
  terminalText: "#CCCCCC",
  terminalSuccess: "#4EC994",
  terminalError: "#FF5A5F",
  terminalPromptUser: "#4EC994",
  terminalPromptHost: "#2DA8FF",
  terminalComment: "#808080",
  comment: "#49D0C3",
}

const dracula: ThemePalette = {
  id: "dracula",
  name: "Dracula",
  isDark: true,
  background: "#282a36",
  sidebar: "#21222c",
  titleBar: "#21222c",
  surface: "#44475a",
  surfaceHover: "#3f4148",
  border: "#44475a",
  borderSubtle: "#343746",
  foreground: "#f8f8f2",
  muted: "#bdbdd1",
  subtle: "#6272a4",
  statusBar: "#bd93f9",
  statusBarText: "#FFFFFF",
  accent: "#8be9fd",
  accentForeground: "#282a36",
  accentSecondary: "#bd93f9",
  pink: "#ff79c6",
  cyan: "#8be9fd",
  green: "#50fa7b",
  yellow: "#f1fa8c",
  orange: "#ffb86c",
  purple: "#bd93f9",
  red: "#ff5555",
  success: "#50fa7b",
  error: "#ff5555",
  warning: "#f1fa8c",
  info: "#8be9fd",
  tabActive: "#282a36",
  tabInactive: "#21222c",
  tabActiveAccent: "#50fa7b",
  terminalBg: "#282a36",
  terminalHeader: "#21222c",
  terminalText: "#f8f8f2",
  terminalSuccess: "#50fa7b",
  terminalError: "#ff5555",
  terminalPromptUser: "#50fa7b",
  terminalPromptHost: "#8be9fd",
  terminalComment: "#6272a4",
  comment: "#6272a4",
}

const monokai: ThemePalette = {
  id: "monokai",
  name: "Monokai",
  isDark: true,
  background: "#272822",
  sidebar: "#1e1f1c",
  titleBar: "#1e1f1c",
  surface: "#3e3d32",
  surfaceHover: "#49483e",
  border: "#49483e",
  borderSubtle: "#3e3d32",
  foreground: "#f8f8f2",
  muted: "#cfcfc2",
  subtle: "#75715e",
  statusBar: "#414339",
  statusBarText: "#f8f8f2",
  accent: "#fd971f",
  accentForeground: "#272822",
  accentSecondary: "#a6e22e",
  pink: "#f92672",
  cyan: "#66d9ef",
  green: "#a6e22e",
  yellow: "#e6db74",
  orange: "#fd971f",
  purple: "#ae81ff",
  red: "#f92672",
  success: "#a6e22e",
  error: "#f92672",
  warning: "#e6db74",
  info: "#66d9ef",
  tabActive: "#272822",
  tabInactive: "#1e1f1c",
  tabActiveAccent: "#fd971f",
  terminalBg: "#272822",
  terminalHeader: "#1e1f1c",
  terminalText: "#f8f8f2",
  terminalSuccess: "#a6e22e",
  terminalError: "#f92672",
  terminalPromptUser: "#a6e22e",
  terminalPromptHost: "#66d9ef",
  terminalComment: "#75715e",
  comment: "#75715e",
}

const oneDarkPro: ThemePalette = {
  id: "one-dark-pro",
  name: "One Dark Pro",
  isDark: true,
  background: "#282c34",
  sidebar: "#21252b",
  titleBar: "#21252b",
  surface: "#3a3f4b",
  surfaceHover: "#3e4451",
  border: "#181a1f",
  borderSubtle: "#2c313a",
  foreground: "#abb2bf",
  muted: "#9da5b4",
  subtle: "#5c6370",
  statusBar: "#21252b",
  statusBarText: "#9da5b4",
  accent: "#61afef",
  accentForeground: "#282c34",
  accentSecondary: "#56b6c2",
  pink: "#c678dd",
  cyan: "#56b6c2",
  green: "#98c379",
  yellow: "#e5c07b",
  orange: "#d19a66",
  purple: "#c678dd",
  red: "#e06c75",
  success: "#98c379",
  error: "#e06c75",
  warning: "#e5c07b",
  info: "#61afef",
  tabActive: "#282c34",
  tabInactive: "#21252b",
  tabActiveAccent: "#61afef",
  terminalBg: "#282c34",
  terminalHeader: "#21252b",
  terminalText: "#abb2bf",
  terminalSuccess: "#98c379",
  terminalError: "#e06c75",
  terminalPromptUser: "#98c379",
  terminalPromptHost: "#61afef",
  terminalComment: "#5c6370",
  comment: "#5c6370",
}

const githubDark: ThemePalette = {
  id: "github-dark",
  name: "GitHub Dark",
  isDark: true,
  background: "#0d1117",
  sidebar: "#010409",
  titleBar: "#161b22",
  surface: "#161b22",
  surfaceHover: "#21262d",
  border: "#30363d",
  borderSubtle: "#21262d",
  foreground: "#c9d1d9",
  muted: "#8b949e",
  subtle: "#6e7681",
  statusBar: "#161b22",
  statusBarText: "#c9d1d9",
  accent: "#58a6ff",
  accentForeground: "#0d1117",
  accentSecondary: "#79c0ff",
  pink: "#f778ba",
  cyan: "#39c5cf",
  green: "#3fb950",
  yellow: "#d29922",
  orange: "#db6d28",
  purple: "#bc8cff",
  red: "#f85149",
  success: "#3fb950",
  error: "#f85149",
  warning: "#d29922",
  info: "#58a6ff",
  tabActive: "#0d1117",
  tabInactive: "#010409",
  tabActiveAccent: "#f78166",
  terminalBg: "#0d1117",
  terminalHeader: "#010409",
  terminalText: "#c9d1d9",
  terminalSuccess: "#3fb950",
  terminalError: "#f85149",
  terminalPromptUser: "#3fb950",
  terminalPromptHost: "#58a6ff",
  terminalComment: "#8b949e",
  comment: "#8b949e",
}

const tokyoNight: ThemePalette = {
  id: "tokyo-night",
  name: "Tokyo Night",
  isDark: true,
  background: "#1a1b26",
  sidebar: "#16161e",
  titleBar: "#16161e",
  surface: "#24283b",
  surfaceHover: "#2f334d",
  border: "#2f334d",
  borderSubtle: "#24283b",
  foreground: "#c0caf5",
  muted: "#a9b1d6",
  subtle: "#565f89",
  statusBar: "#7aa2f7",
  statusBarText: "#1a1b26",
  accent: "#7aa2f7",
  accentForeground: "#1a1b26",
  accentSecondary: "#7dcfff",
  pink: "#bb9af7",
  cyan: "#7dcfff",
  green: "#9ece6a",
  yellow: "#e0af68",
  orange: "#ff9e64",
  purple: "#bb9af7",
  red: "#f7768e",
  success: "#9ece6a",
  error: "#f7768e",
  warning: "#e0af68",
  info: "#7aa2f7",
  tabActive: "#1a1b26",
  tabInactive: "#16161e",
  tabActiveAccent: "#7aa2f7",
  terminalBg: "#1a1b26",
  terminalHeader: "#16161e",
  terminalText: "#c0caf5",
  terminalSuccess: "#9ece6a",
  terminalError: "#f7768e",
  terminalPromptUser: "#9ece6a",
  terminalPromptHost: "#7aa2f7",
  terminalComment: "#565f89",
  comment: "#565f89",
}

const nord: ThemePalette = {
  id: "nord",
  name: "Nord",
  isDark: true,
  background: "#2e3440",
  sidebar: "#272b35",
  titleBar: "#272b35",
  surface: "#3b4252",
  surfaceHover: "#434c5e",
  border: "#3b4252",
  borderSubtle: "#3b4252",
  foreground: "#eceff4",
  muted: "#d8dee9",
  subtle: "#7b88a1",
  statusBar: "#5e81ac",
  statusBarText: "#eceff4",
  accent: "#88c0d0",
  accentForeground: "#2e3440",
  accentSecondary: "#81a1c1",
  pink: "#b48ead",
  cyan: "#8fbcbb",
  green: "#a3be8c",
  yellow: "#ebcb8b",
  orange: "#d08770",
  purple: "#b48ead",
  red: "#bf616a",
  success: "#a3be8c",
  error: "#bf616a",
  warning: "#ebcb8b",
  info: "#88c0d0",
  tabActive: "#2e3440",
  tabInactive: "#272b35",
  tabActiveAccent: "#88c0d0",
  terminalBg: "#2e3440",
  terminalHeader: "#272b35",
  terminalText: "#eceff4",
  terminalSuccess: "#a3be8c",
  terminalError: "#bf616a",
  terminalPromptUser: "#a3be8c",
  terminalPromptHost: "#88c0d0",
  terminalComment: "#4c566a",
  comment: "#616e88",
}

const solarizedDark: ThemePalette = {
  id: "solarized-dark",
  name: "Solarized Dark",
  isDark: true,
  background: "#002b36",
  sidebar: "#001f27",
  titleBar: "#001f27",
  surface: "#073642",
  surfaceHover: "#094756",
  border: "#0a4655",
  borderSubtle: "#073642",
  foreground: "#eee8d5",
  muted: "#93a1a1",
  subtle: "#586e75",
  statusBar: "#268bd2",
  statusBarText: "#fdf6e3",
  accent: "#268bd2",
  accentForeground: "#002b36",
  accentSecondary: "#2aa198",
  pink: "#d33682",
  cyan: "#2aa198",
  green: "#859900",
  yellow: "#b58900",
  orange: "#cb4b16",
  purple: "#6c71c4",
  red: "#dc322f",
  success: "#859900",
  error: "#dc322f",
  warning: "#b58900",
  info: "#268bd2",
  tabActive: "#002b36",
  tabInactive: "#001f27",
  tabActiveAccent: "#268bd2",
  terminalBg: "#002b36",
  terminalHeader: "#001f27",
  terminalText: "#eee8d5",
  terminalSuccess: "#859900",
  terminalError: "#dc322f",
  terminalPromptUser: "#859900",
  terminalPromptHost: "#268bd2",
  terminalComment: "#586e75",
  comment: "#586e75",
}

export const themes: Record<string, ThemePalette> = {
  [lucaDark.id]: lucaDark,
  [dracula.id]: dracula,
  [monokai.id]: monokai,
  [oneDarkPro.id]: oneDarkPro,
  [githubDark.id]: githubDark,
  [tokyoNight.id]: tokyoNight,
  [nord.id]: nord,
  [solarizedDark.id]: solarizedDark,
}

export type ThemeId =
  | "luca-dark"
  | "dracula"
  | "monokai"
  | "one-dark-pro"
  | "github-dark"
  | "tokyo-night"
  | "nord"
  | "solarized-dark"

export const defaultThemeId: ThemeId = "luca-dark"
export const themeList: ThemePalette[] = [
  lucaDark,
  dracula,
  monokai,
  oneDarkPro,
  githubDark,
  tokyoNight,
  nord,
  solarizedDark,
]

/** Helper to apply 8-digit hex alpha onto any hex token (e.g. accent + 60 -> rgba). */
export function withAlpha(hex: string, alphaHex: string) {
  // Accept #RGB or #RRGGBB; pass through otherwise
  if (!hex.startsWith("#")) return hex
  if (hex.length === 4) {
    const r = hex[1], g = hex[2], b = hex[3]
    return `#${r}${r}${g}${g}${b}${b}${alphaHex}`
  }
  if (hex.length === 7) return `${hex}${alphaHex}`
  return hex
}
