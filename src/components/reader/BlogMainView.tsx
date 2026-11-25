"use client";

import { BlogEntry } from "@/data/BlogRegistry";
import { BreadcrumbItem } from "@/lib/blogReaderUtils";
import React from "react";

export type BlogMainViewProps = {
  blog: BlogEntry;
  breadcrumbs: BreadcrumbItem[];
  onSelectSection: (id: string) => void;
  onOpenMobileSidebar: () => void;
};

export const BlogMainView = ({
  blog,
  breadcrumbs,
  onSelectSection,
  onOpenMobileSidebar,
}: BlogMainViewProps) => {
  const ActiveBlogComponent = blog.component;

  return (
    <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
      {/* Sticky Main Header */}
      <header className="sticky top-0 z-30 h-14 bg-background/90 backdrop-blur-md border-b border-border px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Button + Live Nested Topic / Subtopic Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden px-2.5 py-1.5 rounded-md border border-border bg-card text-xs font-mono shrink-0 cursor-pointer"
          >
            ☰ Contents
          </button>

          <nav
            aria-label="Current section"
            className="flex items-center gap-1.5 text-xs font-mono truncate"
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id}>
                  {idx > 0 && (
                    <span className="text-muted-foreground/50">/</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectSection(crumb.id)}
                    className={`truncate transition-colors cursor-pointer ${
                      isLast
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {crumb.title}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: Note Version + Light/Dark Theme Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {blog.version && (
            <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground">
              {blog.version}
            </span>
          )}
        </div>
      </header>

      {/* Centered Reading Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <ActiveBlogComponent />
        </div>
      </main>
    </div>
  );
};
