# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint (next lint)
npm run test      # Run tests in watch mode
npx jest --testPathPattern="ComponentName" --watchAll=false  # Run a single test file
```

Node version is pinned via `.nvmrc` (Node 22 LTS).

## Agent Git Workflow

Agents must work from Git worktrees, not directly in the main checkout. Create all worktrees under the sibling directory `../patchwork-worktrees/`:

```bash
mkdir -p ../patchwork-worktrees
git worktree add ../patchwork-worktrees/<branch-name> -b <branch-name> main
```

When the task is complete, verify the change, commit it in the worktree, merge it back into `main` from the main checkout, then remove the worktree:

```bash
git checkout main
git merge --no-ff <branch-name>
git worktree remove ../patchwork-worktrees/<branch-name>
git branch -d <branch-name>
```

Do not delete or overwrite user changes in the main checkout. If the main checkout is dirty, leave it untouched and perform the agent's work in a separate worktree branch.

## Architecture

**Patchwork** is a collaborative tile-based drawing app built with Next.js 15 (Pages Router), React 18, and TypeScript. The path alias `@/...` maps to `src/...`.

### Routes (`src/pages/`)

- `/` — the app (`pages/index.tsx` → `components/App.tsx`)
- `/blocks` — internal glyph dictionary used during development to look up tile symbols

Both routes use `getStaticProps` to load locale messages from `messages/{locale}.json`.

### State Management (Hybrid)

Two stores are used together — pick the right one based on what you're changing:

- **Jotai atoms** (`src/store/atoms.tsx`) — UI/interaction state: zoom, current color + bg color, selected action (`Draw | Paint | Move | Rotate | Delete`), selected tile, active tiles, grid visibility, pan offset, mouse-down, color-bar visibility.
- **Zustand store** (`src/store/store.tsx`) — Canvas data with Immer + DevTools middleware. Three slices on a single store:
  - `LayerSlice` — `layers: Map<string, Layer>`, selected layer id, CRUD via `layerApi`.
  - `CanvasSlice` — `canvasApi.currentCanvas()`, `getCell(index)`, `updateCellInBurst()` (tracked in history), `updateCellNotReversible()`.
  - `HistorySlice` — `history: CanvasEvent[]`; `historyApi.pop()` undoes a whole stroke via `burstId` grouping.

**Burst history:** a drag stroke records every changed cell with the same `burstId`. `historyApi.pop()` pops all events sharing the current burst, so one Ctrl+Z reverts the entire stroke rather than a single cell. Callers that should bypass undo (e.g. paint preview) use `updateCellNotReversible`.

### Core Data Types (`src/types.tsx`)

```typescript
type Tile     // id, symbol (unicode char), color (Tailwind class), orientation (0-3)
type Canvas   // Tile[] — flat array, indexed by cell position
type Layer    // { id, name, visible, enabled, canvas: { cells, dimension } }
```

The `Tile` class has methods: `clone`, `equals`, `isEmpty`, `looksLike`, `paint`, `rotate`, `resetOrientation`, `reset`. Construct tiles via `createTile` / build empty grids via `emptyCanvas` from `src/factory.tsx`.

### App Layout (`src/components/App.tsx`)

```
<aside>
  <TilePanels>          ← tile palette (left sidebar)
<main>
  <ToolBar>             ← action buttons
  <Canvas>              ← drawing area (Canvas/Canvas.tsx)
  <div top-right>       ← ToggleGrid, NewCanvasButton, ExportButton, BgColors, Colors
  <LayerStack>          ← desktop only
  <Zoom>                ← desktop only
```

`useIsMobile` (`src/hooks/isMobile.tsx`) gates desktop-only widgets. Canvas pan/zoom uses `@use-gesture/react` + `@react-spring/web`.

### i18n

`next-intl` with locales `en` and `es` under `messages/`. Locale-derived strings (e.g. the initial layer name via `getLayerDefaultName` in `src/lib/i18n.ts`) are written into the Zustand store from `App.tsx` once `router.isReady`.

Spanish article copy must use "mosaico" / "mosaicos" for user-facing references to tiles. Keep "tile" only in code identifiers, routes, CSS classes, file names, or proper technical names where changing it would be incorrect.

Whenever adding, renaming, or removing an article route under `src/pages/articles/`, update `src/pages/sitemap.xml.tsx` in the same change so the sitemap stays complete.

### Key Config (`src/config.tsx`)

Canvas is 50×50 cells by default. Colors are Tailwind classes — they must also live in the safelist in `tailwind.config.js`, because the app composes class names dynamically (`bg-${color}`) and Tailwind cannot statically detect them. Custom cursor classes per action are defined in the same Tailwind config.

`tilesMap` is the master list of available tile glyphs (each entry: `{ id, symbol, group, orientation? }`); `App.tsx` maps it through `createTile` to produce the working tile set.

### Testing

Jest + React Testing Library (`jest-environment-jsdom`). Wrap components with `<Provider>` (Jotai) when testing components that use atoms. Tests use `data-testid` attributes and `userEvent` for interactions.

## Skill Protocol

Project-specific slash commands live in `.claude/commands/`. Agents must follow these rules:

**Write a new skill when:**
- You complete a multi-step workflow that will recur (e.g. adding a tile, debugging state, updating i18n strings)
- The workflow is non-obvious enough that the next agent would benefit from a recipe

**Update an existing skill when:**
- The user corrects an approach that the skill encodes
- You discover the skill's steps are wrong, incomplete, or outdated
- A better pattern emerges during implementation

**Format** (frontmatter + markdown body):
```markdown
---
description: One-line summary of what the skill does
argument-hint: What $ARGUMENTS should contain (omit if no args needed)
---

Steps or prompt content. Use $ARGUMENTS where the user's input is injected.
```

**Naming**: use kebab-case, project-specific prefixes where needed (e.g. `add-tile.md`, `test-component.md`). Keep skill names short and verb-first.

After writing or updating a skill, note it in a single line response so the user is aware.
