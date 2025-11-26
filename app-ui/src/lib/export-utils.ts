import { WorldEntity, WorldItem } from "./types";

const CATEGORIES = [
  "continents",
  "regions",
  "locations",
  "factions",
  "characters",
  "quests",
  "artifacts",
  "timelines",
];

export function generateMarkdown(
  world: WorldEntity,
  collections: Record<string, WorldItem[]>
): string {
  let md = `# ${world.name}\n\n`;

  if (world.description) {
    md += `> ${world.description}\n\n`;
  }

  md += `---\n\n`;

  CATEGORIES.forEach((category) => {
    const items = collections[category];
    if (items && items.length > 0) {
      md += `## ${category.toUpperCase()}\n\n`;

      items.forEach((item: any) => {
        md += `### ${item.name}\n`;

        if (item.imageUrl) {
          md += `![${item.name} Image](uploads/${item.imageUrl})\n\n`;
        }

        if (item.role) md += `**Role:** ${item.role}\n\n`;
        if (item.faction) md += `**Faction:** ${item.faction}\n\n`;
        if (item.status) md += `**Status:** ${item.status}\n\n`;
        if (item.location_type) md += `**Type:** ${item.location_type}\n\n`;

        if (item.description) {
          md += `${item.description}\n\n`;
        }

        md += `---\n\n`;
      });
    }
  });

  return md;
}

export function downloadFile(
  filename: string,
  content: string,
  contentType: string
) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
