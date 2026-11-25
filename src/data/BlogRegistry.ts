import type { ComponentType } from "react";

// 1. Sub-Topic (Individual section inside a top-level topic)
export interface TocSubTopic {
  id: string;
  title: string;
  component: ComponentType;
}

// 2. Top-Level Topic (Groups sub-topics in the TOC & main view)
export interface TocTopic {
  id: string;
  title: string;
  subTopics: TocSubTopic[];
}

// 3. Searchable Summary Structure
export interface SectionSummary {
  topic: string;
  scrollToId: string;
  summary: string; // Supports structured format e.g. "1.1: ..., 1.2: ..."
}

export interface BlogSummary {
  general: string;
  sections: SectionSummary[]; // chapters
}

// 4. Media Structure
export interface BlogMedia {
  coverImage?: string;
  logoImage?: string;
  initials: string;
}

// 5. Main Blog Entry Type
export interface BlogEntry {
  id: string;
  slug: string;
  name: string;
  version?: string; // e.g. "v1.0"
  recordedDate?: string; // e.g. "2026/07"
  tags: string[];
  recommendedIds?: string[]; // IDs or slugs of blogs recommended to read/watch next
  media: BlogMedia;
  summary: BlogSummary;
  tableOfContents: TocTopic[];
  component: ComponentType;
}

export const BLOG_REGISTRY: BlogEntry[] = [];
export const FeaturedTags: string[] = [];

// Deduplicates by UUID and normalizes optional metadata defaults
export function registerBlog(entry: BlogEntry, tags?: string[]) {
  const normalizedEntry: BlogEntry = {
    ...entry,
    version: entry.version ?? "v1.0",
    recordedDate: entry.recordedDate ?? "",
    recommendedIds: entry.recommendedIds ?? [],
  };

  const existingIndex = BLOG_REGISTRY.findIndex(
    (b) => b.id === normalizedEntry.id,
  );

  if (existingIndex !== -1) {
    BLOG_REGISTRY[existingIndex] = normalizedEntry;
  } else {
    BLOG_REGISTRY.push(normalizedEntry);
  }

  const tagsToRegister = Array.isArray(tags) ? tags : entry.tags;
  if (Array.isArray(tagsToRegister)) {
    for (const tag of tagsToRegister) {
      if (!FeaturedTags.includes(tag)) {
        FeaturedTags.push(tag);
      }
    }
  }
}
