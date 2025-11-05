import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "@/components/ui/Pill";

const navigation = [
  "Maps",
  "Continents",
  "Factions",
  "Characters",
  "Quests",
  "Artifacts",
  "Timelines",
];

const featuredWorlds = [
  {
    title: "Verdant Abyss",
    description:
      "An inverted jungle suspended above a shimmering abyssal sea.",
  },
  {
    title: "Oathbound Citadel",
    description:
      "A fortress city ruled by living contracts and whispered prophecies.",
  },
  {
    title: "The Drowned Constellum",
    description:
      "Celestial ruins submerged beneath a bioluminescent ocean.",
  },
];

const loreUpdates = [
  {
    world: "Elarian Skies",
    update: "New region: The Tempest Choir",
    timestamp: "2 hours ago",
  },
  {
    world: "Dawnsong Reach",
    update: "Quest arc completed: The Lantern War",
    timestamp: "1 day ago",
  },
  {
    world: "Gilded Dunes",
    update: "Artifact unearthed: The Mirror of Thassos",
    timestamp: "3 days ago",
  },
];

export default function HubPage() {
  return (
    <div className="space-y-12">
      <section>
        <PageContainer className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill label="The Grand Archive" />
            <h1 className="mt-4 font-display text-3xl uppercase tracking-[0.45em] text-purple-100">
              World Hub
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Wander through living worlds shared by fellow storytellers. Save
              maps, subscribe to questlines, and discover allies for your next
              campaign.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center rounded-full border border-purple-300/40 bg-purple-500/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-purple-100 transition hover:border-purple-200/70 hover:bg-purple-500/20"
          >
            Browse Lexicon
          </Link>
        </PageContainer>
      </section>

      <PageContainer className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel h-fit space-y-6 p-6">
          <div>
            <p className="font-display text-xs text-purple-200/80">
              WORLD THREADS
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {navigation.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 transition hover:border-white/15 hover:text-white"
                  >
                    <span>{item}</span>
                    <span className="text-xs text-white/35">42</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-xs text-purple-200/70">
              LIVE UPDATES
            </p>
            <ul className="mt-4 space-y-3 text-xs text-white/60">
              {loreUpdates.map((item) => (
                <li
                  key={`${item.world}-${item.update}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-display text-[10px] text-purple-100/80">
                    {item.world}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{item.update}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {item.timestamp}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex flex-col gap-8">
          <GlassPanel
            title="FEATURED WORLDS"
            description="Curated realms ready for curious travelers."
          >
            <div className="grid gap-6 md:grid-cols-3">
              {featuredWorlds.map((world) => (
                <article
                  key={world.title}
                  className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5"
                >
                  <div className="mb-5 h-32 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_65%_10%,rgba(192,132,252,0.45),transparent_55%),radial-gradient(circle_at_35%_90%,rgba(244,114,182,0.35),transparent_60%)]" />
                  <h3 className="font-display text-xs text-purple-100">
                    {world.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">{world.description}</p>
                  <Link
                    href="/worlds/elarian-skies"
                    className="mt-auto inline-flex items-center text-xs font-semibold uppercase tracking-[0.22em] text-purple-200 hover:text-purple-50"
                  >
                    Enter world →
                  </Link>
                </article>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel
            title="GATHERINGS & CALLS TO ADVENTURE"
            description="Join sessions seeking players, map-jams, and collaborative chronicles."
          >
            <div className="grid gap-5 md:grid-cols-2">
              {["Moonlit Cartography Jam", "Chronicle Exchange", "Faction Summit", "Artifact Forgers' Market"].map(
                (event) => (
                  <div
                    key={event}
                    className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/5 p-5"
                  >
                    <p className="font-display text-[11px] text-purple-100/80">
                      {event}
                    </p>
                    <p className="text-sm text-white/70">
                      Share inspirations, trade lore hooks, and meet storytellers
                      ready to breathe life into new worlds.
                    </p>
                    <button
                      type="button"
                      className="self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75 transition hover:border-white/40 hover:text-white"
                    >
                      RSVP
                    </button>
                  </div>
                ),
              )}
            </div>
          </GlassPanel>
        </div>
      </PageContainer>
    </div>
  );
}
