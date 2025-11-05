import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "@/components/ui/Pill";
import { buttonClasses } from "@/components/ui/Button";

const features = [
  {
    title: "Lore Atlas",
    description:
      "Map continents, regions, and locations with layered notes, pins, and history trails.",
  },
  {
    title: "Character Chronicles",
    description:
      "Track factions, relationships, and arcs across your saga with timeline waypoints.",
  },
  {
    title: "Quest Loom",
    description:
      "Spin objectives, rewards, and branching decisions that evolve as your world does.",
  },
];

const communityWorlds = [
  {
    name: "Elarian Skies",
    summary: "Floating isles, crystal storms, and sky-bound guilds.",
  },
  {
    name: "Dawnsong Reach",
    summary: "Ancient forests humming with spirits of forgotten heroes.",
  },
  {
    name: "The Gilded Dunes",
    summary: "Shifting sands guarding the relics of a fallen solar empire.",
  },
];

export default function Home() {
  return (
    <>
      <section className="py-10">
        <PageContainer className="flex flex-col items-center text-center">
          <Pill label="Fantasy Worldbuilding Suite" className="mb-6" />
          <h1 className="font-display text-4xl tracking-[0.4em] text-purple-50 md:text-5xl">
            Forge Your Worlds
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/70">
            Give your imagination a gallery worthy of its legends. Sketch maps,
            bind lore, choreograph quests, and invite co-authors—all within a
            luminous atelier made for TTRPG storytellers.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/worlds/create" className={buttonClasses("primary")}>
              Begin a New World
            </Link>
            <Link href="/hub" className={buttonClasses("ghost")}>
              Explore the Hub
            </Link>
          </div>
        </PageContainer>
      </section>

      <section className="mt-16">
        <PageContainer className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <GlassPanel title="STORYTELLING ENGINE">
            <div className="grid gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/5 bg-black/10 p-6">
                  <h3 className="font-display text-sm tracking-[0.32em] text-purple-200">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel
            title="COMMUNITY SPOTLIGHT"
            description="Worlds hand-picked by the archivists this week."
            className="relative overflow-hidden"
          >
            <div className="grid gap-6 md:grid-cols-3">
              {communityWorlds.map((world) => (
                <article
                  key={world.name}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 text-left"
                >
                  <div className="mb-6 h-28 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(192,132,252,0.35),transparent_70%)]" />
                  <h3 className="font-display text-xs text-purple-100">
                    {world.name}
                  </h3>
                  <p className="mt-3 text-sm text-white/65">{world.summary}</p>
                  <Link
                    href="/hub"
                    className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-[0.22em] text-purple-200 hover:text-purple-50"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          </GlassPanel>
        </PageContainer>
      </section>

      <section className="mt-20 pb-16">
        <PageContainer className="glass-panel grid gap-10 p-10 text-left md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-sm text-purple-200">COLLABORATIVE LORE</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              Invite companions to co-author histories, annotate maps, and build
              characters that breathe.
            </h2>
            <p className="mt-4 text-sm text-white/70">
              Share curated access to specific regions, assign quest upkeep, and
              let your table bring ideas to life before they ever reach the game
              session.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
              <span className="rounded-full border border-white/10 px-4 py-2">
                Live Commenting
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                Versioned Timelines
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                Quest Boards
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/20 via-purple-500/5 to-transparent p-8 shadow-[0_25px_80px_rgba(99,102,241,0.35)]">
            <h3 className="font-display text-xs text-purple-100">Scribe&apos;s Ledger</h3>
            <p className="mt-3 text-sm text-white/70">
              “Worldcraftery has become our shared codex. Between chapters we
              stoke the lore, update characters, and seed mysteries for the next
              session. The interface feels like a mythic archive.”
            </p>
            <div className="mt-6 text-xs text-white/50">
              <p>Lady Elowyn of the Sapphire Quill</p>
              <p>Chronicler, The Silverwind Campaign</p>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
