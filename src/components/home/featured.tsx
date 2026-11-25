"use client";

import { BlogEntry } from "@/data/BlogRegistry";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { links } from "@/data/HomeData";

type FeaturedBlogsSectionProps = {
  blogs: BlogEntry[];
  featuredTags?: string[];
};

export const FeaturedBlogsSection = ({
  blogs,
  featuredTags = [],
}: FeaturedBlogsSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "topics">("latest");

  const filterTabs = useMemo(
    () => [
      { id: "all", label: "All" },
      ...featuredTags.map((tag) => ({ id: tag, label: tag })),
    ],
    [featuredTags],
  );

  // 1. Filter & sort across ALL registered blogs
  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = blogs.filter((blog) => {
      const matchesTag =
        activeTag === "all" ||
        blog.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());

      const matchesSearch =
        !query ||
        blog.name.toLowerCase().includes(query) ||
        blog.summary?.general.toLowerCase().includes(query) ||
        blog.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesTag && matchesSearch;
    });

    if (sortBy === "topics") {
      return [...matches].sort(
        (a, b) =>
          (b.tableOfContents?.length ?? 0) - (a.tableOfContents?.length ?? 0),
      );
    }

    return matches; // Assumes default order is latest
  }, [blogs, searchQuery, activeTag, sortBy]);

  // 2. Cap strictly at 3 cards (1 row on desktop, 2 rows on tablet, 3 rows on phone)
  const visibleBlogs = filteredBlogs.slice(0, 3);

  return (
    <section className="pt-8 border-t border-border space-y-6">
      {/* Section Header + "View All" Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Featured Knowledge Tracks
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Latest &amp; Core Notes
          </h2>
        </div>
      </div>

      {/* Search Bar, Interactive Sort & Featured Tag Pills */}
      <div className="rounded-xl border border-border bg-card/50 p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title, summary, or tag..."
              className="w-full h-10 px-3.5 pr-16 rounded-lg border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Sort Toggle */}
          <div className="h-10 px-3 rounded-lg border border-border bg-background flex items-center justify-between gap-2 text-xs font-mono text-muted-foreground shrink-0">
            <span>Sort:</span>
            <button
              type="button"
              onClick={() => setSortBy("latest")}
              className={
                sortBy === "latest"
                  ? "text-foreground font-medium"
                  : "hover:text-foreground transition-colors"
              }
            >
              Latest
            </button>
            <span className="opacity-40">/</span>
            <button
              type="button"
              onClick={() => setSortBy("topics")}
              className={
                sortBy === "topics"
                  ? "text-foreground font-medium"
                  : "hover:text-foreground transition-colors"
              }
            >
              Topics
            </button>
          </div>
        </div>

        {/* Featured Tags Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {filterTabs.map((tag) => {
            const isActive = activeTag === tag.id.toString();
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveTag(tag.id.toString())}
                className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap border transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive 3-Card Grid: 1 col (3 rows) phone | 2 cols (2 rows) tablet | 3 cols (1 row) desktop */}
      {visibleBlogs.length > 0 ? (
        // ... inside your component JSX:
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleBlogs.map((blog) => {
            const topicCount = blog.tableOfContents?.length ?? 0;

            return (
              <Link
                key={blog.slug}
                href={`/${blog.slug}`}
                className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between hover:border-foreground/40 transition-colors"
              >
                <div>
                  {/* Top Media Area: Cover Image OR Subtle Initials Banner */}
                  <div className="relative h-36 w-full bg-muted/50 border-b border-border overflow-hidden">
                    {blog.media.coverImage ? (
                      <Image
                        src={blog.media.coverImage}
                        alt={blog.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted/80 via-muted/40 to-background">
                        <span className="text-3xl font-mono font-bold tracking-widest text-muted-foreground/40 select-none">
                          {blog.media.initials}
                        </span>
                      </div>
                    )}

                    {/* Corner Badge: Topic Logo Image OR Initials Pill */}
                    <div className="absolute bottom-2.5 left-3 h-9 w-9 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-sm flex items-center justify-center overflow-hidden">
                      {blog.media.logoImage ? (
                        <Image
                          src={blog.media.logoImage}
                          alt={`${blog.name} icon`}
                          width={200}
                          height={200}
                          className="w-24 h-auto"
                        />
                      ) : (
                        <span className="text-xs font-mono font-bold text-foreground">
                          {blog.media.initials}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-semibold text-base tracking-tight group-hover:text-primary transition-colors">
                      {blog.name}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {blog.summary.general}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Topic Count + Hover-Only "Read →" */}
                <div className="px-5 py-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>
                    {topicCount} {topicCount === 1 ? "Topic" : "Topics"}
                  </span>

                  <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-foreground font-medium transition-all duration-200">
                    Read →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
          <p className="text-xs font-mono text-muted-foreground">
            No notes matched your filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTag("all");
            }}
            className="text-xs font-mono text-primary hover:underline"
          >
            Reset search &amp; filters
          </button>
        </div>
      )}

      {/* Footer Status Bar: "Showing 3 of X blogs" + All Blogs Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="text-foreground">{visibleBlogs.length}</strong> of{" "}
          <strong className="text-foreground">{filteredBlogs.length}</strong>{" "}
          {filteredBlogs.length === blogs.length
            ? "registered blogs"
            : `matching blogs (${blogs.length} total)`}
        </span>

        <Link
          href={links[0].link}
          className="w-full sm:w-auto px-4 py-2 rounded-md border border-border bg-card text-foreground text-center hover:bg-muted/60 transition-colors"
        >
          more Blogs →
        </Link>
      </div>
    </section>
  );
};
