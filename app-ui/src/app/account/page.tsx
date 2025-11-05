import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";

const ownedWorlds = [
  { name: "Elarian Skies", status: "Active", summary: "Skyborne archipelagos and sentient storms." },
  { name: "Verdant Hollow", status: "Planning", summary: "Bioluminescent forests that whisper prophecies." },
  { name: "Gilded Dunes", status: "Hiatus", summary: "Sunken relics and mercantile intrigue." },
  { name: "Moonwrought Vale", status: "Active", summary: "Twilight fey courts and mirrored lakes." },
];

export default function AccountPage() {
  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-4 py-4 text-left md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xs text-purple-200">ARCHIVIST PROFILE</p>
          <h1 className="text-3xl font-semibold text-white">Lady Elowyn of the Sapphire Quill</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Chronicler of skyborne sagas, keeper of the Tempest Choir accord, and patron of collaborative storytelling.
          </p>
        </div>
        <Button type="button" variant="ghost" className="min-w-[200px]">
          Edit Profile
        </Button>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <GlassPanel className="p-8 text-sm text-white/70">
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_30%,rgba(192,132,252,0.45),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(244,114,182,0.35),transparent_60%)]" />
            <div className="text-center">
              <p className="font-display text-xs text-purple-200">SCRIBE RANK</p>
              <p className="mt-1 text-lg text-white">Aether Archivist</p>
            </div>
          </div>
          <dl className="mt-6 space-y-4">
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.26em] text-white/45">Worlds</dt>
              <dd>12</dd>
            </div>
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.26em] text-white/45">Quests</dt>
              <dd>47</dd>
            </div>
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.26em] text-white/45">Co-Authors</dt>
              <dd>9</dd>
            </div>
          </dl>

          <div className="mt-8 space-y-3">
            <p className="font-display text-[11px] text-purple-200/80">Pinned Achievements</p>
            <ul className="space-y-2 text-xs">
              <li>Keeper of the Stormbound Accord</li>
              <li>Cartographer&apos;s Guild Laureate</li>
              <li>Chronicle Exchange Host</li>
            </ul>
          </div>
        </GlassPanel>

        <div className="space-y-8">
          <GlassPanel title="WORLD COLLECTION">
            <div className="grid gap-6 md:grid-cols-2">
              {ownedWorlds.map((world) => (
                <article
                  key={world.name}
                  className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70"
                >
                  <div className="h-28 rounded-2xl border border-white/15 bg-[radial-gradient(circle_at_65%_20%,rgba(192,132,252,0.4),transparent_60%),radial-gradient(circle_at_30%_80%,rgba(244,114,182,0.3),transparent_60%)]" />
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs text-purple-100">{world.name}</p>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55">
                      {world.status}
                    </span>
                  </div>
                  <p>{world.summary}</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" className="flex-1 min-w-0 px-4">
                      View
                    </Button>
                    <Button type="button" variant="ghost" className="flex-1 min-w-0 px-4">
                      Edit
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel title="SESSION NOTES">
            <div className="space-y-4 text-sm text-white/70">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-display text-[11px] text-purple-100/80">Upcoming Session</p>
                <p className="mt-2">Finalize the Tempest Choir negotiation encounter.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-display text-[11px] text-purple-100/80">Player Spotlight</p>
                <p className="mt-2">Sable is drafting a new artifact. Review before Friday.</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
