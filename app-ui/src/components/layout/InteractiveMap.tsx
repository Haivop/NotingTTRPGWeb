"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorldItem } from "@/lib/types";

const PIN_COLORS = [
  { name: "Red", value: "text-red-500", bg: "bg-red-500" },
  { name: "Orange", value: "text-orange-500", bg: "bg-orange-500" },
  { name: "Amber", value: "text-amber-400", bg: "bg-amber-400" },
  { name: "Green", value: "text-green-500", bg: "bg-green-500" },
  { name: "Cyan", value: "text-cyan-400", bg: "bg-cyan-400" },
  { name: "Blue", value: "text-blue-500", bg: "bg-blue-500" },
  { name: "Purple", value: "text-purple-500", bg: "bg-purple-500" },
  { name: "Pink", value: "text-pink-500", bg: "bg-pink-500" },
  { name: "White", value: "text-white", bg: "bg-white" },
  { name: "Gray", value: "text-gray-400", bg: "bg-gray-400" },
];

const MapMarkerIcon = ({
  className,
  colorClass,
}: {
  className?: string;
  colorClass?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} ${colorClass || "text-red-500"}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z" />
  </svg>
);

export interface MapPin {
  id: string;
  x: number;
  y: number;
  color?: string;
  linkedItem?: {
    id: string;
    name: string;
    type: string;
  };
}

interface InteractiveMapProps {
  mapUrl: string;
  initialPins: MapPin[];
  availableItems: WorldItem[];
  isEditable: boolean;
  worldId: string;
  onSavePin: (pinData: {
    x: number;
    y: number;
    itemId: string;
    color?: string;
  }) => Promise<void>;
  onDeletePin: (pinId: string) => Promise<void>;
}

export const InteractiveMap = ({
  mapUrl,
  initialPins,
  availableItems,
  isEditable,
  worldId,
  onSavePin,
  onDeletePin,
}: InteractiveMapProps) => {
  const router = useRouter();
  const [pins, setPins] = useState<MapPin[]>(initialPins);

  useEffect(() => {
    setPins(initialPins);
  }, [initialPins]);

  const [isCreating, setIsCreating] = useState(false);
  const [tempCoords, setTempCoords] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(
    PIN_COLORS[0].value
  );

  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditable || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTempCoords({ x, y });
    setIsCreating(true);
    setSelectedColor(PIN_COLORS[0].value);
  };

  const confirmPinCreation = async () => {
    if (!tempCoords || !selectedItemId) return;

    await onSavePin({
      x: tempCoords.x,
      y: tempCoords.y,
      itemId: selectedItemId,
      color: selectedColor,
    });

    setIsCreating(false);
    setTempCoords(null);
    setSelectedItemId("");
    // window.location.reload(); // Краще оновлювати стейт локально, ніж перезавантажувати сторінку
  };

  const handlePinClick = (e: React.MouseEvent, pin: MapPin) => {
    e.stopPropagation();
    if (pin.linkedItem) {
      router.push(
        `/worlds/${worldId}/${pin.linkedItem.type}/${pin.linkedItem.id}`
      );
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black/50 border border-white/10 shadow-2xl">
      <div
        ref={mapRef}
        className={`relative w-full select-none ${
          isEditable ? "cursor-crosshair" : "cursor-grab"
        }`}
        onClick={handleMapClick}
      >
        <img
          src={mapUrl}
          alt="World Map"
          className="w-full h-auto object-contain pointer-events-none"
        />

        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute group flex flex-col items-center"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: "translate(-50%, -100%)",
              zIndex: 20,
            }}
            onClick={(e) => handlePinClick(e, pin)}
          >
            <MapMarkerIcon
              className="w-8 h-8 drop-shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
              colorClass={pin.color}
            />

            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
              <div className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex flex-col items-center">
                <span className="font-bold">
                  {pin.linkedItem?.name || "Unknown"}
                </span>
                <span className="text-[9px] text-white/50 uppercase tracking-wider">
                  {pin.linkedItem?.type}
                </span>
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/80 mx-auto"></div>
            </div>

            {isEditable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePin(pin.id);
                }}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-30"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {isCreating && tempCoords && (
          <div
            className="absolute"
            style={{
              left: `${tempCoords.x}%`,
              top: `${tempCoords.y}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <MapMarkerIcon
              className="w-8 h-8 animate-bounce drop-shadow-lg"
              colorClass={selectedColor}
            />
          </div>
        )}
      </div>

      {isCreating && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur border border-white/20 p-4 rounded-xl flex flex-col gap-3 shadow-2xl z-30 w-[95%] max-w-md animate-in slide-in-from-bottom-5 fade-in">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-[10px] text-purple-300 uppercase font-bold mb-1.5 block tracking-wider">
                Link Entity
              </label>
              <select
                className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-lg p-2.5 focus:border-purple-500 outline-none transition-colors"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                <option value="">-- Select a Location, Quest, etc. --</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.type}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={confirmPinCreation}
              disabled={!selectedItemId}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg"
            >
              Pin
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setTempCoords(null);
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2.5 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase font-bold mb-1.5 block tracking-wider">
              Marker Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PIN_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    color.bg
                  } ${
                    selectedColor === color.value
                      ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
