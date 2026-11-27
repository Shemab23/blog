"use client";

import React, { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  fontFamily: "var(--font-sans), sans-serif",
  flowchart: {
    curve: "basis",
    padding: 16,
  },
  sequence: {
    useMaxWidth: false, // Prevents Mermaid from shrinking text to fit narrow screens
    actorFontSize: 15,
    noteFontSize: 14,
    messageFontSize: 14,
    actorMargin: 80,
    boxMargin: 12,
    messageMargin: 40,
  },
});

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    mermaid.render(`mermaid-${id}`, chart.trim()).then(({ svg }) => {
      if (isMounted) setSvg(svg);
    });
    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 sm:p-6">
      {svg ? (
        <div
          className="mx-auto w-max min-w-full flex justify-center [&>svg]:max-w-none"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="text-xs font-mono text-muted-foreground">
          Loading diagram...
        </div>
      )}
    </div>
  );
}
