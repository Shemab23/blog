import React from "react";

export function PrimitiveTypes() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">1.1 Primitive Types</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        In Python, every value is an object allocated dynamically on the heap.
        Variables act as labels bound to object references rather than fixed
        memory boxes. The four foundational scalar types are{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          int
        </code>
        ,{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          float
        </code>
        ,{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          str
        </code>
        , and{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          bool
        </code>
        .
      </p>
      <pre className="p-4 rounded-lg border border-border bg-card overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{`count: int = 42
pi: float = 3.14159
label: str = "Python"
is_active: bool = True

print(type(count), id(count))`}</code>
      </pre>
    </div>
  );
}
