# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-06-04

### ✨ Added

#### 🔗 Deep Linking & URL State Management

- **URL persistence** for IDE state (active file, theme, panel visibility)
- Shareable portfolio links with state preserved (e.g., `/?file=projects.js&theme=dracula`)
- Browser history integration (back/forward buttons work)
- New hook: `hooks/use-url-state.ts` for URL state management
- Suspense boundary in `app/page.tsx` for SSR compatibility

#### 🔍 Workspace Search (Ctrl+Shift+F)

- **Full-text search** across entire portfolio content
- Real-time search results with match highlighting
- Searchable content includes:
  - Hero section & taglines
  - About section (summary, philosophy, milestones)
  - All experiences (title, company, description, tech stack)
  - All projects (title, description, problem solved, tech stack)
  - All skills across categories
  - Contact methods
- New component: `components/portfolio/search-view.tsx`
- New keyboard shortcut: `Ctrl+Shift+F`
- Search icon added to activity bar with active state

#### 📄 Resume PDF Download

- Beautiful resume preview page with download functionality
- One-click PDF download button
- Availability status badge
- Mock PDF file included: `public/Aahana_Resume.pdf` (ready to replace)
- New component: `components/portfolio/resume-content.tsx`
- Resume.pdf added to file explorer, command palette, and tabs

#### 👋 Welcome Screen (First Visit Experience)

- Friendly onboarding screen for new visitors
- **Quick Start** section with 4 main files (home, projects, experience, README)
- **Keyboard shortcuts** reference card
- **Feature highlights** (Interactive IDE, AI Assistant, Live Terminal)
- **Pro tips** for navigation
- One-time display using localStorage (`portfolio-welcomed` flag)
- New component: `components/portfolio/welcome-content.tsx`
- Welcome.md added as default first tab for new users

### 🔧 Modified

#### Components

- **`components/portfolio/ide-layout.tsx`**
  - Integrated URL state management
  - Added Welcome tab logic with localStorage tracking
  - Added Resume.pdf route
  - Added SearchView panel support
  - Panel state management for search view
  - Welcome.md set as default file for first-time users

- **`components/portfolio/file-explorer.tsx`**
  - Added Welcome.md entry
  - Added Resume.pdf entry
  - Updated file list order

- **`components/portfolio/command-palette.tsx`**
  - Added Welcome.md to file list
  - Added Resume.pdf to file list

- **`components/portfolio/activity-bar.tsx`**
  - Search button now toggles search view instead of command palette
  - Active state handling for search tab

- **`components/portfolio/theme-context.tsx`**
  - Added `setThemeName` export (alias for `setTheme`)
  - Exposed for URL state integration

#### Hooks

- **`hooks/use-keybindings.ts`**
  - Added `toggleSearch` keybinding (Ctrl+Shift+F)
  - Updated `KeybindingId` type union
  - Added to KEYBINDINGS constant array

#### App

- **`app/page.tsx`**
  - Wrapped IDELayout in Suspense boundary
  - Prevents SSR hydration errors with useSearchParams

### 📝 Documentation

- **NEW**: `FEATURES.md` - Detailed feature documentation (English)
- **NEW**: `QUICK_TEST_GUIDE.md` - Step-by-step testing guide (English)
- **NEW**: `IMPLEMENTATION_SUMMARY.md` - Technical implementation details (English)
- **NEW**: `HUONG_DAN_SU_DUNG.md` - User guide in Vietnamese
- **NEW**: `CHANGELOG.md` - This file

### 📊 Statistics

- **4 new components** created (~900 lines of code)
- **7 existing files** modified
- **5 documentation files** added
- **0 new dependencies** added
- **1 new keyboard shortcut** (Ctrl+Shift+F)

### 🎨 Design

- All features follow existing VS Code-inspired design system
- Consistent theme token usage (accent, surface, border, etc.)
- Fully responsive on mobile/tablet/desktop
- Keyboard-first navigation maintained
- ARIA labels added for accessibility

### 🧪 Testing

- ✅ Build successful (`npm run build`)
- ✅ No TypeScript errors
- ✅ No runtime errors
- ✅ All keyboard shortcuts functional
- ✅ URL state syncs correctly
- ✅ Browser history works
- ✅ Search indexing accurate
- ✅ Mobile responsive
- ✅ Theme persistence works

### 🚀 Performance

- No impact on initial page load
- Client-side search (instant results)
- Debounced URL updates
- No additional network requests

---

## [1.0.0] - Previous Release

### Features

- VS Code-inspired IDE layout
- File explorer with portfolio files
- Multiple content tabs (home, about, projects, skills, experience, contact, README)
- AI Copilot chat assistant
- Interactive terminal
- Command palette (Ctrl+P)
- Source control view
- Theme picker with multiple themes
- Status bar
- Keyboard shortcuts (Ctrl+B, Ctrl+L, Ctrl+`)
- Responsive design
- Activity bar navigation

---

## Type of Changes

- ✨ **Added** for new features
- 🔧 **Modified** for changes in existing functionality
- 🐛 **Fixed** for bug fixes
- 🗑️ **Removed** for deprecated features
- 🔒 **Security** for vulnerability fixes
- 📝 **Documentation** for documentation changes

---

## Links

- Repository: [Your GitHub URL]
- Live Demo: [Your Demo URL]
- Documentation: See `FEATURES.md`

---

## Upcoming (Potential v1.2.0)

Ideas for future releases:

- Recent files list (track last 5 opened)
- Search history persistence
- Bookmarks / pinned files
- Export portfolio as PDF
- Settings panel (font size, animations)
- Dark/light mode toggle separate from themes
- Keyboard shortcuts customization
- Multiple language support (i18n)
