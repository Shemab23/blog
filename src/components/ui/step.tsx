import * as React from "react";
import { CheckCircle2 } from "lucide-react";

/** A numbered step with a connecting line down to the next one. */
export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {n}
        </span>
        <span className="mt-2 w-px flex-1 bg-border" />
      </div>
      <div className="min-w-0 flex-1 space-y-3 pb-8">
        <h3 className="pt-1 text-lg font-semibold tracking-tight">{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** "You’re done with this step when you see this." */
export function Test({
  title = "Test",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-4 py-3">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
      <div className="space-y-1 text-sm leading-6">
        <p className="font-medium">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
