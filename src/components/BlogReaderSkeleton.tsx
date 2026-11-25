"use client";

import { AppContext } from "@/context/AppContext";
import { BlogEntry } from "@/data/BlogRegistry";
import {
  filterAndHighlightToc,
  getActiveBreadcrumb,
} from "@/lib/blogReaderUtils";
import { notFound } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BlogMainView } from "./reader/BlogMainView";
import { BlogSidebar } from "./reader/BlogSiderbar";

const EMPTY_BLOGS: BlogEntry[] = [];

export function BlogReaderSkeleton({ blogSlug }: { blogSlug: string }) {
  const context = useContext(AppContext);
  const allBlogs = context?.blogs ?? EMPTY_BLOGS;

  const currentBlog = allBlogs.find((b) => b.slug === blogSlug);

  if (!currentBlog) {
    notFound();
  }

  // Centralized Reader States
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState<string>(
    () =>
      currentBlog.tableOfContents[0]?.subTopics[0]?.id ??
      currentBlog.tableOfContents[0]?.id ??
      "",
  );

  // 1. Filtered TOC & Primary-Highlighted Sub-topics
  const { filteredTopics, highlightedSubTopicIds } = useMemo(
    () => filterAndHighlightToc(currentBlog, searchQuery),
    [currentBlog, searchQuery],
  );

  // 2. Iterable Breadcrumb Trail
  const breadcrumbs = useMemo(
    () => getActiveBreadcrumb(currentBlog.tableOfContents, activeSectionId),
    [currentBlog.tableOfContents, activeSectionId],
  );

  // 3. Recommended Next Blogs
  const recommendedBlogs = useMemo(() => {
    if (!currentBlog.recommendedIds?.length) return [];

    return currentBlog.recommendedIds
      .map((idOrSlug) =>
        allBlogs.find((b) => b.id === idOrSlug || b.slug === idOrSlug),
      )
      .filter((b): b is NonNullable<typeof b> => Boolean(b));
  }, [allBlogs, currentBlog.recommendedIds]);

  // 4. Track visible section in viewport via IntersectionObserver
  useEffect(() => {
    const allIds = Array.from(
      new Set(
        currentBlog.tableOfContents.flatMap((topic) => [
          topic.id,
          ...topic.subTopics.map((sub) => sub.id),
        ]),
      ),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      { rootMargin: "-12% 0px -75% 0px", threshold: 0.05 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentBlog.tableOfContents]);

  // 5. Smooth-scroll handler shared across Sidebar & Breadcrumbs
  const handleSelectSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(id);
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block lg:w-72 lg:fixed lg:inset-y-0 border-r border-border">
        <BlogSidebar
          blog={currentBlog}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredTopics={filteredTopics}
          highlightedSubTopicIds={highlightedSubTopicIds}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          recommendedBlogs={recommendedBlogs}
        />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-80 max-w-[85vw] border-r border-border h-full z-10 shadow-xl">
            <BlogSidebar
              blog={currentBlog}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredTopics={filteredTopics}
              highlightedSubTopicIds={highlightedSubTopicIds}
              activeSectionId={activeSectionId}
              onSelectSection={handleSelectSection}
              recommendedBlogs={recommendedBlogs}
              isMobile
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content View */}
      <BlogMainView
        blog={currentBlog}
        breadcrumbs={breadcrumbs}
        onSelectSection={handleSelectSection}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />
    </div>
  );
}
