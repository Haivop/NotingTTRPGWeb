"use client";

import { useMemo } from "react";
import { useWorldItems } from "@/hooks/useWorldItems";

interface FactionOption {
  id: string;
  name: string;
}

export function useFactionOptions(worldId: string) {
  const { items } = useWorldItems(worldId, "factions");

  const options: FactionOption[] = useMemo(() => {
    const normalized = items.map((item) => ({ id: item.id, name: item.name }));
    return [{ id: "unknown", name: "Unknown / Unaffiliated" }, ...normalized];
  }, [items]);

  return options;
}
