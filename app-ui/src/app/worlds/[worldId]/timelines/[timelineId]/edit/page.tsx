// src/app/worlds/[worldId]/characters/[itemId]/edit/page.tsx
"use client"; // 👈 Робимо компонент клієнтським

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getItemById, deleteItem, updateItem } from "@/lib/world-data"; // Функції API

import { ItemFormData, WorldItem, TimelineItem } from "@/lib/types";

import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const ITEM_TYPE = "timelines";

export default function EditTimelinePage({
  params,
}: {
  params: { worldId: string; timelineId: string }; // 👈 Змінено з questId на itemId
}) {
  const router = useRouter();
  //const { worldId, timelineId } = params;
  const routeParams = useParams();
  const worldId = routeParams.worldId as string;
  const timelineId = routeParams.timelineId as string;

  const [timelineData, setTimelineData] = useState<TimelineItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Асинхронне завантаження даних персонажа ---
  useEffect(() => {
    let isMounted = true;

    getItemById(timelineId).then((data: WorldItem | null) => {
      if (isMounted) {
        setTimelineData(data as TimelineItem);
        setIsLoading(false);
      }
    });

    // Функція очищення: встановлюємо прапорець у false, коли компонент демонтується
    return () => {
      isMounted = false;
    };
  }, [timelineId]);

  // --- 2. Обробник надсилання форми ---
  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Збір даних форми (всі поля повинні мати атрибут 'name')
    const data: ItemFormData = {
      name: (formData.get("name") as string) || timelineData?.name || "Unnamed",
      description: formData.get("description") as string,
    };

    // Виклик API для оновлення (itemId != new-temp-id, тому відбувається оновлення)
    await updateItem(timelineId, data);

    // Оновлення та перенаправлення
    router.refresh();
    router.push(`/worlds/${worldId}`);
  };

  const handleDelete = async () => {
    // 💡 Використовуємо window.confirm для запобігання випадковому видаленню
    if (
      !window.confirm(
        `Are you sure you want to delete ${timelineData?.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true); // Показуємо Loading під час видалення

    try {
      await deleteItem(timelineId);

      // 🏆 УСПІХ: Після видалення перенаправляємо на сторінку світу
      router.refresh();
      router.push(`/worlds/${worldId}`);
    } catch (error) {
      console.error("Error deleting character:", error);
      setIsLoading(false); // Залишаємося на сторінці і показуємо помилку
      alert("Failed to delete character.");
    }
  };

  if (isLoading) {
    return (
      <PageContainer className="text-white text-center py-20">
        Loading Timeline...
      </PageContainer>
    );
  }

  if (!timelineData) {
    return (
      <PageContainer className="text-white text-center py-20">
        Timeline Not Found!
      </PageContainer>
    );
  }

  const currentCharacterName = timelineData.name;

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs text-purple-200">TIMELINE PROFILE</p>
        <h1 className="text-3xl font-semibold text-white">
          Edit {currentCharacterName}
        </h1>
      </header>

      <GlassPanel>
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* ... (Зображення, Галерея) ... */}
          <div className="flex flex-col gap-4">
            {/* Замість Quest Art використовуємо Character Art */}
            <div className="h-64 rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_50%_0%,rgba(192,132,252,0.45),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.3),transparent_65%)]" />
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Upload Image
            </button>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-display text-[11px] text-purple-100/80">
                Timeline Notes
              </p>
              <p className="mt-2">
                Pin maps, handouts, or secrets relevant to this timeline.
              </p>
              <button
                type="button"
                className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/40 hover:text-white"
              >
                + Add Item
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSaveProfile}>
            {/* --- ПОЛЯ ПЕРСОНАЖА --- */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Name
                </label>
                <Input
                  defaultValue={timelineData.name}
                  className="mt-2"
                  name="name"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Description
              </label>
              <Textarea
                defaultValue={timelineData.description}
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
                Delete Timeline
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
