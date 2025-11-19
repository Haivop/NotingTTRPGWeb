"use client";
import { useRouter, useParams } from "next/navigation";
import { saveNewItem } from "@/lib/world-data";
import { ItemFormData } from "@/lib/types";
import { useFactionOptions } from "@/hooks/useFactionOptions";

import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const ITEM_TYPE = "continents";

export default function CreateContinentPage(/* params */) {
  const router = useRouter();

  // 1. БЕЗПЕЧНИЙ ДОСТУП: отримуємо параметри через хук
  const params = useParams();
  const worldId = params.worldId as string; // Оскільки useParams повертає string | string[]
  const factionOptions = useFactionOptions(worldId);

  // 2. ЗАГОЛОВОК: Використовуємо статичний заголовок
  const continentName = "New Continent";

  // --- 1. Обробник надсилання форми ---
  const handleSaveContinent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // 2. Збираємо дані форми (це також вимагає, щоб ви додали атрибут 'name' до всіх Input/Select/Textarea)
    const formData = new FormData(form);

    // Створення об'єкта даних (треба переконатися, що всі поля мають name="...")
    const data: ItemFormData = {
      name: (formData.get("name") as string) || continentName,
      faction: formData.get("faction") as string,
      location_type: formData.get("location_type") as string,
      description: formData.get("description") as string,
    };

    // 3. Викликаємо API для збереження/створення
    const finalId = await saveNewItem(worldId, ITEM_TYPE, data);
    router.refresh();
    // 4. ПЕРЕНАПРАВЛЕННЯ: на сторінку редагування зі справжнім ID
    const newUrl = `/worlds/${worldId}`;
    router.push(newUrl);
  };
  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">
          CONTINENT PROFILE
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Create {continentName}
        </h1>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="h-64 rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_50%_0%,rgba(192,132,252,0.45),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.3),transparent_65%)]" />
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Upload Image
            </button>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-display text-[11px] text-purple-100/80">
                Gallery
              </p>
              <p className="mt-2">Add supporting artwork.</p>
              <button
                type="button"
                className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/40 hover:text-white"
              >
                + Add Image
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSaveContinent}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Name
                </label>
                <Input
                  defaultValue={continentName}
                  className="mt-2"
                  name="name"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Faction
                </label>
                <Select
                  defaultValue={factionOptions[0]?.id ?? "unknown"}
                  className="mt-2"
                  name="faction"
                >
                  {factionOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Type
                </label>
                <Select
                  defaultValue="active"
                  className="mt-2"
                  name="location_type"
                >
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
                name="description"
              />
            </div>

            <div className="flex flex-col gap-4 pt-3 sm:flex-row">
              <Button type="submit" className="flex-1">
                Create Continent
              </Button>
              <Button type="button" variant="danger" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
