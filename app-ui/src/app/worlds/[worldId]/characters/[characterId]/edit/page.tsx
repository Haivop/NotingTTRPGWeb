import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function EditCharacterPage({
  params,
}: {
  params: { worldId: string; characterId: string };
}) {
  const characterName = params.characterId
    ? params.characterId
        .split("-")
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ")
    : "Unnamed Character";

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">CHARACTER PROFILE</p>
        <h1 className="text-3xl font-semibold text-white">
          Edit {characterName}
        </h1>
        <p className="max-w-3xl text-sm text-white/70">
          Flesh out relationships, factions, and story beats. Keep your players
          guessing with layered secrets and notes.
        </p>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="h-64 rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_50%_0%,rgba(192,132,252,0.45),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.3),transparent_65%)]" />
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Upload Portrait
            </button>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-display text-[11px] text-purple-100/80">
                Gallery
              </p>
              <p className="mt-2">
                Add supporting artwork, sigils, reference poses, or mood boards.
              </p>
              <button
                type="button"
                className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/40 hover:text-white"
              >
                + Add Image
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Name
                </label>
                <Input defaultValue={characterName} className="mt-2" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Faction
                </label>
                <Select defaultValue="skybound-covenant" className="mt-2">
                  <option value="skybound-covenant">Skybound Covenant</option>
                  <option value="tempest-choir">Tempest Choir</option>
                  <option value="gilded-empire">Gilded Empire</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Role
                </label>
                <Input defaultValue="Aetherwind Navigator" className="mt-2" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Status
                </label>
                <Select defaultValue="active" className="mt-2">
                  <option value="active">Active</option>
                  <option value="missing">Missing</option>
                  <option value="deceased">Deceased</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Description
              </label>
              <Textarea
                defaultValue="Elowyn tracks star currents with a living astrolabe. She hides a pact with the Tempest Choir to keep her crew safe."
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Motivations
              </label>
              <Textarea
                defaultValue="Secure a sanctuary for sky refugees. Unravel the truth behind the First Gale."
                className="mt-2 min-h-[120px]"
              />
            </div>

            <div className="flex flex-col gap-4 pt-3 sm:flex-row">
              <Button type="button" className="flex-1">
                Save Profile
              </Button>
              <Button type="button" variant="danger" className="flex-1">
                Delete Character
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
