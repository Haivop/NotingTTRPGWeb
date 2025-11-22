"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getItemById, deleteItem, updateItem } from "@/lib/world-data"; // Функції API

import { ItemFormData, WorldItem, ContinentItem } from "@/lib/types";
import { useFactionOptions } from "@/hooks/useFactionOptions";

import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

// Створюємо інтерфейс для даних, які відправляються на бекенд,
// включаючи метадані галереї.
interface UpdateContinentPayload extends ItemFormData {
  existingGalleryImages?: string[];
}

// Базовий URL для картинок
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace("/api", "")}/uploads`;

export default function EditContinentPage({
  params,
}: {
  params: { worldId: string; continentId: string };
}) {
  const router = useRouter();
  const routeParams = useParams();
  const worldId = routeParams.worldId as string;
  const continentId = routeParams.continentId as string;
  const factionOptions = useFactionOptions(worldId);

  const [continentData, setContinentData] = useState<ContinentItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // --- СТАН ДЛЯ МЕДІА ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  // --- 1. Асинхронне завантаження даних (Без змін) ---
  useEffect(() => {
    let isMounted = true;
    if (!continentId) {
      setIsLoading(false);
      return;
    }

    getItemById(continentId).then((data: WorldItem | null) => {
      if (isMounted && data) {
        const continent = data as ContinentItem;
        setContinentData(continent);

        // 🆕 ІНІЦІАЛІЗАЦІЯ: Головне фото
        if (continent.imageUrl) {
          setPreviewUrl(`${IMAGE_BASE_URL}/${continent.imageUrl}`);
        }

        // 🆕 ІНІЦІАЛІЗАЦІЯ: Галерея
        if (continent.galleryImages && Array.isArray(continent.galleryImages)) {
          setExistingGallery(continent.galleryImages);
        }

        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [continentId]);

  // --- UI Обробники (ОНОВЛЕНО) ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * 🟢 ОНОВЛЕНО: Зберігає нові файли у стейт newGalleryFiles.
   */
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));

      // Зберігаємо файли
      setNewGalleryFiles((prev) => [...prev, ...files]);
      // Зберігаємо прев'ю
      setNewGalleryPreviews((prev) => [...prev, ...urls]);
    }
    e.target.value = "";
  };

  /**
   * 🟢 ОНОВЛЕНО: Видаляє новий файл та прев'ю.
   */
  const removeNewGalleryImage = (index: number) => {
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 🟢 НОВИЙ ОБРОБНИК: Видалення існуючого зображення.
   */
  const removeExistingGalleryImage = (fileName: string) => {
    setExistingGallery((prev) => prev.filter((name) => name !== fileName));
  };

  // --- 2. Обробник надсилання форми (ОНОВЛЕНО) ---
  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!continentData) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Збір текстових даних та метаданих галереї
    const data: UpdateContinentPayload = {
      name: (formData.get("name") as string) || continentData.name,
      faction: formData.get("faction") as string,
      location_type: formData.get("location_type") as string,
      description: formData.get("description") as string,

      // 🟢 ВАЖЛИВО: Передаємо існуючі імена файлів, які залишилися
      existingGalleryImages: existingGallery,
    };

    // 2. Збір файлів
    const coverFile = imageFile; // Головне фото зі стейту
    const newGallery = newGalleryFiles; // Нові файли галереї зі стейту

    // 3. 🟢 Виклик updateItem з усіма аргументами
    await updateItem(
      continentId,
      data,
      coverFile,
      newGallery.length > 0 ? newGallery : undefined
    );

    router.refresh();
    router.push(`/worlds/${worldId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${continentData?.name}?`)) return;

    setIsLoading(true);
    try {
      await deleteItem(continentId);
      router.refresh();
      router.push(`/worlds/${worldId}`);
    } catch (error) {
      console.error("Error deleting continent:", error);
      setIsLoading(false);
      alert("Failed to delete continent.");
    }
  };

  if (isLoading)
    return (
      <PageContainer className="text-white text-center py-20">
        Loading Continent...
      </PageContainer>
    );
  if (!continentData)
    return (
      <PageContainer className="text-white text-center py-20">
        Continent Not Found!
      </PageContainer>
    );

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">
          CONTINENT PROFILE
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Edit {continentData.name}
        </h1>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* 🆕 ЛІВА КОЛОНКА (МЕДІА) */}
          <div className="flex flex-col gap-4">
            {/* 1. ГОЛОВНЕ ФОТО (без змін) */}
            <div
              className="relative h-64 w-full overflow-hidden rounded-3xl border border-white/15 bg-black/20 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(192,132,252,0.45),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.3),transparent_65%)]" />
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                <span className="text-xs uppercase tracking-widest font-bold text-white">
                  {previewUrl ? "Change Image" : "Upload Image"}
                </span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              {previewUrl ? "Change Cover" : "Upload Cover"}
            </button>

            {/* 2. ГАЛЕРЕЯ (ОНОВЛЕНО: додана кнопка видалення для існуючих) */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <div className="flex items-center justify-between">
                <p className="font-display text-[11px] text-purple-100/80">
                  GALLERY
                </p>
                <span className="text-[10px] text-white/30">
                  {existingGallery.length + newGalleryPreviews.length} items
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {/* Існуючі картинки */}
                {existingGallery.map((fileName, idx) => (
                  <div
                    key={`exist-${idx}`}
                    className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/20 relative group"
                  >
                    <img
                      src={`${IMAGE_BASE_URL}/${fileName}`}
                      className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                      alt={`Gallery ${idx}`}
                    />
                    {/* 🟢 Кнопка видалення для існуючих файлів */}
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(fileName)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                    >
                      <span>x</span>
                    </button>
                  </div>
                ))}

                {/* Нові прев'ю */}
                {newGalleryPreviews.map((src, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-green-500/30 bg-black/20"
                  >
                    <img
                      src={src}
                      className="h-full w-full object-cover"
                      alt={`New ${idx}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewGalleryImage(idx)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                    >
                      <span>x</span>{" "}
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/20 text-[8px] text-center text-green-200 py-0.5 font-bold">
                      NEW
                    </div>
                  </div>
                ))}

                {/* Кнопка + */}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 transition hover:border-white/40 hover:bg-white/10">
                  <span className="text-2xl text-white/50">+</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleGallerySelect}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-display text-[11px] text-purple-100/80">
                Continent Notes
              </p>
              <p className="mt-2">Pin maps.</p>
              <button
                type="button"
                className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/40 hover:text-white"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* ПРАВА КОЛОНКА (ФОРМА) */}
          <form className="space-y-6" onSubmit={handleSaveProfile}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Name
                </label>
                <Input
                  defaultValue={continentData.name}
                  className="mt-2"
                  name="name"
                />
              </div>
              {/* Faction */}
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Faction
                </label>
                <Select
                  defaultValue={
                    continentData.faction || factionOptions[0]?.id || "unknown"
                  }
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Location_type */}
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Type
                </label>
                <Select
                  defaultValue={continentData.location_type || "landmass"}
                  className="mt-2"
                  name="location_type"
                >
                  <option value="landmass">Landmass</option>
                  <option value="island_chain">Island Chain</option>
                  <option value="floating_continent">Floating Continent</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Description
              </label>
              <Textarea
                defaultValue={continentData.description}
                className="mt-2"
                name="description"
              />
            </div>

            <div className="flex flex-col gap-4 pt-3 sm:flex-row">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
              >
                Delete Continent
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
