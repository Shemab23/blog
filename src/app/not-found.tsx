"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";

export default function NotFound() {
  const pathname = usePathname();
  const context = useContext(AppContext);
  const blogs = context?.blogs ?? [];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12">
      <main className="w-full max-w-lg space-y-8 text-center">
        {/* =========================================================
            1. PLAIN 404 MESSAGE
           ========================================================= */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            404 • Page Not Found
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No page or blog entry exists at{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
              {pathname || "/unknown"}
            </code>
            .
          </p>
        </div>

        {/* =========================================================
            2. GO BACK HOME BUTTON
           ========================================================= */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-medium hover:opacity-90 transition-opacity"
          >
            ← Go Back Home
          </Link>
        </div>

        {/* =========================================================
            3. COLLAPSIBLE AVAILABLE BLOGS CARD LIST
           ========================================================= */}
        <div className="pt-4 border-t border-border text-left">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors flex items-center justify-between text-xs font-mono"
          >
            <span className="font-medium text-foreground">
              Available Blogs ({blogs.length})
            </span>
            <span className="text-muted-foreground">
              {isOpen ? "▲ Hide" : "▼ Show"}
            </span>
          </button>

          {isOpen && (
            <div className="mt-3 space-y-2.5">
              {blogs.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs font-mono text-muted-foreground">
                  No blogs registered yet.
                </div>
              ) : (
                blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/${blog.slug}`}
                    className="block p-4 rounded-lg border border-border bg-card hover:border-primary/60 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                          {blog.media.initials}
                        </span>
                        <span className="font-semibold text-sm truncate">
                          {blog.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-primary shrink-0">
                        Read →
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {blog.summary.general}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
