import { MermaidDiagram } from "@/components/MermaidDiagram";
import { CodeBlock, InlineCode } from "@/components/ui/CodeDisplay";
import { TableMinimal } from "@/components/ui/tableMinimal";

export const subtopics = [
  "Runtime vs. compile-time constants",
  "Type inference & string interpolation",
  "Null safety & null-aware operators",
  "Safe collection lookups",
  "Project: CLI Receipt & Invoice Formatter",
];

export const summary =
  "1.1: var, final, const, runtime vs compile-time. 1.2: type inference, string interpolation, toStringAsFixed, padLeft. 1.3: sound null safety, nullable types, !, ?., ??, ??=. 1.4: firstWhere, orElse, safe list lookup. 1.5: project CLI Receipt & Invoice Formatter.";

export const Subtopic1_01 = () => {
  return (
    <section className="flex flex-col gap-2">
      <p>
        <span className="font-semibold text-foreground">
          The core mental model:
        </span>{" "}
        Before your program ever runs, Dart&apos;s compiler wants two guarantees
        from you: <i>what is allowed to change</i> (<InlineCode>var</InlineCode>{" "}
        / <InlineCode>final</InlineCode> / <InlineCode>const</InlineCode>) and{" "}
        <i>what is allowed to be missing</i> (<InlineCode>?</InlineCode>).
        Everything else in this chapter is a tool for working safely inside
        those two rules.
      </p>

      {/* 1. Why final Exists */}
      <>
        <h3>1. Why final Exists: var vs. final vs. const</h3>

        <h4>The Technical Reason Dart Has Both final and const</h4>
        <p>
          In JavaScript/TypeScript, <InlineCode>const</InlineCode> only means
          &quot;this variable name cannot be reassigned.&quot; You can write{" "}
          <InlineCode>const now = Date.now()</InlineCode> even though{" "}
          <InlineCode>Date.now()</InlineCode> isn&apos;t known until the user
          runs the app.
        </p>
        <p>
          Dart splits this into two distinct levels for memory and performance
          optimization (especially critical in Flutter UIs):
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              1. final (Single-Assignment at Runtime):
            </span>{" "}
            The value is calculated while the app is running (like fetching a
            user ID or reading the current clock), and once set, the variable
            pointer is locked forever.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              2. const (Compile-Time Canonicalization):
            </span>{" "}
            The value is baked into the app before it is even compiled. Even
            better: if you create{" "}
            <InlineCode>const Text(&apos;Hello&apos;)</InlineCode> in 50 places
            in a Flutter app, Dart stores only one copy in memory and reuses it
            everywhere—and Flutter knows it never needs to redraw it.
          </p>
        </div>

        <h4>
          Your Default Instinct (Just Like TypeScript&apos;s const-First Rule)
        </h4>
        <p>
          If you are used to defaulting to <InlineCode>const</InlineCode> in
          TypeScript and only reaching for <InlineCode>let</InlineCode> when
          necessary, follow this exact decision ladder in Dart:
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              1. First instinct → const:
            </span>{" "}
            Is the value already known right now as you type the code (numbers,
            fixed text, fixed tax rates)? Use <InlineCode>const</InlineCode>.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              2. Second instinct → final:
            </span>{" "}
            Is the value computed when the program runs (user input, current
            time, API data, list items), and you won&apos;t reassign it? Use{" "}
            <InlineCode>final</InlineCode>.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              3. Last resort → var:
            </span>{" "}
            Do you genuinely need to overwrite this variable later (like a score
            counter or loop accumulator)? Use <InlineCode>var</InlineCode>.
          </p>
        </div>
        <CodeBlock
          language="dart"
          filename="main.dart"
          code={`
void main() {
  // 1. First instinct: known before program runs
  const taxRate = 0.18;

  // 2. Second instinct: computed at runtime, locked once set
  final now = DateTime.now();
  final items = [1, 2, 3];
  items.add(4);              // Allowed: 'final' locks the variable pointer, not list contents

  // 3. Last resort: needs to change over time
  var total = 0.0;
  total += 15.50;

  // Why 'final' works in loops, but 'const' fails:
  for (final item in items) {
    print(item);             // Each loop iteration creates a brand-new 'final' variable
  }
}
      `}
        />
      </>
    </section>
  );
};
export const Subtopic1_02 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 2. The Dart Type System */}
      <>
        <h3>2. The Dart Type System: Hierarchy &amp; Conversion Graph</h3>
        <p>
          Dart infers types automatically (
          <InlineCode>var price = 4.5</InlineCode> becomes a{" "}
          <InlineCode>double</InlineCode>), while String formatting uses
          interpolation (<InlineCode>$name</InlineCode> or{" "}
          <InlineCode>{"${expr}"}</InlineCode>) and methods like{" "}
          <InlineCode>.toStringAsFixed(2)</InlineCode> and{" "}
          <InlineCode>.padLeft(10)</InlineCode>.
        </p>
        <p>
          To move confidently between types, picture Dart&apos;s type tree from
          top to bottom:
        </p>
        <MermaidDiagram
          chart={`
flowchart TD
  Object["Object (the root of all types)"]
  num["num (abstract number type)"]
  int["int (whole numbers)"]
  double["double (decimal numbers)"]
  String["String (text)"]
  bool["bool (true / false)"]

  Object --> num
  Object --> String
  Object --> bool
  num --> int
  num --> double
      `}
        />

        <h4>How to Move Between Types</h4>

        <h4>A. Within the Same Group (int ↔ double)</h4>
        <p>
          Dart does <i>not</i> silently convert <InlineCode>double</InlineCode>{" "}
          to <InlineCode>int</InlineCode> because you might lose decimal
          precision. You must choose how to convert:
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              int → double:{" "}
            </span>
            <InlineCode>myInt.toDouble()</InlineCode> (e.g.,{" "}
            <InlineCode>5.toDouble()</InlineCode> → <InlineCode>5.0</InlineCode>
            )
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              double → int:{" "}
            </span>
          </p>
        </div>
        <div className="ml-6 flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>myDouble.toInt()</InlineCode> or{" "}
            <InlineCode>.truncate()</InlineCode> (chops off decimals:{" "}
            <InlineCode>4.9</InlineCode> → <InlineCode>4</InlineCode>)
          </p>
          <p className="bulletpoint">
            <InlineCode>myDouble.round()</InlineCode> (nearest whole number:{" "}
            <InlineCode>4.9</InlineCode> → <InlineCode>5</InlineCode>)
          </p>
          <p className="bulletpoint">
            <InlineCode>myDouble.floor()</InlineCode> /{" "}
            <InlineCode>.ceil()</InlineCode> (always down / always up)
          </p>
        </div>

        <h4>B. Up and Down the Hierarchy (Object ↔ num ↔ int)</h4>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Going UP (Widening — Automatic):
            </span>{" "}
            An <InlineCode>int</InlineCode> is a <InlineCode>num</InlineCode>,
            and a <InlineCode>num</InlineCode> is an{" "}
            <InlineCode>Object</InlineCode>. Going up requires zero effort:
          </p>
        </div>
        <CodeBlock
          language="dart"
          filename="widening.dart"
          code={`
int count = 10;
num number = count;      // Works automatically
Object anything = count; // Works automatically
      `}
        />
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Going DOWN (Narrowing — Explicit Check or Cast):
            </span>{" "}
            Going from a broad type (<InlineCode>Object</InlineCode> or{" "}
            <InlineCode>num</InlineCode>) down to a specific type (
            <InlineCode>int</InlineCode>) requires proving what it is first:
          </p>
        </div>
        <CodeBlock
          language="dart"
          filename="narrowing.dart"
          code={`
Object raw = 42;

// Safe way: check with 'is' (Dart automatically promotes the type inside the if-block!)
if (raw is int) {
  print(raw + 8);       // Dart now knows 'raw' is an int
}

// Direct cast with 'as' (Crashes if 'raw' is actually a String!)
int forced = raw as int;
      `}
        />

        <h4>C. Across Different Groups (String ↔ int / double / bool)</h4>
        <p>
          Different branches of the tree don&apos;t share structure, so you
          parse or format them:
        </p>
        <TableMinimal
          heads={[
            "Direction",
            "Code",
            "Safe Alternative (Won't Crash on Bad Text)",
          ]}
          data={[
            {
              Direction: "String → int",
              Code: "int.parse('42')",
              "Safe Alternative (Won't Crash on Bad Text)":
                "int.tryParse('abc') → returns null",
            },
            {
              Direction: "String → double",
              Code: "double.parse('4.5')",
              "Safe Alternative (Won't Crash on Bad Text)":
                "double.tryParse('abc') → returns null",
            },
            {
              Direction: "String → bool",
              Code: "bool.parse('true')",
              "Safe Alternative (Won't Crash on Bad Text)":
                "text.toLowerCase() == 'true'",
            },
            {
              Direction: "Any → String",
              Code: "42.toString() or '$42'",
              "Safe Alternative (Won't Crash on Bad Text)":
                "4.567.toStringAsFixed(2) → '4.57'",
            },
          ]}
        />
      </>
    </section>
  );
};
export const Subtopic1_03 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 3. Nullable vs. Non-Nullable Types */}
      <>
        <h3>3. Nullable vs. Non-Nullable Types</h3>
        <p>
          Sound null safety means that unless a type explicitly ends with{" "}
          <InlineCode>?</InlineCode>, the compiler guarantees it can never hold{" "}
          <InlineCode>null</InlineCode>. This eliminates sudden &quot;null
          pointer&quot; crashes before you even run your code.
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>String name = &apos;Ana&apos;;</InlineCode> → Guaranteed
            to always hold text.
          </p>
          <p className="bulletpoint">
            <InlineCode>String? note = null;</InlineCode> → Explicitly allowed
            to hold text or <InlineCode>null</InlineCode>.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              The Bang Operator (!):
            </span>{" "}
            Writing <InlineCode>note!</InlineCode> tells the compiler
            &quot;Trust me, this isn&apos;t null.&quot; If you are wrong, your
            program crashes at runtime. Treat <InlineCode>!</InlineCode> as a
            last-resort escape hatch.
          </p>
        </div>
        <CodeBlock
          language="dart"
          filename="null_safety.dart"
          code={`
void main() {
  String? note;

  // print(note.length);     // Compile error: blocked before running!

  if (note != null) {
    print(note.length);      // Safe: Dart promotes 'note' to non-nullable String here
  }
}
      `}
        />
      </>

      {/* 4. Null-Aware Operators */}
      <>
        <h3>4. Null-Aware Operators</h3>
        <p>
          Instead of using <InlineCode>!</InlineCode>, use these three operators
          to handle <InlineCode>null</InlineCode> gracefully:
        </p>
        <TableMinimal
          heads={["Operator", "Name", "What It Does", "Example"]}
          data={[
            {
              Operator: "?.",
              Name: "Null-aware access",
              "What It Does":
                "Reads property/method if non-null; otherwise returns null",
              Example: "note?.length",
            },
            {
              Operator: "??",
              Name: "Null-coalescing",
              "What It Does":
                "Returns right-side fallback if left is null (does not modify variable)",
              Example: "note ?? 'No note'",
            },
            {
              Operator: "??=",
              Name: "Null-aware assignment",
              "What It Does":
                "Saves right-side value into variable only if it is currently null",
              Example: "note ??= 'Default'",
            },
          ]}
        />
        <CodeBlock
          language="dart"
          filename="null_aware.dart"
          code={`
void main() {
  String? note;

  print(note ?? 'None');     // Prints 'None', but 'note' is still null
  note ??= 'Default note';   // Now 'note' actually stores 'Default note'
  note ??= 'Ignored';        // Ignored because 'note' is no longer null
}
      `}
        />
      </>
    </section>
  );
};
export const Subtopic1_04 = () => {
  return (
    <section className="flex flex-col gap-2">
      {" "}
      {/* 5. Safe Collection Lookups */}
      <>
        <h3>5. Safe Collection Lookups</h3>
        <p>
          Searching a list with <InlineCode>.firstWhere()</InlineCode> throws a
          runtime crash (<InlineCode>StateError</InlineCode>) if nothing
          matches. Always protect lookups using one of two patterns:
        </p>
        <CodeBlock
          language="dart"
          filename="safe_lookups.dart"
          code={`
void main() {
  final products = ['Keyboard', 'Mouse', 'Monitor'];

  // Pattern 1: Provide a fallback of the exact same type using 'orElse'
  final item1 = products.firstWhere(
    (p) => p.startsWith('Z'),
    orElse: () => 'Unknown Item',
  );

  // Pattern 2: Return 'null' when missing (Dart 3+), then handle with '??'
  final item2 = products.where((p) => p.startsWith('Z')).firstOrNull;
  print(item2 ?? 'Not in catalog');
}
      `}
        />
      </>
    </section>
  );
};
export const Subtopic1_05 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Capstone Practice */}
      <>
        <h3>Capstone Practice: CLI Receipt &amp; Invoice Formatter</h3>
        <p>
          <span className="font-semibold text-foreground">
            Project Description:{" "}
          </span>
          Build a command-line receipt generator that takes a small catalog of
          products, looks up purchased items by their product ID, applies a
          fixed tax rate, and prints a clean, column-aligned invoice to the
          terminal—even when optional fields like item discounts or customer
          notes are missing (<InlineCode>null</InlineCode>).
        </p>
        <p className="font-semibold text-foreground">Key Success Criteria:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Intentional Mutability:
            </span>{" "}
            Uses <InlineCode>const</InlineCode> for fixed business rules (such
            as the 18% tax rate), <InlineCode>final</InlineCode> for item
            records and computed subtotals, and <InlineCode>var</InlineCode>{" "}
            only for running totals.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Zero Runtime Null Crashes:
            </span>{" "}
            Handles optional fields (<InlineCode>double? discount</InlineCode>,{" "}
            <InlineCode>String? note</InlineCode>) cleanly using{" "}
            <InlineCode>??</InlineCode> and <InlineCode>?.</InlineCode> without
            relying on the <InlineCode>!</InlineCode> assertion operator.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Safe Catalog Lookups:
            </span>{" "}
            Uses <InlineCode>.firstWhere(..., orElse: ...)</InlineCode> or{" "}
            <InlineCode>.firstOrNull</InlineCode> so requesting an invalid
            product ID never crashes the program.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Aligned Terminal Formatting:
            </span>{" "}
            Uses <InlineCode>.toStringAsFixed(2)</InlineCode> and{" "}
            <InlineCode>.padLeft()</InlineCode> /{" "}
            <InlineCode>.padRight()</InlineCode> so all item names, quantities,
            and currency columns line up vertically.
          </p>
        </div>
      </>
    </section>
  );
};
