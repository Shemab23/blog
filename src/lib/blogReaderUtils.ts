import { BlogEntry, TocTopic } from "@/data/BlogRegistry";

export interface FilteredTocResult {
  filteredTopics: TocTopic[];
  highlightedSubTopicIds: Set<string>;
}

/**
 * Filters the Table of Contents based on a search query across:
 * 1. Top-level topic titles
 * 2. Sub-topic titles
 * 3. Section summaries (linked directly via `scrollToId`)
 *
 * Returns matching chapters and the exact sub-topic IDs to highlight in primary color.
 */
export function filterAndHighlightToc(
  blog: BlogEntry,
  query: string,
): FilteredTocResult {
  const q = query.trim().toLowerCase();
  const highlightedSubTopicIds = new Set<string>();

  if (!q) {
    return {
      filteredTopics: blog.tableOfContents,
      highlightedSubTopicIds,
    };
  }

  // Index section summaries directly by their target `scrollToId`
  const summaryById = new Map<string, string>();
  for (const sec of blog.summary.sections) {
    const existing = summaryById.get(sec.scrollToId) ?? "";
    summaryById.set(
      sec.scrollToId,
      `${existing} ${sec.topic} ${sec.summary}`.trim(),
    );
  }

  const filteredTopics: TocTopic[] = [];

  for (const topic of blog.tableOfContents) {
    const topicTitleMatches = topic.title.toLowerCase().includes(q);
    const topicSummaryMatches = (summaryById.get(topic.id) ?? "")
      .toLowerCase()
      .includes(q);

    let hasMatchingSubTopic = false;

    for (const sub of topic.subTopics) {
      const subTitleMatches = sub.title.toLowerCase().includes(q);
      const subSummaryMatches = (summaryById.get(sub.id) ?? "")
        .toLowerCase()
        .includes(q);

      if (subTitleMatches || subSummaryMatches) {
        highlightedSubTopicIds.add(sub.id);
        hasMatchingSubTopic = true;
      }
    }

    // Keep the chapter (along with its sub-topics) if either the chapter or any sub-topic matched
    if (topicTitleMatches || topicSummaryMatches || hasMatchingSubTopic) {
      filteredTopics.push(topic);
    }
  }

  return { filteredTopics, highlightedSubTopicIds };
}

/**
 * Resolves the active "Topic / Subtopic" breadcrumb from the currently visible section ID.
 */

export interface BreadcrumbItem {
  id: string;
  title: string;
}

export interface BreadcrumbItem {
  id: string;
  title: string;
}

/**
 * Resolves the active nested breadcrumb trail as an iterable array:
 * e.g. [{ id: topic.id, title: "1. Variables & Data Types" }, { id: sub.id, title: "1.1 Primitive Types" }]
 */
export function getActiveBreadcrumb(
  toc: TocTopic[],
  activeSectionId: string,
): BreadcrumbItem[] {
  if (!toc.length) {
    return [{ id: "overview", title: "Overview" }];
  }

  for (const topic of toc) {
    // 1. Check sub-topics first so exact sub-topic matches take priority
    const matchedSub = topic.subTopics.find(
      (sub) => sub.id === activeSectionId,
    );
    if (matchedSub) {
      return [
        { id: topic.id, title: topic.title },
        { id: matchedSub.id, title: matchedSub.title },
      ];
    }

    // 2. If the top-level topic itself is active, default to its first sub-topic
    if (topic.id === activeSectionId) {
      const firstSub = topic.subTopics[0];
      return firstSub
        ? [
            { id: topic.id, title: topic.title },
            { id: firstSub.id, title: firstSub.title },
          ]
        : [{ id: topic.id, title: topic.title }];
    }
  }

  // 3. Fallback to the very first topic & its first sub-topic on initial load
  const firstTopic = toc[0];
  const firstSubTopic = firstTopic.subTopics[0];

  return firstSubTopic
    ? [
        { id: firstTopic.id, title: firstTopic.title },
        { id: firstSubTopic.id, title: firstSubTopic.title },
      ]
    : [{ id: firstTopic.id, title: firstTopic.title }];
}
