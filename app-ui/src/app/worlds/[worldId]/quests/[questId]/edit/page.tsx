import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function EditQuestPage({
  params,
}: {
  params: { worldId: string; questId: string };
}) {
  const questTitle = params.questId
    ? params.questId
        .split("-")
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ")
    : "Untitled Quest";

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">QUEST THREAD</p>
        <h1 className="text-3xl font-semibold text-white">Edit {questTitle}</h1>
        <p className="max-w-3xl text-sm text-white/70">
          Chart objectives, rewards, and branching outcomes. Tie threads to
          factions, characters, and timelines to keep your narrative agile.
        </p>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="h-64 rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_60%_20%,rgba(192,132,252,0.4),transparent_55%),radial-gradient(circle_at_40%_80%,rgba(244,114,182,0.3),transparent_60%)]" />
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Upload Quest Art
            </button>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-display text-[11px] text-purple-100/80">
                Quest Board Notes
              </p>
              <p className="mt-2">
                Pin maps, handouts, or puzzles that guide this quest&apos;s path.
              </p>
              <button
                type="button"
                className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/40 hover:text-white"
              >
                + Add Item
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Title
                </label>
                <Input defaultValue={questTitle} className="mt-2" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Status
                </label>
                <Select defaultValue="active" className="mt-2">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="upcoming">Upcoming</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Reward
                </label>
                <Input defaultValue="Access to the Tempest Choir archives" className="mt-2" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Objective
                </label>
                <Input defaultValue="Broker a pact with the storm-kings" className="mt-2" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Outline
              </label>
              <Textarea
                defaultValue="1. Navigate the Shattered Sky lane • 2. Decode the Choir's hymn • 3. Offer tribute at the Aerial Spire • 4. Survive the initiation storm."
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Consequences
              </label>
              <Textarea
                defaultValue="Failure angers the Choir, stirring violent storms across Verdant Hollow. Success grants weather-walking boons."
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div className="flex flex-col gap-4 pt-3 sm:flex-row">
              <Button type="button" className="flex-1">
                Save Quest
              </Button>
              <Button type="button" variant="danger" className="flex-1">
                Delete Quest
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
