import type { ReactNode } from "react";
import { ExternalLink, Lightbulb, Play, TriangleAlert } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Media helpers                                                       */
/* All images for this blog live in:                                   */
/*   public/blogs/ai-engineering-foundations/                          */
/* ------------------------------------------------------------------ */

export const MEDIA_BASE = "/blogs/ai-engineering-foundations";

/** media("cover.jpg") -> "/blogs/ai-engineering-foundations/cover.jpg" */
export const media = (file: string) => `${MEDIA_BASE}/${file}`;

/* ------------------------------------------------------------------ */
/* Placeholder used by Phase 2 skeleton components                     */
/* ------------------------------------------------------------------ */

export function Placeholder() {
  return <p className="text-muted-foreground">Content coming soon.</p>;
}

/* ------------------------------------------------------------------ */
/* Code and formulas (both use <pre><code>)                            */
/* ------------------------------------------------------------------ */

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4">
      <code>{children}</code>
    </pre>
  );
}

/** Same element, with a primary-colored left rule so formulas stand out. */
export function Formula({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border border-l-4 border-l-primary bg-muted p-4">
      <code>{children}</code>
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/* Table (plain HTML, theme tokens, scrolls sideways on small screens) */
/* ------------------------------------------------------------------ */

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left">
        <thead className="bg-muted">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-border px-3 py-2 font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Image with caption                                                  */
/* ------------------------------------------------------------------ */

export function Figure({
  file,
  alt,
  caption,
}: {
  /** file name inside public/blogs/ai-engineering-foundations/ */
  file: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media(file)}
        alt={alt}
        loading="lazy"
        className="w-full rounded-lg border border-border bg-card"
      />
      {caption ? (
        <figcaption className="text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Video as a clickable thumbnail (no embed is rendered)               */
/* ------------------------------------------------------------------ */

export function VideoLink({
  href,
  thumbnail,
  title,
  caption,
}: {
  /** YouTube URL, opens in a new tab */
  href: string;
  /** file name inside public/blogs/ai-engineering-foundations/ */
  thumbnail: string;
  title: string;
  caption?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch on YouTube: ${title}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
    >
      <div className="relative aspect-video bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media(thumbnail)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-background/30 transition-colors group-hover:bg-background/10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="h-6 w-6" aria-hidden />
          </span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <div>
          <p className="font-medium">{title}</p>
          {caption ? <p className="text-muted-foreground">{caption}</p> : null}
        </div>
        <ExternalLink
          className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
          aria-hidden
        />
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Callout (tip / warning)                                             */
/* ------------------------------------------------------------------ */

export function Callout({
  kind = "tip",
  children,
}: {
  kind?: "tip" | "warning";
  children: ReactNode;
}) {
  const Icon = kind === "tip" ? Lightbulb : TriangleAlert;
  return (
    <div
      className={`flex gap-3 rounded-lg border bg-card p-4 ${
        kind === "tip" ? "border-primary/50" : "border-border"
      }`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${
          kind === "tip" ? "text-primary" : "text-muted-foreground"
        }`}
        aria-hidden
      />
      <div className="space-y-2">{children}</div>
    </div>
  );
}
