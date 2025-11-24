"use client";

import { useState, useEffect } from "react";
import { getItemsByType, WorldItem } from "@/lib/world-data";
import { usePathname } from "next/navigation";

export function useWorldItems(worldId: string, itemType: string) {
  const [items, setItems] = useState<WorldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    async function fetchItems() {
      try {
        // setLoading(true);
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
          setLoading(false);
        }
      }
    }

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [worldId, itemType, pathname]);

  return { items, loading };
}
