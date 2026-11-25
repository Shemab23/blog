"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/header";
import { AppContext } from "@/context/AppContext";
import { TutorialEntry } from "@/data/TutorialRegistry";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo, useState } from "react";

const EMPTY_TUTORIALS: TutorialEntry[] = [];

export default function TutorialsPage() {
  const context = useContext(AppContext);
  const tutorials = context?.tutorials ?? EMPTY_TUTORIALS;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTutorials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tutorials;
    return tutorials.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.whatToExpect.some((item) => item.toLowerCase().includes(q)),
    );
  }, [tutorials, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header activeLink="Tutorials" />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
            Video Walkthroughs • YouTube Channel
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Practical Video Tutorials
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Step-by-step video walkthroughs hosted on YouTube—paired with my
            written notes so you can see concepts built live.
          </p>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tutorials by topic or keyword..."
          className="w-full h-10 px-3.5 rounded-lg border border-border bg-card text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />

        {/* Video Cards List */}
        <div className="space-y-4">
          {filteredTutorials.map((video) => (
            <div
              key={video.id}
              className="rounded-xl border border-border bg-card overflow-hidden grid grid-cols-1 md:grid-cols-12"
            >
              {/* Thumbnail Preview */}
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative md:col-span-5 aspect-video md:aspect-auto min-h-[180px] bg-muted block overflow-hidden group"
              >
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-background/90 text-[11px] font-mono font-medium">
                  {video.duration}
                </span>
              </a>

              {/* Video Notes & Watch CTA */}
              <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[11px] font-mono text-muted-foreground ml-auto">
                      {video.publishedDate}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold tracking-tight">
                    {video.title}
                  </h2>

                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      What to expect:
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                      {video.whatToExpect.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  {video.relatedBlogSlug ? (
                    <Link
                      href={`/${video.relatedBlogSlug}`}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Read Companion Note →
                    </Link>
                  ) : (
                    <span />
                  )}

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-mono font-medium hover:opacity-90 transition-opacity"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
