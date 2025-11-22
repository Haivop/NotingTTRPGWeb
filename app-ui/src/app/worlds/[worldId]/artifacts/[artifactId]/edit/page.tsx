"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getItemById,
  deleteItem,
  updateItem,
  UpdateItemPayload,
} from "@/lib/world-data";
import { ItemFormData, WorldItem, ArtifactItem } from "@/lib/types";
import { useFactionOptions } from "@/hooks/useFactionOptions";

import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

// Базовий URL для картинок
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace("/api", "")}/uploads`;

export default function EditArtifactPage() {
  const router = useRouter();
  const routeParams = useParams();
  const worldId = routeParams.worldId as string;
  // Отримуємо ID (безпечно)
  const artifactId = (routeParams.itemId || routeParams.artifactId) as string;

  const factionOptions = useFactionOptions(worldId);

  const [artifactData, setArtifactData] = useState<ArtifactItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  // --- Стейт для UI зображень (візуальна частина) ---
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]); // Тільки для показу

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Завантаження даних ---
  useEffect(() => {
    let isMounted = true;
    if (!artifactId) {
      setIsLoading(false);
      return;
    }

    getItemById(artifactId).then((data: WorldItem | null) => {
      if (isMounted && data) {
        const artifact = data as ArtifactItem;
        setArtifactData(artifact);

        // 1. Встановлюємо головне фото (якщо є)
        if (artifact.imageUrl) {
          setPreviewUrl(`${IMAGE_BASE_URL}/${artifact.imageUrl}`);
        }

        // 2. Встановлюємо галерею (якщо є)
        if (artifact.galleryImages && Array.isArray(artifact.galleryImages)) {
          setExistingGallery(artifact.galleryImages);
        }

        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [artifactId]);

  // --- UI Обробники (Тільки візуал) ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Тут ми просто показуємо прев'ю, логіку збереження ви просили не чіпати
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // src/app/worlds/[worldId]/artifacts/[artifactId]/edit/page.tsx

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));

      // 1. 🟢 ЗБЕРІГАЄМО ФАЙЛИ
      setNewGalleryFiles((prev) => [...prev, ...files]);

      // 2. ЗБЕРІГАЄМО ПРЕВ'Ю
      setNewGalleryPreviews((prev) => [...prev, ...urls]);
    }
    e.target.value = "";
  };

  // Видалення ТІЛЬКИ нових прев'ю (візуально)
  const removeNewGalleryImage = (index: number) => {
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ... (імпорти та стейт без змін)

  // Припустімо, що у вас є ці стейти (як ми їх вводили в попередніх обговореннях):
  // const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // ...

  // --- Збереження (Стара логіка + нові поля, але без обробки файлів поки що) ---
  // src/app/worlds/[worldId]/artifacts/[artifactId]/edit/page.tsx

  const handleSaveArtifact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Збір текстових даних та метаданих галереї
    const data: UpdateItemPayload = {
      name: (formData.get("name") as string) || artifactData?.name || "Unnamed",
      in_possession_of: formData.get("in_possession_of") as string,
      description: formData.get("description") as string,

      // 🟢 ВАЖЛИВО: Передаємо існуючі імена файлів, які потрібно зберегти
      existingGalleryImages: existingGallery,
    };

    // 1. 🟢 ЛОГУВАННЯ ФАЙЛІВ (для діагностики)
    const coverFile = fileInputRef.current?.files?.[0];

    console.log("--- DEBUG: Artifact Update Data ---");
    console.log("Text Data:", data);
    console.log("----------------------------------");

    // Логування головного фото (без змін)
    if (coverFile) {
      console.log(
        `Cover File Selected: ${coverFile.name} (${(
          coverFile.size / 1024
        ).toFixed(2)} KB)`
      );
    } else {
      console.log(
        `Cover File: Not changed. Existing URL: ${
          artifactData?.imageUrl || "None"
        }`
      );
    }

    const newFiles = newGalleryFiles; // Використовуємо стейт (припускаючи, що ви його оголосили)

    if (newFiles.length > 0) {
      console.log(`Gallery Files to Upload (New): ${newFiles.length} files`);
      newFiles.forEach((file) => {
        console.log(`  - ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      });
    } else {
      console.log("Gallery Files to Upload (New): None.");
    }

    console.log(
      `Existing Gallery Images (to keep): ${existingGallery.length} files`
    );
    console.log("----------------------------------");

    // 2. Виклик оновленого методу з усіма аргументами
    // coverFile та newGalleryFiles передаються окремими аргументами.
    // existingGalleryImages передається всередині об'єкта data.
    await updateItem(
      artifactId,
      data, // ⬅️ data тепер містить existingGalleryImages
      coverFile,
      newGalleryFiles.length > 0 ? newGalleryFiles : undefined
    );

    router.refresh();
    router.push(`/worlds/${worldId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${artifactData?.name}?`)) return;
    setIsLoading(true);
    await deleteItem(artifactId);
    router.refresh();
    router.push(`/worlds/${worldId}`);
  };

  const handleCancel = () => {
    router.push(`/worlds/${worldId}`);
  };

  if (isLoading)
    return (
      <PageContainer className="text-center py-20 text-white/50">
        Loading...
      </PageContainer>
    );
  if (!artifactData)
    return (
      <PageContainer className="text-center py-20 text-white/50">
        Artifact not found
      </PageContainer>
    );

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">ARTIFACT PROFILE</p>
        <h1 className="text-3xl font-semibold text-white">
          Edit {artifactData.name}
        </h1>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* --- ЛІВА КОЛОНКА (МЕДІА) --- */}
          <div className="flex flex-col gap-4">
            {/* 1. Головне фото */}
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

            {/* 2. Галерея */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <div className="flex items-center justify-between">
                <p className="font-display text-[11px] text-purple-100/80">
                  GALLERY
                </p>
                <span className="text-[10px] text-white/30">
                  {existingGallery.length + newGalleryPreviews.length} images
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
                      <span>x</span>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/20 text-[8px] text-center text-green-200 py-0.5 font-bold">
                      NEW
                    </div>
                  </div>
                ))}

                {/* Кнопка + */}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.02] transition hover:border-purple-400/50 hover:bg-purple-500/[0.05] hover:text-purple-300">
                  <span className="text-2xl font-light text-white/30 transition group-hover:text-purple-300">
                    +
                  </span>
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
          </div>

          {/* --- ПРАВА КОЛОНКА (Текстова форма) --- */}
          <form className="space-y-6" onSubmit={handleSaveArtifact}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Name
                </label>
                <Input
                  defaultValue={artifactData.name}
                  className="mt-2"
                  name="name"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  In possession of
                </label>
                <Select
                  // Використовуємо payload для правильного відображення
                  defaultValue={
                    (artifactData.in_possession_of as string) ||
                    factionOptions[0]?.id ||
                    "unknown"
                  }
                  className="mt-2"
                  name="in_possession_of"
                >
                  {factionOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Description
              </label>
              <Textarea
                // Використовуємо payload
                defaultValue={(artifactData.description as string) || ""}
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
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-red-400/50 hover:text-red-400"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
