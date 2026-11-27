import * as React from "react";
import {
  ArrowDown,
  ArrowRight,
  CircleHelp,
  Flag,
  Play,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FlowStep =
  | { kind: "start"; text: string }
  | {
      kind: "question";
      text: string;
      /** Label on the path that keeps going down, e.g. "Yes" */
      continueLabel: string;
      /** Label on the side path that ends the check, e.g. "No" */
      exitLabel: string;
      /** What to do on the side path */
      exitText: string;
    }
  | { kind: "end"; text: string };

function Node({
  icon: Icon,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-full max-w-sm items-start gap-2 rounded-lg border px-3 py-2 text-sm ${className}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Top-to-bottom decision flow, built from plain markup. */
export function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="flex flex-col items-center gap-0 p-5">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const next = steps[i + 1];
        const downLabel =
          step.kind === "question" ? step.continueLabel : undefined;

        return (
          <li key={i} className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-center gap-2 md:flex-row md:justify-center md:gap-3">
              {step.kind === "start" && (
                <Node icon={Play} className="border-primary/40 bg-primary/5">
                  {step.text}
                </Node>
              )}
              {step.kind === "question" && (
                <>
                  <Node icon={CircleHelp} className="bg-card font-medium">
                    {step.text}
                  </Node>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowRight className="hidden size-4 md:block" />
                    <ArrowDown className="size-4 md:hidden" />
                    <Badge variant="outline">{step.exitLabel}</Badge>
                  </div>
                  <Node
                    icon={Wrench}
                    className="border-amber-500/40 bg-amber-500/5"
                  >
                    {step.exitText}
                  </Node>
                </>
              )}
              {step.kind === "end" && (
                <Node
                  icon={Flag}
                  className="border-emerald-500/40 bg-emerald-500/5"
                >
                  {step.text}
                </Node>
              )}
            </div>

            {!isLast && next && (
              <div className="flex flex-col items-center py-1.5 text-muted-foreground">
                {downLabel && (
                  <Badge variant="secondary" className="mb-1">
                    {downLabel}
                  </Badge>
                )}
                <ArrowDown className="size-4" />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
