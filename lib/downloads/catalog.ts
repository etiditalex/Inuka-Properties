export type StaticDownloadItem = {
  id: number;
  title: string;
  file_url: string;
  parent_id: number | null;
  sort_order: number;
};

export const STATIC_DOWNLOAD_ITEMS: StaticDownloadItem[] = [
  {
    id: 1,
    title: "Inuka Afrika Company Profile",
    file_url: "/downloads/Inuka-Afrika-Company-Profile.pdf",
    parent_id: null,
    sort_order: 1,
  },
  {
    id: 2,
    title: "Property Listings",
    file_url: "/downloads/inuka-12-13-25.pdf",
    parent_id: null,
    sort_order: 2,
  },
  { id: 6, title: "Ridge View Map", file_url: "/downloads/RIDGE VIEW (10).pdf", parent_id: 2, sort_order: 1 },
  { id: 7, title: "Chumani 3 Ext Map", file_url: "/downloads/CHUMANI 3 EXT (7).pdf", parent_id: 2, sort_order: 2 },
  { id: 8, title: "Ridgeview Phase 3 Map", file_url: "/downloads/RIDGEVIEW PHASE 3 (5).pdf", parent_id: 2, sort_order: 3 },
  { id: 9, title: "Mariakani 6 Map", file_url: "/downloads/MARIAKANI 6.pdf", parent_id: 2, sort_order: 4 },
  { id: 10, title: "Mwanda Phase 3 Map", file_url: "/downloads/MWANDA PHASE 3.pdf", parent_id: 2, sort_order: 5 },
  { id: 11, title: "Ridgeview Phase 4 Map", file_url: "/downloads/RIDGEVIEW PHASE 4 (9) (1).pdf", parent_id: 2, sort_order: 6 },
  { id: 12, title: "Tezo Nerenya Map", file_url: "/downloads/TEZO NERENYA (3).pdf", parent_id: 2, sort_order: 7 },
  { id: 13, title: "Ridgeview Phase 2 Map", file_url: "/downloads/RIDGEVIEW PHASE 2 (5).pdf", parent_id: 2, sort_order: 8 },
  { id: 14, title: "Chumani 3 Ext Map (Alt)", file_url: "/downloads/CHUMANI 3 EXT (8).pdf", parent_id: 2, sort_order: 9 },
  { id: 15, title: "Tezo Nerenya Map (Alt)", file_url: "/downloads/TEZO NERENYA (2).pdf", parent_id: 2, sort_order: 10 },
  { id: 16, title: "Oceanview Gardens Map", file_url: "/downloads/OCEANVIEW GARDENS (1) (3).pdf", parent_id: 2, sort_order: 11 },
  { id: 17, title: "Chumani Map", file_url: "/downloads/CHUMANI (2).pdf", parent_id: 2, sort_order: 12 },
  { id: 18, title: "Bofa Phase 3 Map", file_url: "/downloads/BOFA PHASE 3.pdf", parent_id: 2, sort_order: 13 },
  { id: 19, title: "Bofa Phase 9 Map", file_url: "/downloads/BOFA PHASE 9 (1).pdf", parent_id: 2, sort_order: 14 },
  { id: 20, title: "Inuka Chumani Phase 3 Map", file_url: "/downloads/INUKA_CHUMANI PHASE 3 (3).pdf", parent_id: 2, sort_order: 15 },
  { id: 21, title: "Majaoni 2 Map", file_url: "/downloads/MAJAONI 2 (3).pdf", parent_id: 2, sort_order: 16 },
  { id: 22, title: "Rafiki Phase 5 Map", file_url: "/downloads/RAFIKI PHASE 5 (3).pdf", parent_id: 2, sort_order: 17 },
  { id: 23, title: "Msabaha Phase 6 Map", file_url: "/downloads/MSABAHA PHASE 6 (2).pdf", parent_id: 2, sort_order: 18 },
  { id: 24, title: "New Rafiki 4Ext Map", file_url: "/downloads/NEW RAFIKI 4EXT MAP (3).pdf", parent_id: 2, sort_order: 19 },
  { id: 25, title: "Ridgeview 5 Extension Map", file_url: "/downloads/RIDGEVIEW 5 EXTENSION (1) (1) (3).pdf", parent_id: 2, sort_order: 20 },
  { id: 26, title: "Mwanda Phase 3 Map (Alt)", file_url: "/downloads/MWANDA PHASE 3 (3).pdf", parent_id: 2, sort_order: 21 },
  { id: 27, title: "Mida Parkview Phase 1 Map", file_url: "/downloads/MIDA PARKVIEW PHASE 1 (2) (1).pdf", parent_id: 2, sort_order: 22 },
  { id: 28, title: "Matsangoni Map", file_url: "/downloads/MATSANGONI (1).pdf", parent_id: 2, sort_order: 23 },
  { id: 29, title: "Mida Haven Phase 2 Map", file_url: "/downloads/MIDA HAVEN PHASE 2 (1).pdf", parent_id: 2, sort_order: 24 },
];

/** Build nested tree for frontend display */
export function buildDownloadTree(
  items: { id: number; title: string; file_url: string; parent_id: number | null }[]
) {
  const roots = items.filter((i) => i.parent_id == null);
  return roots.map((root) => ({
    id: root.id,
    title: root.title,
    file: root.file_url,
    subItems: items
      .filter((i) => i.parent_id === root.id)
      .map((child) => ({
        id: child.id,
        title: child.title,
        file: child.file_url,
      })),
  }));
}
