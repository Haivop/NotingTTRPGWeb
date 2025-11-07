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

- `/worlds/[worldId]/artifacts/create` — Artifact creator.
- `/worlds/[worldId]/artifacts/[artifactId]` — Artifact view.
- `/worlds/[worldId]/artifacts/[artifactId]/edit` — Artifact editor.

- `/worlds/[worldId]/characters/create` — Character profile creator.
- `/worlds/[worldId]/characters/[characterId]` — Character profile view.
- `/worlds/[worldId]/characters/[characterId]/edit` — Character profile editor.

- `/worlds/[worldId]/continents/create` — Continent creator.
- `/worlds/[worldId]/continents/[continentId]` — Continent profile view.
- `/worlds/[worldId]/continents/[continentId]/edit` — Continent editor.

- `/worlds/[worldId]/factions/create` — Faction creator.
- `/worlds/[worldId]/factions/[factionId]` — Faction profile view.
- `/worlds/[worldId]/factions/[factionId]/edit` — Faction editor.

- `/worlds/[worldId]/locations/create` — Location creator.
- `/worlds/[worldId]/locations/[locationId]` — Location profile view.
- `/worlds/[worldId]/locations/[locationId]/edit` — Location editor.

- `/worlds/[worldId]/quests/create` — Quest creator.
- `/worlds/[worldId]/quests/[questId]` — Quest view.
- `/worlds/[worldId]/quests/[questId]/edit` — Quest editor.

- `/worlds/[worldId]/regions/create` — Region creator.
- `/worlds/[worldId]/regions/[regionId]` — Region profile view.
- `/worlds/[worldId]/regions/[regionId]/edit` — Region editor.

- `/worlds/[worldId]/timelines/create` — Timeline creator.
- `/worlds/[worldId]/timelines/[timelineId]` — Timeline view.
- `/worlds/[worldId]/timelines/[timelineId]/edit` — Timeline editor.

- `/account` — User profile dashboard with world collection and session notes.

All pages ship with placeholder data and can be wired to live APIs later.

### User Roles and Permissions

Each world in the Worldcraftery suite supports role-based access, determining which tools and editing options are available to the viewer.

| **Role**      | **Description**                                    | **Capabilities**                                                                                                      |
| ------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Author**    | The creator and owner of the world.                | Full access to all editing tools, world settings, and deletion rights.                                                |
| **Co-Author** | A collaborator invited to expand the world.        | Can edit and create all world entities (characters, regions, artifacts, etc.) but **cannot delete the world** itself. |
| **Guest**     | A visitor or community member exploring the world. | Read-only access — can view all published sections and entries but cannot make changes.                               |

When rendering world pages (e.g. `/worlds/[worldId]`), the UI dynamically adjusts based on the user’s role:

- **Authors** see editable panels and “+ New” buttons.
- **Co-Authors** see the same editing tools except destructive actions.
- **Guests** view the same content in a read-only layout.

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
- Fix the white background color of the select dropdown component.
