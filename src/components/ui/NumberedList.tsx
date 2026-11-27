import React from "react";

type NumberedListProps = {
  children: React.ReactNode;
  start?: number;
};

export function NumberedList({ children, start = 1 }: NumberedListProps) {
  return (
    <ol className="my-4 space-y-1.5">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        return (
          <li className="flex items-start gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 select-none">
              {start + index}.
            </span>
            <div className="flex-1">{child}</div>
          </li>
        );
      })}
    </ol>
  );
}
