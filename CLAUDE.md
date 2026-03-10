# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint
npm run test      # Run tests in watch mode
npx jest --testPathPattern="ComponentName" --watchAll=false  # Run a single test file
```

## Architecture

**Patchwork** is a collaborative tile-based drawing app built with Next.js 13 (Pages Router), React 18, and TypeScript.

### State Management (Hybrid)

Two stores are used together — pick the right one based on what you're changing:

- **Jotai atoms** (`src/store/atoms.tsx`) — UI/interaction state: zoom, current color, selected action (`Draw | Paint | Move | Rotate | Delete`), selected tile, grid visibility, pan offset, mouse state
- **Zustand store** (`src/store/store.tsx`) — Canvas data with Immer + DevTools middleware. Three slices:
  - `LayerSlice` — `layers: Map<string, Layer>`, selected layer ID, CRUD ops
  - `CanvasSlice` — `currentCanvas()`, `getCell(index)`, `updateCellInBurst()` (tracked in history), `updateCellNotReversible()`
  - `HistorySlice` — undo stack; `historyApi.pop()` supports burst grouping

### Core Data Types (`src/types.tsx`)

```typescript
type Tile     // id, symbol (unicode char), color (Tailwind class), orientation (0-3)
type Canvas   // Tile[] — flat array, indexed by cell position
type Layer    // { id, name, visible, enabled, canvas: { cells, dimension } }
```

The `Tile` class has methods: `clone`, `equals`, `isEmpty`, `looksLike`, `paint`, `rotate`, `resetOrientation`, `reset`.

### App Layout (`src/components/App.tsx`)

```
<TilePanels>  ← left sidebar (tile palette)
<Canvas>      ← drawing area (Canvas/Canvas.tsx)
  <ToolBar>   ← action buttons
  <Colors>    ← color palette
  <Zoom>
  <LayerStack> ← desktop only
```

### Key Config (`src/config.tsx`)

Canvas is 50×50 cells by default. Colors are Tailwind classes stored in a safelist in `tailwind.config.js`. Custom cursor classes per action are also defined there.

### Testing

Tests use Jest + React Testing Library. Wrap components with `<Provider>` (Jotai) when testing components that use atoms. Tests use `data-testid` attributes and `userEvent` for interactions.
