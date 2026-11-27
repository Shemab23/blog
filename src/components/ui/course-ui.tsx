import * as React from "react";
import {
  Info,
  Lightbulb,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        {Icon && <Icon className="size-5 text-muted-foreground" />}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function P({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("leading-7 text-muted-foreground", className)} {...props} />
  );
}

/** Inline code, for tool names and short syntax. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

const TONES = {
  info: {
    icon: Info,
    className: "border-blue-500/40 bg-blue-500/5 [&>svg]:text-blue-500",
  },
  tip: {
    icon: Lightbulb,
    className: "border-emerald-500/40 bg-emerald-500/5 [&>svg]:text-emerald-500",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/50 bg-amber-500/5 [&>svg]:text-amber-500",
  },
} as const;

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof TONES;
  title: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className } = TONES[tone];
  return (
    <Alert className={className}>
      <Icon className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="leading-6">{children}</AlertDescription>
    </Alert>
  );
}

/** A numbered, linkable frame for a table or diagram. */
export function Figure({
  id,
  label,
  caption,
  children,
}: {
  id: string;
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure id={id} className="scroll-mt-24 space-y-2">
      <div className="overflow-x-auto rounded-lg border bg-card">{children}</div>
      <figcaption className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{label}</span> · {caption}
      </figcaption>
    </figure>
  );
}

/** Inline link back to a Figure, e.g. <Ref to="tbl-tools">Table 1</Ref>. */
export function Ref({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${to}`}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}
