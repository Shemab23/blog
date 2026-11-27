import { CodeBlock, InlineCode } from "@/components/ui/CodeDisplay";

export const subtopics = [
  "Extension methods & safe parsing",
  "Operator overloading & covariant",
  "Custom string representation",
  "Project: Smart Measurement & Money Toolkit",
];

export const summary =
  "4.1: extension methods, CurrencyFormatter, num.tryParse. 4.2: operator overloading, +, >, covariant. 4.3: toString override. 4.4: project Smart Measurement & Money Toolkit.";

export const Subtopic4_01 = () => {
  return (
    <section className="flex flex-col gap-2">
      <p>
        Chapter 3 built your own classes. Chapter 4 makes them feel native to
        the language. Extensions (Parts 1 and 2) teach existing types new
        tricks. Operator overloading (Part 3) teaches your types the
        language&apos;s symbols. <InlineCode>covariant</InlineCode> (Part 4) is
        the rule you hit once those operators meet class hierarchies.{" "}
        <InlineCode>toString</InlineCode> (Part 5) makes the result readable.
        The Smart Measurement &amp; Money Toolkit combines all of them so you
        can write <InlineCode>50.usd + 1000.rwf</InlineCode> and get a sensible
        answer.
      </p>

      {/* 1. Extension Methods */}
      <>
        <h3>1. Extension Methods &amp; Static vs. Dynamic Dispatch</h3>
        <p>
          An <b>extension</b> adds methods, getters, setters, or operators to a
          type you don&apos;t own (<InlineCode>double</InlineCode>,{" "}
          <InlineCode>String</InlineCode>, <InlineCode>List</InlineCode>)
          without subclassing or editing it. You may know this from C# extension
          methods, Kotlin extension functions, or Swift extensions.
        </p>
        <p className="font-semibold text-foreground">Key facts:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            An extension has <b>no state</b>. It can&apos;t add fields, only
            behavior.
          </p>
          <p className="bulletpoint">
            It&apos;s resolved <b>statically, at compile time</b>, using the
            variable&apos;s declared type. It is not a real method on the class,
            so it can&apos;t override anything and doesn&apos;t work on{" "}
            <InlineCode>dynamic</InlineCode>.
          </p>
          <p className="bulletpoint">
            Use on <InlineCode>num</InlineCode> to cover both{" "}
            <InlineCode>int</InlineCode> and <InlineCode>double</InlineCode>.
          </p>
        </div>

        <h4>Why Extensions Fail on dynamic: What Is &quot;Dispatch&quot;?</h4>
        <p>
          <b>Dispatch</b> simply means &quot;how the language decides which
          function body to run when you call a method.&quot;
        </p>
        <CodeBlock
          language="text"
          filename="Dispatch Comparison"
          code={`
STATIC DISPATCH (Extensions)                     DYNAMIC DISPATCH (Real Class Methods)
────────────────────────────                     ─────────────────────────────────────
1. Happens at COMPILE TIME.                      1. Happens at RUNTIME.
2. Compiler looks at the variable's label:       2. Dart inspects the actual object in RAM:
     double x = 5.0;                                 dynamic d = 5.0;
3. Rewrites \`x.asMoney\` into a hidden            3. Looks inside the object's class table
   top-level call: \`CurrencyFormatter(x).asMoney\`   for \`.asMoney\`. Not found -> CRASH!
      `}
        />
        <p>
          Because an extension never modifies the actual{" "}
          <InlineCode>double</InlineCode> class in memory—it is just compiler
          sugar rewritten at compile time based on the variable&apos;s declared
          static type—hiding that type behind <InlineCode>dynamic</InlineCode>{" "}
          blinds the compiler so it never wires up the extension.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="extensions.dart"
          code={`
extension CurrencyFormatter on double {
  String get asMoney => toStringAsFixed(2);          // 'this' is the double itself
  String padded(int width) => asMoney.padLeft(width);
}

extension NumShortcuts on num {
  double get percent => this / 100;                  // works on int AND double
}

void main() {
  print(1234.5.asMoney);          // 1234.50
  print(9.5.padded(8));           //     9.50   <- right-aligned
  print(18.percent);              // 0.18  (int 18 works because the extension is on num)

  dynamic d = 5.0;
  // print(d.asMoney);            // uncomment: runtime NoSuchMethodError
}
      `}
        />
        <p>
          Observe that the <InlineCode>dynamic</InlineCode> call fails. The
          compiler can only pick the extension when it knows the static type is{" "}
          <InlineCode>double</InlineCode>. This is Chapter 1&apos;s lesson
          again: typed code is checked early, <InlineCode>dynamic</InlineCode>{" "}
          code is not.
        </p>
      </>

      {/* 2. Safe Parsing Patterns */}
      <>
        <h3>2. Safe Parsing Patterns</h3>
        <p>
          <InlineCode>double.parse(&apos;abc&apos;)</InlineCode> throws a{" "}
          <InlineCode>FormatException</InlineCode>.{" "}
          <InlineCode>tryParse</InlineCode> returns{" "}
          <InlineCode>null</InlineCode> instead, so the failure becomes a
          nullable value (<InlineCode>double?</InlineCode>) that you handle with
          Chapter 1&apos;s <InlineCode>??</InlineCode> and{" "}
          <InlineCode>?.</InlineCode>. Wrapping it in an extension gives you one
          reusable cleanup point for messy input like{" "}
          <InlineCode>&apos; 1,500.50 &apos;</InlineCode>.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="safe_parse.dart"
          code={`
extension SafeParse on String {
  double? toAmount() => num.tryParse(replaceAll(',', '').trim())?.toDouble();
}

void main() {
  print('42'.toAmount());              // 42.0
  print(' 1,500.50 '.toAmount());      // 1500.5   <- comma and spaces cleaned
  print('abc'.toAmount());             // null     <- no crash
  print(''.toAmount());                // null
  print('abc'.toAmount() ?? 0);        // 0        <- fallback from Chapter 1

  // double.parse('abc');              // uncomment: throws FormatException
}
      `}
        />
        <p>
          Observe that <InlineCode>num.tryParse</InlineCode> returns an{" "}
          <InlineCode>int</InlineCode> for{" "}
          <InlineCode>&apos;42&apos;</InlineCode>. That is why{" "}
          <InlineCode>?.toDouble()</InlineCode> is added, so the extension
          always returns a <InlineCode>double?</InlineCode>.
        </p>
      </>
    </section>
  );
};
export const Subtopic4_02 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 3. Operator Overloading */}
      <>
        <h3>3. Operator Overloading, hashCode, and Floating-Point Quirks</h3>
        <p>
          Operators like <InlineCode>+</InlineCode>, <InlineCode>-</InlineCode>,{" "}
          <InlineCode>&gt;</InlineCode>, <InlineCode>&lt;</InlineCode>,{" "}
          <InlineCode>[]</InlineCode>, and <InlineCode>==</InlineCode> are just
          methods with special names, and you can define them on your classes
          with the <InlineCode>operator</InlineCode> keyword (just like{" "}
          <InlineCode>__add__</InlineCode> in Python or{" "}
          <InlineCode>operator+</InlineCode> in C++).
        </p>
        <p className="font-semibold text-foreground">Rules worth knowing:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            Defining <InlineCode>&gt;</InlineCode> does not give you{" "}
            <InlineCode>&lt;</InlineCode>, <InlineCode>&gt;=</InlineCode>, or{" "}
            <InlineCode>&lt;=</InlineCode>. Each is defined separately.
          </p>
          <p className="bulletpoint">
            Define <InlineCode>==</InlineCode> and{" "}
            <InlineCode>hashCode</InlineCode> together. Without{" "}
            <InlineCode>==</InlineCode>, two equal-looking objects compare by
            memory identity, so <InlineCode>Money(5) == Money(5)</InlineCode> is{" "}
            <InlineCode>false</InlineCode>.
          </p>
          <p className="bulletpoint">
            <InlineCode>+</InlineCode> should return a <b>new</b> object. Keep
            your objects immutable (Chapter 1&apos;s{" "}
            <InlineCode>final</InlineCode>).
          </p>
        </div>

        <h4>What Is hashCode (Before == Even Runs) &amp; Building Our Own</h4>
        <p>
          Remember Chapter 2&apos;s <InlineCode>Set</InlineCode> and{" "}
          <InlineCode>Map</InlineCode>? They don&apos;t compare your new object
          against every existing item with <InlineCode>==</InlineCode>—that
          would be slow O(n). Instead, they ask your object for an integer
          bucket address called <InlineCode>hashCode</InlineCode> first:
        </p>
        <CodeBlock
          language="text"
          filename="Hash Lookup"
          code={`
Step 1: Look up bucket using \`obj.hashCode\`  ──► Fast O(1) jump to memory slot
Step 2: Only if two objects land in the SAME bucket, run \`a == b\` to confirm!
      `}
        />
        <p className="font-semibold text-foreground">
          Experimenting with our own hashCode:
        </p>
        <p>
          A good <InlineCode>hashCode</InlineCode> must rely only on the exact
          same immutable fields that <InlineCode>==</InlineCode> compares. Look
          what happens if you write a naive custom hash vs. a proper one:
        </p>
        <CodeBlock
          language="dart"
          filename="hashcode.dart"
          code={`
class NaiveMoney {
  final double amount;
  final String currency;
  const NaiveMoney(this.amount, this.currency);

  @override
  bool operator ==(Object other) =>
      other is NaiveMoney && other.amount == amount && other.currency == currency;

  // ❌ DIY Experiment 1: Relying on only ONE field or addition
  // Problem: 10 USD and 10 RWF collide in the same bucket, or (10 + 5) == (5 + 10)!
  @override
  int get hashCode => amount.hashCode ^ currency.hashCode; // Better, but symmetric (A ^ B == B ^ A)
}

void main() {
  // ❌ What happens if you override == WITHOUT overriding hashCode?
  // Dart uses default memory-address hashCode, so two equal Money(5, 'USD') objects
  // get DIFFERENT bucket numbers! A Set or Map won't even find the matching key!

  // ✅ Why we rely on Object.hash(amount, currency):
  // Dart's built-in Jenkins hash mixes bit positions asymmetrically so order and
  // field combinations spread evenly across buckets with near-zero collisions.
  print(Object.hash(10.0, 'USD') == Object.hash(10.0, 'USD')); // true
  print(Object.hash(10.0, 'USD') == Object.hash(10.0, 'RWF')); // false
}
      `}
        />
        <p>
          <span className="font-semibold text-foreground">
            The Golden Contract:
          </span>{" "}
          If <InlineCode>a == b</InlineCode> is <InlineCode>true</InlineCode>,
          then <InlineCode>a.hashCode == b.hashCode</InlineCode> must also be{" "}
          <InlineCode>true</InlineCode>. That is why{" "}
          <InlineCode>hashCode</InlineCode> must depend on the exact same fields
          as <InlineCode>==</InlineCode>, and why{" "}
          <InlineCode>Object.hash(field1, field2)</InlineCode> is the standard
          high-level tool.
        </p>

        <h4>Why Floating-Point double Math Has Rounding Quirks</h4>
        <p>
          Computers store <InlineCode>double</InlineCode> numbers in base-2
          (binary) fractions (1/2, 1/4, 1/8, 1/16...), not base-10 decimals.
          Just like 1/3 cannot be written cleanly in base-10 (0.333333...),
          simple base-10 numbers like 0.1 and 0.2 are infinite repeating
          fractions in binary:
        </p>
        <CodeBlock
          language="dart"
          filename="float_quirks.dart"
          code={`
void main() {
  print(0.1 + 0.2);               // 0.30000000000000004  <-- Classic IEEE 754 quirk!
  print(0.1 + 0.2 == 0.3);        // false!
  print((0.1 + 0.2).toStringAsFixed(2)); // 0.30
}
      `}
        />
        <p>
          <span className="font-semibold text-foreground">
            Real-world fintech takeaway:
          </span>{" "}
          Production banking apps store money as <InlineCode>int</InlineCode>{" "}
          minor units (e.g., 1050 cents instead of 10.50 dollars) so integer
          math is 100% exact. For learning here, <InlineCode>double</InlineCode>{" "}
          is fine.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="money_operators.dart"
          code={`
// Uses the Currency enum from Chapter 2 (rateToRwf per currency).
class Money {
  final double amount;
  final Currency currency;
  const Money(this.amount, this.currency);

  Money convertTo(Currency to) =>
      Money(amount * currency.rateToRwf / to.rateToRwf, to);   // hub-and-spoke

  Money operator +(Money other) =>
      Money(amount + other.convertTo(currency).amount, currency);  // result keeps LEFT currency

  bool operator >(Money other) =>
      amount * currency.rateToRwf > other.amount * other.currency.rateToRwf;

  @override
  bool operator ==(Object other) =>
      other is Money && other.amount == amount && other.currency == currency;

  @override
  int get hashCode => Object.hash(amount, currency);
}

extension MoneyShortcuts on num {          // Part 1 helps build readable code
  Money get usd => Money(toDouble(), Currency.usd);
  Money get rwf => Money(toDouble(), Currency.rwf);
  Money get eur => Money(toDouble(), Currency.eur);
}

void main() {
  final sum = 1.usd + 1450.rwf;            // 1450 RWF is exactly 1 USD at our rate
  print(sum.amount);                       // 2.0
  print(sum.currency);                     // Currency.usd
  print(100.eur > 100.usd);                // true
  print(100.usd == 100.usd);               // true
  // print(100.usd < 50.usd);              // uncomment: compile error, '<' isn't defined
}
      `}
        />
        <p>
          Observe that <InlineCode>+</InlineCode> works across currencies with
          no special handling at the call site. The conversion logic lives in
          one place.
        </p>
      </>

      {/* 4. covariant */}
      <>
        <h3>4. Type Safety with covariant</h3>

        <h4>Why Dart Blocks Narrowing Method Parameters by Default</h4>
        <p>
          This comes down to the <b>Liskov Substitution Principle (LSP)</b>:
          anywhere your code expects a <InlineCode>Shape</InlineCode>, you must
          be able to hand it a <InlineCode>Box</InlineCode> without breaking the
          program.
        </p>
        <p>
          Look at the contract <InlineCode>Shape</InlineCode> makes to the
          world:
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>Shape</InlineCode> promises: &quot;Give me any{" "}
            <InlineCode>Shape</InlineCode> (a <InlineCode>Box</InlineCode>, a{" "}
            <InlineCode>Circle</InlineCode>, a <InlineCode>Triangle</InlineCode>
            ), and <InlineCode>isBiggerThan</InlineCode> will work.&quot;
          </p>
          <p className="bulletpoint">
            If <InlineCode>Box</InlineCode> overrides{" "}
            <InlineCode>isBiggerThan(Box other)</InlineCode> to accept only{" "}
            <InlineCode>Box</InlineCode>, it secretly breaks its parent&apos;s
            promise. Anyone holding a <InlineCode>Shape</InlineCode> variable
            could pass a <InlineCode>Circle</InlineCode>, causing a type crash!
            Therefore, Dart blocks parameter narrowing at compile time.
          </p>
        </div>
        <p>
          The <InlineCode>covariant</InlineCode> keyword says: &quot;I know this
          narrows the type. Allow it, and check the type at runtime
          instead.&quot; You are trading a compile-time guarantee for
          flexibility, similar to what the <InlineCode>!</InlineCode> operator
          did in Chapter 1.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="covariant.dart"
          code={`
abstract class Shape {
  double get area;
  bool isBiggerThan(Shape other) => area > other.area;
}

class Box extends Shape {
  final double w, h;
  Box(this.w, this.h);
  @override
  double get area => w * h;

  // Step 1: write it WITHOUT covariant:
  //   bool isBiggerThan(Box other) => ...
  //   -> compile error: parameter type is narrower than Shape's.

  // Step 2: add covariant:
  @override
  bool isBiggerThan(covariant Box other) => area > other.area;   // compiles now
}

class Circle extends Shape {
  final double r;
  Circle(this.r);
  @override
  double get area => 3.14159 * r * r;
}

void main() {
  final Shape a = Box(2, 3);
  print(a.isBiggerThan(Box(1, 1)));      // true  <- fine
  print(a.isBiggerThan(Circle(1)));      // compiles, but TypeError at runtime
}
      `}
        />
        <p>
          Observe that the last line passes the compiler because{" "}
          <InlineCode>a</InlineCode> is typed as <InlineCode>Shape</InlineCode>,
          and then crashes. That is the cost of{" "}
          <InlineCode>covariant</InlineCode>.
        </p>
        <p>
          <span className="font-semibold text-foreground">Practical rule:</span>{" "}
          Don&apos;t reach for <InlineCode>covariant</InlineCode> by default.
          Prefer a wider parameter type with an <InlineCode>is</InlineCode>{" "}
          check, as <InlineCode>==</InlineCode> does with{" "}
          <InlineCode>Object other</InlineCode> above. Use{" "}
          <InlineCode>covariant</InlineCode> only when narrowing is a genuine
          domain rule (e.g., comparing <InlineCode>Length</InlineCode> to{" "}
          <InlineCode>Length</InlineCode> and never to{" "}
          <InlineCode>Weight</InlineCode>).
        </p>
      </>
    </section>
  );
};
export const Subtopic4_03 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 5. toString */}
      <>
        <h3>5. Custom Object Representation: toString</h3>
        <p>
          Every object inherits a <InlineCode>toString()</InlineCode> method
          from <InlineCode>Object</InlineCode>.{" "}
          <InlineCode>print(obj)</InlineCode>, string interpolation (
          <InlineCode>&apos;$obj&apos;</InlineCode>), and collection printing
          all call it automatically. The default output is unhelpful (
          <InlineCode>Instance of &apos;Money&apos;</InlineCode>), so override
          it.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="to_string.dart"
          code={`
// Step 1: print a Money with no toString:
print(5.usd);                  // Instance of 'Money'
print([5.usd, 7.rwf]);         // [Instance of 'Money', Instance of 'Money']

// Step 2: add this to the Money class:
//   @override
//   String toString() => '\${amount.toStringAsFixed(2)} \${currency.name.toUpperCase()}';

// Step 3: run the same prints again:
print(5.usd);                  // 5.00 USD
print([5.usd, 7.rwf]);         // [5.00 USD, 7.00 RWF]   <- lists use it automatically
print('Total: \${1.usd + 1450.rwf}');   // Total: 2.00 USD
      `}
        />
        <p>
          Observe that changing one method improves every print, log message,
          and interpolated string across your entire program.
        </p>
      </>
    </section>
  );
};
export const Subtopic4_04 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Capstone Practice */}
      <>
        <h3>Capstone Practice: Smart Measurement &amp; Money Toolkit</h3>
        <p>
          <span className="font-semibold text-foreground">
            Project Description:
          </span>{" "}
          Build an expressive, domain-friendly currency and measurement toolkit
          that parses messy raw text inputs (such as{" "}
          <InlineCode>&apos;1,200&apos;</InlineCode>,{" "}
          <InlineCode>&apos; 45.5 &apos;</InlineCode>, and{" "}
          <InlineCode>&apos;oops&apos;</InlineCode>) into immutable{" "}
          <InlineCode>Money</InlineCode> objects, supports natural
          cross-currency math (<InlineCode>50.usd + 1000.rwf</InlineCode>) and
          comparisons (<InlineCode>&gt;</InlineCode>), deduplicates identical
          amounts inside a <InlineCode>Set</InlineCode>, and prints a cleanly
          aligned summary report.
        </p>
        <p className="font-semibold text-foreground">Key Success Criteria:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Expressive Extensions:
            </span>{" "}
            Implements extension on <InlineCode>num</InlineCode> (
            <InlineCode>50.usd</InlineCode>, <InlineCode>1000.rwf</InlineCode>,{" "}
            <InlineCode>25.eur</InlineCode>) for readable object creation,
            extension on <InlineCode>double</InlineCode> (
            <InlineCode>.padded(10)</InlineCode>) for aligned formatting, and
            extension on <InlineCode>String</InlineCode> (
            <InlineCode>.toAmount()</InlineCode>) returning{" "}
            <InlineCode>double?</InlineCode> to safely clean and parse messy
            strings without crashing.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Operator Overloading &amp; Hash Integrity:
            </span>{" "}
            Overloads <InlineCode>+</InlineCode> (using Chapter 2&apos;s
            hub-and-spoke conversion while keeping the left-hand currency),{" "}
            <InlineCode>&gt;</InlineCode>, <InlineCode>==</InlineCode>, and{" "}
            <InlineCode>hashCode</InlineCode> (via{" "}
            <InlineCode>Object.hash(amount, currency)</InlineCode>) so equal{" "}
            <InlineCode>Money</InlineCode> instances behave accurately in{" "}
            <InlineCode>Set</InlineCode>s and <InlineCode>Map</InlineCode>s.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Safe Hierarchy Design:
            </span>{" "}
            When adding sibling measurement classes (such as{" "}
            <InlineCode>Box</InlineCode> or <InlineCode>Length</InlineCode>),
            deliberately weighs <InlineCode>covariant</InlineCode> parameter
            narrowing against wider <InlineCode>Object</InlineCode>/
            <InlineCode>Shape</InlineCode> parameters with{" "}
            <InlineCode>is</InlineCode> type checks.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Readable Output &amp; Aggregation:
            </span>{" "}
            Overrides <InlineCode>toString()</InlineCode> on{" "}
            <InlineCode>Money</InlineCode> (
            <InlineCode>&apos;50.00 USD&apos;</InlineCode>) and combines parsed
            values with <InlineCode>.fold(...)</InlineCode> from Chapter 2 to
            output a clean total while skipping invalid inputs gracefully.
          </p>
        </div>
      </>
    </section>
  );
};
