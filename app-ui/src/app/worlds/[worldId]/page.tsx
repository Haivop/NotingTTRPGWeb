import { PageContainer } from "@/components/layout/PageContainer";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";

const sidebarSections = [
  "Maps",
  "Continents",
  "Regions",
  "Locations",
  "Factions",
  "Characters",
  "Quests",
  "Artifacts",
  "Timelines",
];

const continentSummaries = [
  {
    name: "Sapphirine Isles",
    detail: "Floating archipelago governed by skyward drakes.",
  },
  {
    name: "Verdant Hollow",
    detail: "Bioluminescent forests rooted in ancient leviathans.",
  },
];

const characterHighlights = [
  {
    name: "Captain Elowyn Stratus",
    role: "Aetherwind privateer turned reluctant hero.",
  },
  {
    name: "Arcanist Veyl",
    role: "Keeper of the stormbound archives beneath the capital.",
  },
];

const questThreads = [
  {
    title: "The Tempest Choir",
    status: "In Motion",
    hook: "Negotiate peace with the sentient storms haunting the sky lanes.",
  },
  {
    title: "Shards of the Primordial",
    status: "Rumored",
    hook: "Gather relics forged before the first sunrise.",
  },
];

export default function WorldOverviewPage({
  params,
}: {
  params: { worldId: string };
}) {
  const worldName = params.worldId
    ? params.worldId
        .split("-")
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ")
    : "Unnamed Realm";

  return (
    <div className="space-y-10">
      <PageContainer>
        <header className="flex flex-col gap-3">
          <p className="font-display text-xs text-purple-200/80">
            WORLD OVERVIEW
          </p>
          <h1 className="text-3xl font-semibold text-white">{worldName}</h1>
          <p className="max-w-3xl text-sm text-white/70">
            Suspended between the heavens and the abyss, the realm hums with
            skyward ley lines, song-bound storms, and guilds vying for dominion
            over floating citadels.
          </p>
        </header>
      </PageContainer>

      <TwoColumnLayout
        sidebar={
          <div className="space-y-6">
            <Input placeholder="Search the codex..." />
            <nav className="space-y-2 text-sm text-white/65">
              {sidebarSections.map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase()}`}
                  className="flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-white/5 hover:text-white"
                >
                  <span>{section}</span>
                  <span className="text-xs text-white/30">12</span>
                </a>
              ))}
            </nav>

            <div className="rounded-3xl border border-purple-300/30 bg-purple-500/10 p-5 text-xs text-purple-100">
              <p className="font-display text-[11px] uppercase tracking-[0.3em]">
                Co-Authors
              </p>
              <ul className="mt-3 space-y-2 text-white/70">
                <li>@sable.stargazer</li>
                <li>@quinn.cartographer</li>
                <li>@leyline.mage</li>
              </ul>
            </div>
          </div>
        }
      >
        <GlassPanel id="maps" title="SKYMAP">
          <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_60%_20%,rgba(192,132,252,0.35),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(244,114,182,0.25),transparent_60%)] p-10">
            <div className="h-72 rounded-3xl border border-white/15 bg-black/30" />
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/45">
              Drag to pan • Scroll to zoom • Double-click for region detail
            </p>
          </div>
        </GlassPanel>

        <div className="grid gap-8 lg:grid-cols-2">
          <GlassPanel id="continents" title="CONTINENTS">
            <ul className="space-y-5 text-sm text-white/70">
              {continentSummaries.map((continent) => (
                <li key={continent.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="font-display text-[11px] uppercase tracking-[0.3em] text-purple-100/90">
                    {continent.name}
                  </p>
                  <p className="mt-2">{continent.detail}</p>
                </li>
              ))}
            </ul>
          </GlassPanel>

          <GlassPanel id="characters" title="CHARACTERS">
            <ul className="space-y-5 text-sm text-white/70">
              {characterHighlights.map((character) => (
                <li
                  key={character.name}
                  className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-display text-[11px] uppercase tracking-[0.3em] text-purple-100/80">
                    {character.name}
                  </p>
                  <p>{character.role}</p>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>

        <GlassPanel id="quests" title="QUEST THREADS">
          <div className="space-y-5">
            {questThreads.map((quest) => (
              <div
                key={quest.title}
                className="rounded-3xl border border-white/10 bg-black/10 p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-xs text-purple-100/80">
                    {quest.title}
                  </p>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55">
                    {quest.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/70">{quest.hook}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </TwoColumnLayout>
    </div>
  );
}
