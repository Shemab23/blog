import { ArrowDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type PipelineItem = { title: string; detail: string };

/** A left-to-right chain of stages (top-to-bottom on narrow screens). */
export function Pipeline({ items }: { items: PipelineItem[] }) {
  return (
    <ol className="flex flex-col gap-2 p-5 md:flex-row md:gap-0">
      {items.map((item, i) => (
        <li key={item.title} className="flex flex-1 flex-col items-stretch md:flex-row md:items-center">
          <div className="flex-1 space-y-1.5 rounded-lg border bg-background p-3">
            <Badge variant="secondary">{i + 1}</Badge>
            <p className="text-sm font-medium leading-5">{item.title}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              {item.detail}
            </p>
          </div>
          {i < items.length - 1 && (
            <>
              <ArrowRight className="mx-1.5 hidden size-4 shrink-0 text-muted-foreground md:block" />
              <ArrowDown className="mx-auto my-1 size-4 text-muted-foreground md:hidden" />
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
