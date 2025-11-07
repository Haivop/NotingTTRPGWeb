## Worldcraftery UI

This directory contains the fantasy-inspired front-end for the Worldcraftery TTRPG tooling suite. It was bootstrapped with Next.js 16 (App Router, TypeScript, Tailwind v4) and styled to evoke a high-fantasy archive.

### Available Screens

- `/` — Marketing landing page with feature highlights and testimonials.
- `/sign-in` — Split-panel authentication flow.
- `/hub` — Community hub showing featured worlds, categories, and events.
- `/search` — Archive search with tag filters.
- `/worlds/create` — World creation wizard with map drop zone, metadata, and collaborator invites.
- `/worlds/[worldId]` — World overview dashboard with sidebar navigation and lore sections.
- `/worlds/[worldId]/edit` — World editor with permissions management.
- `/worlds/[worldId]/characters/[characterId]/edit` — Character profile editor.
- `/worlds/[worldId]/quests/[questId]/edit` — Quest management form.
- `/account` — User profile dashboard with world collection and session notes.

All pages ship with placeholder data and can be wired to live APIs later.

### Getting Started

```bash
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to explore the UI suite.

### Next Steps

- Replace placeholder data with real services once backend endpoints are available.
- Connect file uploads to object storage for maps, portraits, and quest handouts.
- Add state management (React Query / Zustand) as real data flows in.
- Extend the design system with component variants (tabs, tables, modals) as needed.
