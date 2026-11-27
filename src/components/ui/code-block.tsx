"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  code,
  title = "Terminal",
}: {
  code: string;
  title?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard can be blocked; the text is still selectable */
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-xs text-muted-foreground">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          className="h-7 gap-1.5 text-xs"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
