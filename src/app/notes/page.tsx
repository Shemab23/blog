"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/header";
import { AppContext } from "@/context/AppContext";
import { BlogEntry } from "@/data/BlogRegistry";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useMemo, useState } from "react";

const EMPTY_BLOGS: BlogEntry[] = [];

export default function NotesPage() {
  const context = useContext(AppContext);
  const blogs = context?.blogs ?? EMPTY_BLOGS;
  const featuredTags = context?.FeaturedTags ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  // Search across title, general summary, tags, AND deep chapter summaries
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return blogs
      .filter((blog) => {
        if (activeTag === "all") return true;
        return blog.tags.some(
          (t) => t.toLowerCase() === activeTag.toLowerCase(),
        );
      })
      .map((blog) => {
        if (!q) {
          return { blog, matchedSections: [], matches: true };
        }

        const matchedSections = blog.summary.sections.filter(
          (sec) =>
            sec.topic.toLowerCase().includes(q) ||
            sec.summary.toLowerCase().includes(q),
        );

        const matchesGeneral =
          blog.name.toLowerCase().includes(q) ||
          blog.summary.general.toLowerCase().includes(q) ||
          blog.tags.some((t) => t.toLowerCase().includes(q));

        return {
          blog,
          matchedSections,
          matches: matchesGeneral || matchedSections.length > 0,
        };
      })
      .filter((item) => item.matches);
  }, [blogs, searchQuery, activeTag]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header activeLink="Notes" />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
            Complete Archive • {blogs.length} Registered Notes
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Technical Notes &amp; Chapters
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Every structured note in one place. Search by concept or keyword to
            pinpoint the exact chapter where a topic is covered.
          </p>
        </div>

        {/* Search & Tag Filter Controls */}
        <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all notes, chapters, and summaries..."
              className="w-full h-10 px-3.5 pr-16 rounded-lg border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-primary hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setActiveTag("all")}
              className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors cursor-pointer ${
                activeTag === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              All
            </button>
            {featuredTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-md text-xs font-mono border whitespace-nowrap transition-colors cursor-pointer ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Single-Row-Per-Note List */}
        <div className="space-y-4">
          {results.map(({ blog, matchedSections }) => {
            const totalChapters = blog.tableOfContents.length;
            const totalSubTopics = blog.tableOfContents.reduce(
              (acc, t) => acc + t.subTopics.length,
              0,
            );

            return (
              <Link
                key={blog.slug}
                href={`/${blog.slug}`}
                className="group block cursor-pointer rounded-xl border border-border bg-card p-5 sm:p-6 hover:border-foreground/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Logo + Core Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-lg border border-border bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {blog.media.logoImage ? (
                        <Image
                          src={blog.media.logoImage}
                          alt={blog.name}
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-sm font-mono font-bold text-primary">
                          {blog.media.initials}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                          {blog.name}
                        </h2>
                        {blog.version && (
                          <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
                            {blog.version}
                          </span>
                        )}
                      </div>

                      {/* Controlled Uphead Summary (2 lines max) */}
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl">
                        {blog.summary.general}
                      </p>

                      {/* Chapter Preview OR Highlighted Search Matches */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        {isSearching && matchedSections.length > 0
                          ? matchedSections.map((sec) => (
                              <span
                                key={sec.scrollToId}
                                className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-[11px] font-mono text-primary font-medium"
                              >
                                Match: {sec.topic}
                              </span>
                            ))
                          : blog.tableOfContents.slice(0, 3).map((topic) => (
                              <span
                                key={topic.id}
                                className="px-2 py-0.5 rounded bg-muted/70 text-[11px] font-mono text-muted-foreground"
                              >
                                {topic.title}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Meta & Hover Read Indicator */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 text-[11px] font-mono text-muted-foreground border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    <span>
                      {totalChapters} Chapters • {totalSubTopics} Sections
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-foreground font-medium transition-opacity">
                      Read Note →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
