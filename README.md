# Portfolio IDE

Welcome to **Portfolio IDE** — a VS Code-inspired personal portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. 

This project goes beyond a static page by simulating a real development environment, complete with an interactive file explorer, a working terminal, and an intelligent AI Copilot.

## ✨ Key Features

- **Interactive IDE Interface:** Draggable panels, tabbed editor, and an activity bar mimicking VS Code.
- **AI Copilot:** A built-in chat assistant powered by a multi-tier matching algorithm (FAQ exact match -> keyword match -> LLM streaming via NDJSON) with real-time typewriter effects.
- **Full-Text Search (`Ctrl+Shift+F`):** Client-side search across all portfolio data (projects, skills, experience) with instant highlighting and navigation.
- **Deep Linking:** URL state synchronization. Share a link with `?file=projects.js&theme=dracula` and it opens exactly that view.
- **Mock Terminal:** A simulated terminal with commands like `help`, `about`, `theme`, `clear`, and `date`.
- **Dynamic Theming:** Seamless CSS variable-based theming system without React re-renders.
- **Data-Driven Content:** All personal data is stored in `data/*.json`, cleanly separated from UI components.
- **Resume Viewer:** Built-in PDF viewer with download capabilities.
- **Keyboard Shortcuts:** Global hotkeys for command palette (`Ctrl+P`), explorer toggle (`Ctrl+B`), terminal (`Ctrl+\``), and search (`Ctrl+Shift+F`).

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** Radix UI, shadcn/ui, react-resizable-panels
- **State & Logic:** Zustand (for IDE state), custom hooks
- **Deployment:** Vercel (recommended)

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router (pages, layouts, API routes).
- `components/portfolio/`: Core IDE UI components (layout, copilot, terminal, search, etc.).
- `data/`: JSON files containing all portfolio content (`portfolio.json`, `ai-faq.json`, `ai-system-prompt.json`). Update these to change the site's content.
- `lib/`: Types, utilities, and logic for AI matching and data loading.
- `hooks/`: Custom React hooks for keybindings and URL state.

## 📖 Documentation

For a deep dive into the architecture, algorithms, and technical decisions, please read the [TECHNICAL_DEEP_DIVE.md](./TECHNICAL_DEEP_DIVE.md).

## 📄 License

This project is open-source and available under the MIT License.
