"use client";

// NOTE: adjust this import path to wherever your AppContext file lives.
import { useApp } from "@/context/AppContext";

const SLUG = "ai-engineering-foundations";

export function AiEngineeringFoundationsPage() {
  const { blogs } = useApp();
  const blog = blogs.find((b) => b.slug === SLUG);

  if (!blog) {
    return <p className="text-muted-foreground">Blog not found.</p>;
  }

  return (
    <article className="space-y-12">
      {/* Header metadata */}
      <header className="space-y-3">
        <h1>{blog.name}</h1>
        <p className="text-muted-foreground">
          {blog.version} · {blog.recordedDate}
        </p>
        <ul className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border bg-muted px-2 py-0.5 text-primary"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p>{blog.summary.general}</p>
      </header>

      {/* Chapters and sub-topics driven by the registry */}
      {blog.tableOfContents.map((topic) => (
        <section
          key={topic.id}
          id={topic.id}
          className="scroll-mt-20 space-y-8"
        >
          <h2>{topic.title}</h2>

          {topic.subTopics.map((sub) => {
            const SubTopic = sub.component;
            return (
              <div key={sub.id} id={sub.id} className="scroll-mt-20 space-y-4">
                <h3>{sub.title}</h3>
                <SubTopic />
              </div>
            );
          })}
        </section>
      ))}
    </article>
  );
}
