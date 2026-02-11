# Retro Kanban

A Kanban board single-page application built with **retro**, a minimal client-side SPA framework that embraces web standards.

## Features

- Three-column Kanban board (To Do, In Progress, Done)
- Create, edit, and delete cards
- Drag and drop cards between columns (HTML5 DnD API)
- Persistent storage via localStorage

## Tech Stack

- **retro** framework — HTML `<template>`, native DOM API, ES modules
- TypeScript (ESNext target, no bundler)
- No virtual DOM, no SSR, no build-time dependencies beyond `tsc`

## Getting Started

### Prerequisites

- Node.js (for TypeScript compiler)
- A static file server

### Build

```bash
npm install
npm run build
```

This compiles `src/**/*.ts` to `dist/**/*.js`.

### Serve

Serve the project root with any static file server and open `public/index.html`:

```bash
npx http-server . -p 8080
# Open http://localhost:8080/public/index.html
```

## Project Structure

```
retro/
├── public/
│   ├── index.html       # HTML with <template> elements, loads app entry
│   └── style.css        # Application styles
├── src/
│   ├── retro/           # Framework
│   │   ├── component.ts # Base Component class
│   │   ├── router.ts    # Hash-based SPA router
│   │   └── index.ts     # Public API re-exports
│   └── app/             # Kanban demo app
│       ├── main.ts      # Entry point
│       ├── store.ts     # Data model + localStorage persistence
│       ├── board.ts     # Board component (columns + cards + DnD)
│       └── card-editor.ts # Card create/edit dialog
├── tsconfig.json
└── package.json
```

## Documentation

See [docs/retro-framework.md](docs/retro-framework.md) for retro framework documentation.
