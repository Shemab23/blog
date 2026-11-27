"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
  /** Where in the course it gets installed */
  where: string;
};

/** Reader ticks what is missing; the footer says where each gets installed. */
export function Checklist({
  items,
  prompt = "Tick what your check showed as missing",
}: {
  items: ChecklistItem[];
  prompt?: string;
}) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const ticked = items.filter((item) => checked[item.id]);
  const places = Array.from(new Set(ticked.map((item) => item.where)));

  return (
    <div className="rounded-lg border bg-card">
      <p className="border-b px-4 py-3 text-sm font-medium">{prompt}</p>
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <Checkbox
              id={`check-${item.id}`}
              className="mt-1"
              checked={!!checked[item.id]}
              onCheckedChange={(value) =>
                setChecked((prev) => ({ ...prev, [item.id]: value === true }))
              }
            />
            <Label
              htmlFor={`check-${item.id}`}
              className="flex flex-1 cursor-pointer flex-col items-start gap-1 font-normal"
            >
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.label}</span>
                <Badge variant="secondary">{item.where}</Badge>
              </span>
              <span className="text-sm text-muted-foreground">
                {item.detail}
              </span>
            </Label>
          </li>
        ))}
      </ul>
      <p className="border-t bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {ticked.length === 0
          ? "Nothing ticked yet. If everything checked out, you can skip ahead."
          : `${ticked.length} to install. You’ll do it in: ${places.join(", ")}.`}
      </p>
    </div>
  );
}
