"use client";

import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

export function GitInternalsPage() {
  const context = useContext(AppContext);
  const blog = context?.blogs.find((b) => b.slug === "git-internals");

  if (!blog) return null;

  return (
    <article className="space-y-12">
      {/* Article Header */}
      <header className="space-y-3 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
          {blog.version && (
            <span className="px-2 py-0.5 rounded bg-muted text-foreground">
              {blog.version}
            </span>
          )}
          {blog.recordedDate && <span>Recorded {blog.recordedDate}</span>}
          <span>•</span>
          <span>{blog.tableOfContents.length} Chapters</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {blog.name}
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {blog.summary.general}
        </p>
      </header>

      {/* Chapters & Sub-Topics */}
      {blog.tableOfContents.map((topic) => (
        <section
          key={topic.id}
          id={topic.id}
          className="scroll-mt-20 space-y-8"
        >
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-2">
            {topic.title}
          </h2>

          <div className="space-y-10">
            {topic.subTopics.map((sub) => {
              const SubTopicComponent = sub.component;
              return (
                <div key={sub.id} id={sub.id} className="scroll-mt-20">
                  <SubTopicComponent />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </article>
  );
}
