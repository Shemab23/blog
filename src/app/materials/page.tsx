"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/header";
import { AppContext } from "@/context/AppContext";
import { MaterialEntry } from "@/data/MaterialRegistry";
import Image from "next/image";
import React, { useContext, useMemo, useState } from "react";

const EMPTY_MATERIALS: MaterialEntry[] = [];

export default function MaterialsPage() {
  const context = useContext(AppContext);
  const materials = context?.materials ?? EMPTY_MATERIALS;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [materials, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header activeLink="Materials" />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
            Books, Ebooks &amp; Downloads
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Curated Study Materials
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Handpicked books, downloadable field guides, and reference resources
            to supplement your learning.
          </p>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books, guides, or authors..."
          className="w-full h-10 px-3.5 rounded-lg border border-border bg-card text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />

        <div className="space-y-4">
          {filteredMaterials.map((item) => {
            const canAccess = item.access.isOpen;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-14 w-12 rounded-lg border border-border bg-muted/60 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-mono font-bold text-primary">
                        {item.initials}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {item.type}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        by {item.author}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold tracking-tight">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Access-Aware Action Button */}
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  {canAccess ? (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-foreground text-background text-xs font-mono font-medium hover:opacity-90 transition-opacity"
                    >
                      {item.actionLabel} ↗
                    </a>
                  ) : (
                    <span className="px-3 py-1.5 rounded-md border border-border bg-muted text-xs font-mono text-muted-foreground">
                      Restricted Access
                    </span>
                  )}

                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {item.access.accessTier === "free"
                      ? "Open Access"
                      : item.access.accessTier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
