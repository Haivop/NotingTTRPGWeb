"use client";

import { useEffect, useState } from "react";
import { getItemById } from "@/lib/world-data";
import { WorldItem } from "@/lib/types";

export function useWorldItem(itemId?: string) {
  const [item, setItem] = useState<WorldItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!itemId) {
      setItem(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getItemById(itemId)
      .then((data) => {
        if (isMounted) {
          setItem(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load world item", error);
        if (isMounted) {
          setItem(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  return { item, loading };
}

