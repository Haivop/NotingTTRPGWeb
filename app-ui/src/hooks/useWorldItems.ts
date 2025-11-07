// src/hooks/useWorldItems.ts
"use client";

import { useState, useEffect } from "react";
import { getItemsByType, WorldItem } from "@/lib/world-data";
import { usePathname } from "next/navigation";

export function useWorldItems(worldId: string, itemType: string) {
  const [items, setItems] = useState<WorldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true; // Для запобігання оновлення стану на неіснуючому компоненті

    async function fetchItems() {
      try {
        // setLoading(true); // Видаляємо, оскільки loading вже true
        const data = await getItemsByType(worldId, itemType);

        if (isMounted) {
          setItems(data);
        }
      } catch (error) {
        console.error(`Failed to load ${itemType}:`, error);
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Встановлення false безпечне
        }
      }
    }

    fetchItems();

    // Функція очищення (Cleanup function)
    return () => {
      isMounted = false;
    };
  }, [worldId, itemType, pathname]); // Перезавантажуємо при зміні параметрів

  return { items, loading };
}
