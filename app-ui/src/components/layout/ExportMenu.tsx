"use client";

import React, { useState } from "react";
import { WorldEntity, WorldItem } from "@/lib/types";
import { generateMarkdown, downloadFile } from "@/lib/export-utils";

// Базовий URL для картинок
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const IMAGE_BASE_URL = `${API_BASE.replace(/\/api\/?$/, "")}/uploads`;

interface ExportMenuProps {
  world: WorldEntity;
  collections: Record<string, WorldItem[]>;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  world,
  collections,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportMarkdown = () => {
    const mdContent = generateMarkdown(world, collections);
    const filename = `${world.name.replace(/\s+/g, "_")}_Export.md`;
    downloadFile(filename, mdContent, "text/markdown");
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById("pdf-export-container");

    if (!element) {
      console.error("PDF container element not found!");
      setIsExporting(false);
      return;
    }

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        // Виправляємо помилку типів TypeScript, явно вказуючи кортеж
        margin: [10, 10] as [number, number],
        filename: `${world.name.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          // 🟢 ВАЖЛИВО: Вимикаємо background, щоб html2canvas не ліз у глобальні стилі
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF Export failed", e);
      alert("Failed to generate PDF. Check console.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderItemImages = (item: any) => {
    const coverUrl = item.imageUrl
      ? `${IMAGE_BASE_URL}/${item.imageUrl}`
      : null;
    const gallery = item.galleryImages || [];

    if (!coverUrl && gallery.length === 0) return null;

    return (
      <div style={{ marginBottom: "16px" }}>
        {/* Використовуємо інлайн-стилі для розмірів, щоб уникнути Tailwind класів */}
        {coverUrl && (
          <div
            style={{
              marginBottom: "16px",
              width: "50%",
              border: "1px solid #e5e7eb",
              padding: "4px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={item.name + " Cover"}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        )}
        {gallery.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {gallery.map((img: string, idx: number) => (
              <div
                key={idx}
                style={{
                  width: "80px",
                  height: "80px",
                  border: "1px solid #e5e7eb",
                  padding: "2px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${IMAGE_BASE_URL}/${img}`}
                  alt={`Gallery ${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportMarkdown}
        className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        MD
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        {isExporting ? "..." : "PDF"}
      </button>

      {/* 🖨️ ПРИХОВАНИЙ КОНТЕЙНЕР ДЛЯ PDF 
         Ми повністю відмовляємося від класів Tailwind тут, щоб уникнути 'oklch'.
         Тільки чистий CSS (inline styles).
      */}
      <div className="hidden">
        <div
          id="pdf-export-container"
          style={{
            width: "800px",
            padding: "32px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontFamily: "serif",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "16px",
              borderBottom: "3px solid #000000",
              paddingBottom: "8px",
              color: "#000000",
            }}
          >
            {world.name}
          </h1>

          <p
            style={{
              fontSize: "18px",
              fontStyle: "italic",
              marginBottom: "32px",
              color: "#333333",
              lineHeight: "1.5",
            }}
          >
            {world.description}
          </p>

          {world.mapUrl && (
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#4c1d95",
                  marginBottom: "16px",
                }}
              >
                World Map
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${IMAGE_BASE_URL}/${world.mapUrl}`}
                alt="World Map"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  border: "2px solid #d1d5db",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          )}

          {Object.keys(collections).map((key) => {
            const items = collections[key];
            if (!items || items.length === 0) return null;

            return (
              <div key={key} style={{ marginBottom: "32px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    borderBottom: "2px solid #4c1d95",
                    color: "#4c1d95",
                    paddingBottom: "8px",
                    marginBottom: "24px",
                  }}
                >
                  {key}
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "16px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#f9fafb",
                        borderRadius: "4px",
                        pageBreakInside: "avoid",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "8px",
                          color: "#000000",
                        }}
                      >
                        {item.name}
                      </h3>

                      <div
                        style={{
                          marginBottom: "16px",
                          paddingBottom: "8px",
                          borderBottom: "1px solid #d1d5db",
                          fontSize: "14px",
                          color: "#4b5563",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                        }}
                      >
                        {item.role && (
                          <span>
                            <strong>Role:</strong> {item.role}
                          </span>
                        )}
                        {item.faction && (
                          <span>
                            <strong>Faction:</strong> {item.faction}
                          </span>
                        )}
                        {item.location_type && (
                          <span>
                            <strong>Type:</strong> {item.location_type}
                          </span>
                        )}
                        {item.status && (
                          <span>
                            <strong>Status:</strong> {item.status}
                          </span>
                        )}
                      </div>

                      {renderItemImages(item)}

                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          color: "#1f2937",
                        }}
                      >
                        {item.description || <em>No description provided.</em>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div
            style={{
              marginTop: "40px",
              textAlign: "center",
              fontSize: "12px",
              color: "#9ca3af",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "10px",
            }}
          >
            Generated by WorldCraftery on {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
