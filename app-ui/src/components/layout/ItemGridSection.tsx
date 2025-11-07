"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useWorldItems } from "@/hooks/useWorldItems";

interface GridItem {
  name: string;
  detail?: string;
  role?: string;
  hook?: string;
}

interface ItemGridSectionProps {
  id: string;
  title: string;
  data: GridItem[];
  addNewText: string;
}

export const ItemGridSection: React.FC<ItemGridSectionProps> = ({
  id,
  title,
  addNewText,
}) => {
  const router = useRouter();

  // Визначаємо тип об'єкта для URL (regions, characters, artifacts...)
  const itemType = id;

  const params = useParams();
  const worldId = params.worldId as string;

  const { items: data, loading } = useWorldItems(worldId, itemType);

  const handleCreateNew = async () => {
    // 2. Перенаправляємо на сторінку редагування/створення
    // URL-шаблон: /worlds/[worldId]/[itemType]/[newId]/edit
    const newUrl = `/worlds/${worldId}/${itemType}/create`;

    router.push(newUrl);
  };

  return (
    <GlassPanel id={id} title={title}>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((item) => (
          // 🏆 ВИКОРИСТОВУЄМО LINK ДЛЯ НАВІГАЦІЇ
          <Link
            key={item.id}
            href={`/worlds/${worldId}/${itemType}/${item.id}/edit`} // 👈 НОВИЙ МАРШРУТ
            className="flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/5 text-center text-white/70 transition-colors hover:border-purple-400/50 hover:bg-purple-900/10 cursor-pointer"
          >
            {/* Placeholder for Image */}
            <div className="h-20 rounded-lg bg-gray-600/50 flex items-center justify-center text-xs">
              [Image Placeholder]
            </div>
            <p className="font-display text-sm text-purple-100/90 mt-2">
              {item.name}
            </p>
          </Link>
        ))}
        {/* Кнопка + New X */}
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 p-4 text-white/50 transition hover:border-purple-400/50 hover:text-purple-400 cursor-pointer"
          onClick={handleCreateNew}
        >
          <span className="text-3xl font-light">+</span>
          <p className="text-sm mt-2">{addNewText}</p>
        </div>
      </div>
    </GlassPanel>
  );
};
