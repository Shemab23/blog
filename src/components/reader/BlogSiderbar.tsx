"use client";

import { BlogEntry, TocTopic } from "@/data/BlogRegistry";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type BlogSidebarProps = {
  blog: BlogEntry;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredTopics: TocTopic[];
  highlightedSubTopicIds: Set<string>;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  recommendedBlogs: BlogEntry[];
  isMobile?: boolean;
  onCloseMobile?: () => void;
};

export const BlogSidebar = ({
  blog,
  searchQuery,
  onSearchChange,
  filteredTopics,
  highlightedSubTopicIds,
  activeSectionId,
  onSelectSection,
  recommendedBlogs,
  isMobile = false,
  onCloseMobile,
}: BlogSidebarProps) => {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col h-full bg-sidebar text-foreground">
      {/* 1. Course Logo, Name, Recorded Date & Tags */}
      <div className="p-4 border-b border-border space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-8 w-8 rounded-md border border-border bg-card flex items-center justify-center overflow-hidden shrink-0">
              {blog.media.logoImage ? (
                <Image
                  src={blog.media.logoImage}
                  alt={`${blog.name} logo`}
                  fill
                  sizes="32px"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <span className="text-xs font-mono font-bold text-primary">
                  {blog.media.initials}
                </span>
              )}
            </div>

            <h2 className="text-xs font-semibold leading-snug truncate">
              {blog.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {blog.recordedDate && (
              <span className="text-[11px] font-mono text-muted-foreground">
                {blog.recordedDate}
              </span>
            )}
            {isMobile && onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close sidebar"
                className="px-2 py-0.5 rounded border border-border text-xs hover:bg-accent cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tags beneath Logo & Name (normalizes leading '#' so it never renders '##Tag') */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.map((tag) => {
              const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
              return (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground"
                >
                  {formattedTag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Search Bar (Filters TOC & highlights matching sub-topics until cleared) */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chapters or summaries..."
            className="w-full h-8 px-2.5 pr-12 rounded-md border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {isSearching && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-primary hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. Scrollable Area: Table of Contents + Recommended Blogs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Table of Contents */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/60">
            <span>
              {isSearching ? "Filtered table of content" : "Table of content"}
            </span>
            {isSearching && (
              <span>
                {filteredTopics.length}{" "}
                {filteredTopics.length === 1 ? "chapter" : "chapters"}
              </span>
            )}
          </div>

          {filteredTopics.length > 0 ? (
            <nav
              aria-label="Table of contents"
              className="space-y-3 text-xs font-mono"
            >
              {filteredTopics.map((topic) => {
                // Clicking a top-level topic scrolls to its very first sub-topic (or topic.id)
                const targetTopicScrollId = topic.subTopics[0]?.id || topic.id;

                const isTopicActive =
                  activeSectionId === topic.id ||
                  topic.subTopics.some((sub) => sub.id === activeSectionId);

                return (
                  <div key={topic.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => onSelectSection(targetTopicScrollId)}
                      className={`text-left w-full py-0.5 transition-colors truncate cursor-pointer ${
                        isTopicActive
                          ? "text-foreground font-semibold"
                          : "text-foreground/85 font-medium hover:text-primary"
                      }`}
                    >
                      {topic.title}
                    </button>

                    {topic.subTopics.length > 0 && (
                      <ul className="pl-3 border-l border-border/80 space-y-1">
                        {topic.subTopics.map((sub) => {
                          const isSubActive = activeSectionId === sub.id;
                          const isKeywordMatch =
                            isSearching && highlightedSubTopicIds.has(sub.id);

                          return (
                            <li key={sub.id}>
                              <button
                                type="button"
                                onClick={() => onSelectSection(sub.id)}
                                className={`text-left w-full py-0.5 text-[11px] transition-colors truncate cursor-pointer ${
                                  isKeywordMatch
                                    ? "text-primary font-semibold"
                                    : isSubActive
                                      ? "text-foreground font-medium"
                                      : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {sub.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          ) : (
            <div className="py-4 text-center space-y-2">
              <p className="text-xs font-mono text-muted-foreground">
                No matching topics or summaries.
              </p>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-[11px] font-mono text-primary hover:underline cursor-pointer"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>

        {/* Recommended Next Blogs (Only rendered when recommendedBlogs has items) */}
        {recommendedBlogs.length > 0 && (
          <div className="pt-4 border-t border-border space-y-2.5">
            <div className="text-[11px] font-mono text-muted-foreground/60">
              Recommended next
            </div>
            <div className="space-y-2">
              {recommendedBlogs.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/blogs/${rec.slug}`}
                  onClick={onCloseMobile}
                  className="group block p-2.5 rounded-lg border border-border bg-card/60 hover:border-foreground/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                      {rec.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                  {rec.tags.length > 0 && (
                    <div className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                      {rec.tags.slice(0, 2).join(" • ")}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Action: Go Back Home */}
      <div className="p-3 border-t border-border">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="w-full py-2 px-3 rounded-md border border-border bg-card hover:bg-muted/60 transition-colors flex items-center justify-center gap-2 text-xs font-mono text-foreground"
        >
          <span>← Back Home</span>
        </Link>
      </div>
    </div>
  );
};
