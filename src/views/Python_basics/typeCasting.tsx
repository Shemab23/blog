import React from "react";

export function TypeCasting() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">1.2 Type Casting</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Python is strongly typed—it will not implicitly concatenate a string and
        an integer. Use built-in constructor functions like{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          int()
        </code>
        ,{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          float()
        </code>
        , and{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          str()
        </code>{" "}
        to convert between representations explicitly.
      </p>
      <pre className="p-4 rounded-lg border border-border bg-card overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{`raw_age = "25"
age = int(raw_age) + 1       # 26
price = float("19.99")       # 19.99
message = "Age: " + str(age) # "Age: 26"`}</code>
      </pre>
    </div>
  );
}
