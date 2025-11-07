import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default function SearchPage() {
  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">ARCANE INDEX</p>
        <h1 className="text-3xl font-semibold text-white">Search the Archives</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Seek worlds, characters, quests, and lore entries crafted by your fellow
          storytellers.
        </p>
      </header>

      <GlassPanel>
        <div className="flex flex-col gap-6">
          <Input placeholder="Search by realm, author, or tag..." />
          <div className="flex flex-wrap gap-3 text-xs text-white/65">
            {["Skyships", "Chronicles", "Artifacts", "Factions", "Timelines"].map((filter) => (
              <button
                key={filter}
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 uppercase tracking-[0.3em] transition hover:border-white/40 hover:text-white"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Search results will appear here. Try looking for{" "}
            <span className="text-purple-200">“Elarian Skies”</span> or{" "}
            <span className="text-purple-200">“Tempest Choir.”</span>
          </div>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
