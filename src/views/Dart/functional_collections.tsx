import { CodeBlock, InlineCode } from "@/components/ui/CodeDisplay";
import { NumberedList } from "@/components/ui/NumberedList";
import { TableMinimal } from "@/components/ui/tableMinimal";

export const subtopics = [
  "Typed lists, sets & maps",
  "Functional collection pipelines",
  "Enhanced enums",
  "Switch expressions & exhaustiveness",
  "Project: Multi-Currency Expense Aggregator",
];

export const summary =
  "2.1: typed collections, List, Set, Map. 2.2: map, where, fold, reduce. 2.3: enhanced enums, .name. 2.4: switch expressions, pattern matching, compile-time exhaustiveness, currency conversion. 2.5: project Multi-Currency Expense Aggregator.";

export const Subtopic2_01 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 1. Typed Lists, Sets & Maps */}
      <>
        <h3>1. Typed Lists, Sets &amp; Maps</h3>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">List: </span>
            ordered, duplicates allowed. <InlineCode>&lt;int&gt;[]</InlineCode>
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Set: </span>
            unordered, duplicates impossible.{" "}
            <InlineCode>&lt;String&gt;{"{}"}</InlineCode>
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Map: </span>
            key-value pairs.{" "}
            <InlineCode>&lt;String, double&gt;{"{}"}</InlineCode>
          </p>
        </div>
        <p>
          Type arguments in <InlineCode>&lt;...&gt;</InlineCode> are generics.
          They tell the compiler what the collection may contain, just like in
          Java or C#.
        </p>
        <p>
          <span className="font-semibold text-foreground">Gotcha: </span>A bare{" "}
          <InlineCode>{"{}"}</InlineCode> is a <InlineCode>Map</InlineCode>, not
          a <InlineCode>Set</InlineCode>. You need the type argument{" "}
          <InlineCode>&lt;String&gt;{"{}"}</InlineCode> to create an empty{" "}
          <InlineCode>Set</InlineCode>.
        </p>

        <h4>How Set Knows an Item Was There Before (O(1) vs. O(n))</h4>
        <p>
          If <InlineCode>Set</InlineCode> looped through the entire collection
          every time you added an item, inserting 10,000 items would take 10,000
          × 10,000 = 100 million checks (O(n²))—no better than writing a manual{" "}
          <InlineCode>for</InlineCode> loop. Instead, Dart&apos;s{" "}
          <InlineCode>Set</InlineCode> uses a <b>Hash Table</b>, making
          duplicate checks O(1) (instant, constant time):
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="collections.dart"
          code={`
void main() {
  final tags = <String>{};
  print(tags.add('food'));     // true  (newly added)
  print(tags.add('food'));     // false (already there, silently ignored in O(1) time)
  print(tags);                 // {food}

  print(['a', 'a', 'b'].toSet());   // {a, b}  <- quick de-duplication

  final totals = <String, double>{};
  totals['food'] = 10;
  totals['food'] = (totals['food'] ?? 0) + 5;   // map lookup gives double?, so ?? is needed
  print(totals['food']);                         // 15.0

  var oops = {};
  print(oops.runtimeType);   // Map<dynamic, dynamic>, not a Set, and not type-safe
}
      `}
        />
        <p>
          Observe that <InlineCode>totals[&apos;food&apos;]</InlineCode> returns
          a nullable <InlineCode>double?</InlineCode>. That is Chapter 1&apos;s
          null safety showing up again.
        </p>
      </>
    </section>
  );
};
export const Subtopic2_02 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 2. Functional Collection Pipelines */}
      <>
        <h3>2. Functional Collection Pipelines &amp; Lazy Evaluation</h3>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>.map(fn)</InlineCode>: transforms each element.
          </p>
          <p className="bulletpoint">
            <InlineCode>.where(fn)</InlineCode>: keeps only elements for which{" "}
            <InlineCode>fn</InlineCode> returns <InlineCode>true</InlineCode>{" "}
            (like filter).
          </p>
          <p className="bulletpoint">
            <InlineCode>.fold(start, fn)</InlineCode>: reduces everything to one
            value. You give it a starting value and a function{" "}
            <InlineCode>(accumulator, element) =&gt; newAccumulator</InlineCode>
            .
          </p>
        </div>

        <h4>What &quot;Lazy&quot; Means &amp; What You Lose (The Trade-Off)</h4>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              How normal (&quot;Eager&quot;) execution works:
            </span>{" "}
            In eager languages (like JavaScript arrays),{" "}
            <InlineCode>.filter()</InlineCode> processes every item and builds a
            full new array in RAM, and then <InlineCode>.map()</InlineCode>{" "}
            builds another full new array in RAM—even if you only wanted the
            first 2 items.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              What &quot;Lazy&quot; changes:
            </span>{" "}
            In Dart, <InlineCode>.map()</InlineCode> and{" "}
            <InlineCode>.where()</InlineCode> return an{" "}
            <InlineCode>Iterable</InlineCode>, which does zero work upfront. It
            simply stores a &quot;recipe&quot; and pulls one item through at a
            time only when consumed (for example, via{" "}
            <InlineCode>.toList()</InlineCode>, <InlineCode>.first</InlineCode>,
            or a <InlineCode>for</InlineCode> loop).
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              What we lose (Trade-offs):
            </span>
          </p>
        </div>
        <div className="ml-6 flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              1. No index access:
            </span>{" "}
            You cannot write <InlineCode>myIterable[0]</InlineCode> because
            elements haven&apos;t been computed into a list yet.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              2. Re-computation cost:
            </span>{" "}
            If you loop over a lazy <InlineCode>Iterable</InlineCode> twice (or
            call <InlineCode>.length</InlineCode> and then{" "}
            <InlineCode>.toList()</InlineCode>), Dart runs the entire pipeline
            from scratch both times. Call <InlineCode>.toList()</InlineCode>{" "}
            when you want to cache the result in memory.
          </p>
        </div>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="pipelines.dart"
          code={`
void main() {
  final prices = [10.0, 25.5, 4.0];

  final doubled = prices.map((p) => p * 2);
  print(doubled);                                   // (20.0, 51.0, 8.0) <- parentheses = Iterable, not List

  final big = prices.where((p) => p > 5).toList();
  print(big);                                       // [10.0, 25.5]

  final total = prices.fold(0.0, (sum, p) => sum + p);
  print(total);                                     // 39.5

  // Laziness in action:
  final lazy = prices.map((p) { print('processing \$p'); return p * 2; });
  print('before');       // prints first, nothing processed yet
  lazy.toList();         // NOW "processing ..." appears three times
}
      `}
        />
        <p>
          <span className="font-semibold text-foreground">Gotcha: </span>Use{" "}
          <InlineCode>fold(0.0, ...)</InlineCode> and not{" "}
          <InlineCode>fold(0, ...)</InlineCode> when summing doubles. Dart
          infers the accumulator type from the start value, so{" "}
          <InlineCode>0</InlineCode> makes it an <InlineCode>int</InlineCode>{" "}
          and the code fails to compile.
        </p>

        <h4>
          Why .fold() Exists: What .reduce() Can&apos;t Do (And When It Crashes)
        </h4>
        <p>
          Both <InlineCode>.reduce()</InlineCode> and{" "}
          <InlineCode>.fold()</InlineCode> collapse a collection into a single
          value, but <InlineCode>.reduce()</InlineCode> has two major
          limitations:
        </p>
        <NumberedList>
          <p>
            It crashes at runtime on an empty collection because it tries to
            grab the first element as its starting accumulator.
          </p>
          <p>
            It cannot change types—the return type is locked to the exact type
            of the list elements.
          </p>
        </NumberedList>
        <CodeBlock
          language="dart"
          filename="reduce_vs_fold.dart"
          code={`
void main() {
  final emptyPrices = <double>[];
  final words = ['Dart', 'Flutter'];

  // ❌ LIMITATION 1: reduce crashes when the collection is empty
  // print(emptyPrices.reduce((sum, p) => sum + p));
  // Runtime Crash -> Bad state: No element

  // ✅ FOLD FIX 1: Safe on empty lists because you supply the starting seed (0.0)
  print(emptyPrices.fold(0.0, (sum, p) => sum + p)); // Output: 0.0

  // ❌ LIMITATION 2: reduce cannot convert List<String> into an int count
  // words.reduce((total, w) => total + w.length);
  // Compile Error -> A value of type 'int' can't be assigned to a variable of type 'String'

  // ✅ FOLD FIX 2: Accumulator starts as int (0), even though items are Strings
  final totalChars = words.fold(0, (sum, w) => sum + w.length);
  print(totalChars); // Output: 11
}
      `}
        />

        <h4>Navigating Between Iterable, List, Set, and Map</h4>
        <TableMinimal
          heads={[
            "Structure",
            "Key Methods Available",
            "Core Advantage",
            "Core Disadvantage",
            "How to Convert Out",
          ]}
          data={[
            {
              Structure: "Iterable<T>",
              "Key Methods Available":
                ".map(), .where(), .take(), .skip(), .first, .any(), .every(), .fold()",
              "Core Advantage":
                "Zero upfront RAM; stops early when you only need .first or .take(3).",
              "Core Disadvantage":
                "No [index] access; re-executes logic if iterated multiple times.",
              "How to Convert Out": ".toList(), .toSet(), Map.fromEntries(...)",
            },
            {
              Structure: "List<T>",
              "Key Methods Available":
                "All Iterable methods + [i], .add(), .insert(), .sort(), .reversed",
              "Core Advantage":
                "Instant O(1) index access (list[0]) and preserves insertion order.",
              "Core Disadvantage":
                "Checking membership (.contains()) is slow O(n) on large lists.",
              "How to Convert Out":
                ".toSet(), .asMap() (gives {0: item0, ...})",
            },
            {
              Structure: "Set<T>",
              "Key Methods Available":
                "All Iterable methods + .add(), .remove(), .contains(), .union(), .intersection()",
              "Core Advantage":
                "Instant O(1) lookup & automatic duplicate prevention.",
              "Core Disadvantage": "No [index] access (set[0] is invalid).",
              "How to Convert Out": ".toList(), {for (var x in set) x: value}",
            },
            {
              Structure: "Map<K, V>",
              "Key Methods Available":
                "[key], .containsKey(), .putIfAbsent(), .update(), .keys, .values, .entries",
              "Core Advantage":
                "Instant O(1) lookup by key (e.g., currency or product ID).",
              "Core Disadvantage":
                "Keys must be unique; iterate via .keys, .values, or .entries.",
              "How to Convert Out":
                "map.keys.toList(), map.values.toSet(), map.entries.map(...)",
            },
          ]}
        />
      </>
    </section>
  );
};
export const Subtopic2_03 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 3. Enhanced Enums */}
      <>
        <h3>3. Enhanced Enums</h3>
        <p>
          An enum is a fixed set of named constants. In Dart, enums can also
          carry fields, constructors, and methods, which is why they&apos;re
          called &quot;enhanced&quot;. Every enum gets{" "}
          <InlineCode>.name</InlineCode> (the constant&apos;s name as a{" "}
          <InlineCode>String</InlineCode>), <InlineCode>.index</InlineCode>, and{" "}
          <InlineCode>.values</InlineCode> (a list of all constants) for free.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="enums.dart"
          code={`
enum Currency {
  rwf(1),
  usd(1450),      // illustrative rates: 1 unit = X RWF
  eur(1600);

  final double rateToRwf;
  const Currency(this.rateToRwf);   // each constant passes its rate to the constructor
}

void main() {
  print(Currency.usd.name);               // usd
  print(Currency.usd.rateToRwf);          // 1450.0
  print(Currency.values);                 // [Currency.rwf, Currency.usd, Currency.eur]
  print(Currency.values.byName('eur'));   // Currency.eur
  // Currency.values.byName('gbp');       // uncomment: throws ArgumentError, no such constant
}
      `}
        />
        <p>
          Observe that you can&apos;t create a currency that isn&apos;t listed.
          A typo like <InlineCode>Currency.uds</InlineCode> is caught as a
          compile error, whereas a typo in the string{" "}
          <InlineCode>&apos;uds&apos;</InlineCode> would only be discovered at
          runtime.
        </p>
      </>
    </section>
  );
};
export const Subtopic2_04 = () => {
  return (
    <section className="flex flex-col gap-2">
      {" "}
      {/* 4. Switch Expressions */}
      <>
        <h3>4. Switch Expressions &amp; Pattern Matching</h3>
        <p>
          Dart 3&apos;s <InlineCode>switch</InlineCode> can be an expression: it
          returns a value directly, so you can assign or return it without{" "}
          <InlineCode>break</InlineCode> or <InlineCode>case:</InlineCode>. The
          syntax is <InlineCode>pattern =&gt; result</InlineCode>, separated by
          commas. Pattern matching means each arm can match on shape or
          condition, not just exact equality.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="switch_expr.dart"
          code={`
String symbol(Currency c) => switch (c) {
  Currency.rwf => 'FRw',
  Currency.usd => r'\$',      // r'' = raw string, so \$ isn't treated as interpolation
  Currency.eur => '€',
};

String sizeOf(double amount) => switch (amount) {
  < 10  => 'small',          // relational pattern
  < 100 => 'medium',
  _     => 'large',          // _ = wildcard, matches anything left over
};

void main() {
  print(symbol(Currency.usd));   // \$
  print(sizeOf(5));              // small
  print(sizeOf(50));             // medium
  print(sizeOf(5000));           // large
}
      `}
        />
        <p>Cases are checked top to bottom, and the first match wins.</p>
      </>
      {/* 5. Exhaustiveness & Hub-and-Spoke */}
      <>
        <h3>5. Compile-Time Exhaustiveness &amp; Hub-and-Spoke Conversion</h3>
        <p>
          <b>Exhaustive</b> means every possible value is handled. When you
          switch over an enum, the compiler checks that every constant has a
          case. If one is missing, the code won&apos;t compile.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="exhaustiveness.dart"
          code={`
// Step 1: in symbol() above, comment out the Currency.eur line.
//   -> compile error: the switch doesn't cover Currency.eur.

// Step 2: add a catch-all \`_ => '?'\` in its place.
//   -> the error disappears. The compiler now trusts you.

// Step 3: add \`gbp(1900)\` to the enum.
//   -> with the catch-all: no error, GBP silently shows '?'. A hidden bug.
//   -> without it: every switch over Currency refuses to compile until you handle GBP.
      `}
        />
        <p>
          <span className="font-semibold text-foreground">Takeaway: </span>Avoid{" "}
          <InlineCode>_</InlineCode> on enum switches. A missing case then
          becomes a compile error instead of a runtime surprise.
        </p>
        <p>
          <span className="font-semibold text-foreground">
            Hub-and-spoke algorithm:
          </span>{" "}
          With N currencies you&apos;d normally need N × (N - 1) direct
          conversion rates. Instead, pick one hub currency (
          <InlineCode>Currency.rwf</InlineCode>) and store only each
          currency&apos;s rate to the hub. To convert anything to anything:
          source → hub → target. That requires only N rates, and the enum field{" "}
          <InlineCode>rateToRwf</InlineCode> already holds them.
        </p>
        <CodeBlock
          language="dart"
          filename="hub_and_spoke.dart"
          code={`
double convert(double amount, Currency from, Currency to) {
  final inHub = amount * from.rateToRwf;   // spoke -> hub
  return inHub / to.rateToRwf;             // hub -> spoke
}

void main() {
  print(convert(100, Currency.usd, Currency.eur).toStringAsFixed(2));
  // 90.63  (100 * 1450 = 145000 RWF, then / 1600)
}
      `}
        />
        <p>
          Observe that adding <InlineCode>gbp(1900)</InlineCode> means adding
          one enum line, with zero new pairwise conversion tables.
        </p>
      </>
    </section>
  );
};
export const Subtopic2_05 = () => {
  return (
    <section className="flex flex-col gap-2">
      {" "}
      {/* Capstone Practice */}
      <>
        <h3>Capstone Practice: Multi-Currency Expense Aggregator</h3>
        <p>
          <span className="font-semibold text-foreground">
            Project Description:
          </span>{" "}
          Build a command-line expense aggregator that ingests a hardcoded list
          of expenses recorded across multiple currencies (RWF, USD, and EUR),
          extracts all unique spending categories, filters transactions by
          category, normalizes every amount into a single hub currency (RWF),
          and prints a formatted summary report.
        </p>
        <p className="font-semibold text-foreground">Key Success Criteria:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Type-Safe Collections:
            </span>{" "}
            Uses <InlineCode>Set&lt;String&gt;</InlineCode> (
            <InlineCode>categories.add(e.category)</InlineCode>) to deduplicate
            categories in O(1) time and{" "}
            <InlineCode>Map&lt;Currency, double&gt;</InlineCode> (paired with
            Chapter 1&apos;s <InlineCode>??</InlineCode> null-coalescing) to
            accumulate totals per original currency.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Lazy Pipeline Processing:
            </span>{" "}
            Chains <InlineCode>.where()</InlineCode>,{" "}
            <InlineCode>.map()</InlineCode>, and{" "}
            <InlineCode>.fold(0.0, ...)</InlineCode> to filter expenses, convert
            amounts to <InlineCode>Currency.rwf</InlineCode>, and safely
            collapse them into a single balance—even when a filtered list is
            empty.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Enhanced Enum &amp; Exhaustive Switching:
            </span>{" "}
            Models currencies with an enhanced enum{" "}
            <InlineCode>Currency</InlineCode> carrying{" "}
            <InlineCode>rateToRwf</InlineCode>, and maps currency symbols via an
            exhaustive switch expression without a <InlineCode>_</InlineCode>{" "}
            wildcard so adding a new currency (like GBP) causes the compiler to
            pinpoint every spot that needs updating.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Clean Output Formatting:
            </span>{" "}
            Uses <InlineCode>.toStringAsFixed(2)</InlineCode> from Chapter 1 so
            all converted balances print cleanly.
          </p>
        </div>
      </>
    </section>
  );
};
