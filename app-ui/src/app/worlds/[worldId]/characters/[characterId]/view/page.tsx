import { PageContainer } from "@/components/layout/PageContainer";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function EditWorldPage({
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
          <p className="font-display text-xs text-purple-200">WORLD EDITOR</p>
          <h1 className="text-3xl font-semibold text-white">Edit {worldName}</h1>
          <p className="max-w-3xl text-sm text-white/65">
            Update the living lore of your world. Changes are tracked so you can
            revisit older chapters at will.
          </p>
        </header>
      </PageContainer>

      <TwoColumnLayout
        sidebar={
          <div className="space-y-6">
            <section>
              <p className="font-display text-[11px] text-purple-200/70">
                REVISION SNAPSHOTS
              </p>
              <ul className="mt-3 space-y-2 text-xs text-white/60">
                <li>v3.2 &mdash; Added Tempest Choir arc</li>
                <li>v3.1 &mdash; Updated Skyship schematics</li>
                <li>v3.0 &mdash; Introduced floating markets</li>
              </ul>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-white/65">
              <p className="font-display text-[11px] text-purple-100/90">
                Collaborator Notes
              </p>
              <p className="mt-2">
                “Let&apos;s expand the Verdant Hollow timeline before next
                session.”
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
                @sable.stargazer • 4 hours ago
              </p>
            </section>
          </div>
        }
      >
        <GlassPanel title="WORLD OVERVIEW">
          <form className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/45">
                World Name
              </label>
              <Input defaultValue={worldName} className="mt-2" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/45">
                Description
              </label>
              <Textarea
                defaultValue="A realm of floating archipelagos where storms are sentient and sailors sign pacts with the winds."
                className="mt-2"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/45">
                  Key Themes
                </label>
                <Input defaultValue="Sky piracy, Living storms, Found family" className="mt-2" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/45">
                  Current Focus
                </label>
                <Input defaultValue="Negotiating with the Tempest Choir" className="mt-2" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/45">
                Tags
              </label>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
                {["Skyships", "Storm Magic", "Guild Politics"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2"
                  >
                    {tag}
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-2 text-[10px] uppercase tracking-[0.3em] text-white/45"
                    >
                      Remove
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>
        </GlassPanel>

        <GlassPanel title="PERMISSIONS">
          <div className="space-y-4">
            {[
              { label: "Public Read Access", value: "Enabled" },
              { label: "Allow Co-Author Annotations", value: "Enabled" },
              { label: "Allow Forking", value: "Disabled" },
            ].map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
              >
                <span>{setting.label}</span>
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/60 transition hover:border-white/40 hover:text-white"
                >
                  {setting.value}
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>

        <div className="flex flex-col gap-4 md:flex-row">
          <Button type="button" className="flex-1">
            Save Changes
          </Button>
          <Button type="button" variant="danger" className="flex-1">
            Archive World
          </Button>
        </div>
      </TwoColumnLayout>
    </div>
  );
}
