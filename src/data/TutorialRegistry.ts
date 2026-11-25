export interface TutorialEntry {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string; // Crucial for visual click-through
  duration: string; // e.g. "18:45"
  publishedDate: string; // e.g. "2026/08"
  tags: string[];
  whatToExpect: string[]; // Bullet points of what viewers will learn
  relatedBlogSlug?: string; // Optional link back to your written note
}

export const TUTORIAL_REGISTRY: TutorialEntry[] = [];
export const TutorialTags: string[] = [];

export function registerTutorial(entry: TutorialEntry) {
  const existingIndex = TUTORIAL_REGISTRY.findIndex((t) => t.id === entry.id);
  if (existingIndex !== -1) {
    TUTORIAL_REGISTRY[existingIndex] = entry;
  } else {
    TUTORIAL_REGISTRY.push(entry);
  }

  for (const tag of entry.tags) {
    if (!TutorialTags.includes(tag)) {
      TutorialTags.push(tag);
    }
  }
}
