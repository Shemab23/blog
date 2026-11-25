export type MaterialType =
  | "ebook"
  | "book-recommendation"
  | "cheatsheet"
  | "template";

export interface MaterialAccessConfig {
  isOpen: boolean; // Currently true for everyone; later toggled by external auth/payment service
  accessTier: "free" | "paid" | "members";
  externalProductId?: string; // ID used to sync with Gumroad, LemonSqueezy, or your Cloudflare service
  allowedEmails?: string[]; // Optional allowlist hook for future integration
}

export interface MaterialEntry {
  id: string;
  title: string;
  author: string;
  type: MaterialType;
  coverImage?: string;
  initials: string;
  description: string;
  actionUrl: string; // Link to view, download, or external store
  actionLabel: string; // e.g. "Read / Download PDF", "Get Book"
  tags: string[];
  access: MaterialAccessConfig;
}

export const MATERIAL_REGISTRY: MaterialEntry[] = [];

export function registerMaterial(entry: MaterialEntry) {
  const existingIndex = MATERIAL_REGISTRY.findIndex((m) => m.id === entry.id);
  if (existingIndex !== -1) {
    MATERIAL_REGISTRY[existingIndex] = entry;
  } else {
    MATERIAL_REGISTRY.push(entry);
  }
}
