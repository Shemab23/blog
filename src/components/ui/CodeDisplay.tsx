"use client";

import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.875em] px-1 mx-1 py-0.5 rounded bg-muted text-foreground border border-border/60">
      {children}
    </code>
  );
}

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
};

export function CodeBlock({
  code,
  language = "dart",
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Map 'dart' to 'clike' (C-like syntax) since prism-react-renderer includes 'clike' & 'bash' natively
  const prismLanguage = language === "dart" ? "clike" : language;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-lg border border-border bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400">
        <span>{filename || language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-zinc-100 transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <Highlight
        theme={themes.oneDark}
        code={code.trim()}
        language={prismLanguage}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{ ...style, backgroundColor: "transparent" }}
            className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed"
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
