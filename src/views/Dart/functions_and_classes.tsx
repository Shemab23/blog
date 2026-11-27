import { CodeBlock, InlineCode } from "@/components/ui/CodeDisplay";
import { TableMinimal } from "@/components/ui/tableMinimal";

export const subtopics = [
  "Flexible parameter signatures",
  "Generative & factory constructors",
  "Inheritance & superclass communication",
  "Interfaces vs. mixins (extends, implements, with)",
  "Project: JSON-to-Object Ledger System",
];

export const summary =
  "3.1: positional, named, optional, required, default parameters. 3.2: generative constructors, initializing formals, factory constructors, fromMap. 3.3: inheritance, extends, initializer list, super parameters. 3.4: interfaces vs mixins, extends, implements, with, Repository<T>. 3.5: project JSON-to-Object Ledger System.";

export const Subtopic3_01 = () => {
  return (
    <section className="flex flex-col gap-2">
      <p>
        <span className="font-semibold text-foreground">
          The thread running through it:
        </span>{" "}
        Chapters 1 and 2 were about data (what can be null, what can change,
        what shape it takes). Chapter 3 is about packaging data with behavior.
        Parts 1 and 2 cover how you call things and how objects are born. Part 3
        covers how raw data (a JSON Map) safely becomes a typed object. Parts 4
        and 5 cover how objects relate to each other through inheritance,
        interfaces, and mixins. The JSON-to-Object Ledger System uses all five.
      </p>

      {/* 1. Flexible Parameter Signatures */}
      <>
        <h3>1. Flexible Parameter Signatures</h3>
        <TableMinimal
          heads={["Kind", "Syntax", "Required?"]}
          data={[
            {
              Kind: "Positional",
              Syntax: "f(int a)",
              "Required?": "Yes",
            },
            {
              Kind: "Optional positional",
              Syntax: "f([int a = 0])",
              "Required?": "No",
            },
            {
              Kind: "Named",
              Syntax: "f({int a = 0})",
              "Required?": "No, unless marked required",
            },
          ]}
        />
        <p>
          A named parameter that isn&apos;t marked{" "}
          <InlineCode>required</InlineCode> must have either a default value or
          a nullable type (<InlineCode>String?</InlineCode>). Otherwise the
          compiler refuses—which is Chapter 1&apos;s sound null safety showing
          up again. You cannot mix <InlineCode>[]</InlineCode> and{" "}
          <InlineCode>{"{}"}</InlineCode> in the same function signature.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="parameters.dart"
          code={`
String greet(String name, [String greeting = 'Hello']) => '\$greeting, \$name';

String fmt(double amount, {required String currency, int decimals = 2, String? note}) =>
    '\${amount.toStringAsFixed(decimals)} \$currency\${note == null ? '' : ' (\$note)'}';

void main() {
  print(greet('Ana'));                    // Hello, Ana
  print(greet('Ana', 'Hi'));              // Hi, Ana

  print(fmt(12.5, currency: 'RWF'));                       // 12.50 RWF
  print(fmt(12.5, decimals: 0, currency: 'USD'));          // 12 USD  <- order doesn't matter
  print(fmt(12.5, currency: 'EUR', note: 'tip'));          // 12.50 EUR (tip)

  // fmt(12.5);   // uncomment: compile error, currency is required
}
      `}
        />
        <p>
          Observe that named arguments make the call self-documenting, and{" "}
          <InlineCode>required</InlineCode> turns a forgotten argument into a
          compile error instead of a runtime bug.
        </p>
      </>
    </section>
  );
};
export const Subtopic3_02 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 2. Generative Constructors */}
      <>
        <h3>2. Generative Constructors &amp; Initializing Formals</h3>
        <p>
          A <b>generative constructor</b> is the ordinary kind: it allocates and
          creates a brand-new instance of its own class. In many languages you
          write <InlineCode>this.x = x;</InlineCode> inside the constructor body
          for every field. Dart&apos;s <b>initializing formal</b>{" "}
          <InlineCode>this.x</InlineCode> right in the parameter list does that
          assignment automatically.
        </p>
        <p>
          <span className="font-semibold text-foreground">
            Why it matters for final:
          </span>{" "}
          <InlineCode>final</InlineCode> fields must be assigned before the
          constructor body runs. Putting <InlineCode>this.x</InlineCode> in the
          parameter list (or assigning fields in the initializer list after{" "}
          <InlineCode>:</InlineCode>) happens before the body executes, allowing
          all your fields to stay <InlineCode>final</InlineCode>.
        </p>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="constructors.dart"
          code={`
class Money {
  final double amount;
  final String currency;

  Money(this.amount, [this.currency = 'RWF'])      // no body needed
      : assert(amount >= 0, 'amount must be >= 0'); // initializer list: runs BEFORE the body

  Money.zero() : amount = 0, currency = 'RWF';      // named constructor
}

class Expense {
  final String category;
  final double amount;
  final String? note;
  Expense({required this.category, required this.amount, this.note});  // named + this.
}

void main() {
  print(Money(10).currency);        // RWF  <- default used
  print(Money.zero().amount);       // 0.0
  print(Expense(category: 'food', amount: 5).note);   // null
  // Money(-5);   // uncomment: assertion fails (debug mode only)
}
      `}
        />
        <p>
          Observe that the initializer list (the part after{" "}
          <InlineCode>:</InlineCode>) is where you assign fields or run{" "}
          <InlineCode>assert(...)</InlineCode> validations before the object
          finishes being born.
        </p>
      </>

      {/* 3. Factory Constructors */}
      <>
        <h3>3. Factory Constructors, static Methods &amp; Deserialization</h3>
        <p>
          A factory constructor (
          <InlineCode>factory ClassName.name(...)</InlineCode>) can run
          arbitrary logic and return any instance: an existing cached object, a
          validated object, or even a subclass. Because the object does not
          exist yet when the factory starts running,{" "}
          <InlineCode>this</InlineCode> is not accessible inside it.
        </p>

        <h4>factory Constructor vs. static Method: What Is the Difference?</h4>
        <p>
          At runtime, a factory constructor and a static method work almost
          identically—neither has access to <InlineCode>this</InlineCode>, and
          both can return an instance of the class. So why does Dart have{" "}
          <InlineCode>factory</InlineCode>?
        </p>
        <TableMinimal
          heads={["Feature", "factory Constructor", "static Method"]}
          data={[
            {
              Feature: "Call-site syntax",
              "factory Constructor":
                "Called like a normal constructor (Expense.fromMap(...) or new Expense(...)).",
              "static Method":
                "Called like a utility function (Expense.parse(...)).",
            },
            {
              Feature: "Unnamed constructor",
              "factory Constructor":
                "Can be the default unnamed constructor (factory Logger() => _cache;) so callers don't even know they're getting a cached or subclassed object!",
              "static Method":
                "Cannot replace the default Logger() constructor.",
            },
            {
              Feature: "Return type",
              "factory Constructor":
                "Must return an instance of the class (or a subclass).",
              "static Method":
                "Can return anything (void, bool, List<Expense>, null, etc.).",
            },
            {
              Feature: "Subclass redirecting",
              "factory Constructor":
                "Can cleanly forward to generative constructors (factory Tx.sale(...) = Sale;).",
              "static Method":
                "Must explicitly call and return inside a function body.",
            },
          ]}
        />
        <p>
          <span className="font-semibold text-foreground">Rule of thumb: </span>
          Use a factory when the caller&apos;s intent is &quot;give me an
          instance of this class&quot; (especially for{" "}
          <InlineCode>fromMap</InlineCode> / <InlineCode>fromJson</InlineCode>,
          singletons/caching, or returning subclasses). Use a static method for
          helper operations that don&apos;t construct a single instance (like{" "}
          <InlineCode>Expense.isValidCategory(&apos;food&apos;)</InlineCode>).
        </p>

        <h4>
          Deserialization &amp; Why (map[&apos;amount&apos;] as num).toDouble()
          Is Required
        </h4>
        <p>
          <b>Deserialization</b> means turning raw, untyped data (like a JSON{" "}
          <InlineCode>Map&lt;String, dynamic&gt;</InlineCode>) into a strictly
          typed Dart object.
        </p>
        <p>
          In JSON, whole numbers like <InlineCode>5</InlineCode> are parsed as{" "}
          <InlineCode>int</InlineCode>, while <InlineCode>5.5</InlineCode> is
          parsed as <InlineCode>double</InlineCode>. Remember Chapter 2&apos;s
          type tree: <InlineCode>int</InlineCode> and{" "}
          <InlineCode>double</InlineCode> are siblings under{" "}
          <InlineCode>num</InlineCode>—an <InlineCode>int</InlineCode> is not a{" "}
          <InlineCode>double</InlineCode>!
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            Writing <InlineCode>map[&apos;amount&apos;] as double</InlineCode>{" "}
            crashes at runtime whenever JSON sends <InlineCode>5</InlineCode> (
            <InlineCode>
              TypeError: type &apos;int&apos; is not a subtype of type
              &apos;double&apos;
            </InlineCode>
            ).
          </p>
          <p className="bulletpoint">
            Writing{" "}
            <InlineCode>(map[&apos;amount&apos;] as num).toDouble()</InlineCode>{" "}
            accepts both <InlineCode>int</InlineCode> and{" "}
            <InlineCode>double</InlineCode> (and rejects invalid strings like{" "}
            <InlineCode>&apos;5&apos;</InlineCode> immediately), safely
            converting any valid number into a <InlineCode>double</InlineCode>.
          </p>
        </div>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="deserialization.dart"
          code={`
class Expense {
  final String category;
  final double amount;
  final String? note;
  Expense({required this.category, required this.amount, this.note});

  factory Expense.fromMap(Map<String, dynamic> map) {
    return Expense(
      category: map['category'] as String,
      amount: (map['amount'] as num).toDouble(),   // num covers both int and double safely
      note: map['note'] as String?,                // missing key -> null is fine
    );
  }
}

void main() {
  final e = Expense.fromMap({'category': 'food', 'amount': 5});   // note: 5 is an int
  print(e.amount);    // 5.0   <- safely converted to double
  print(e.note);      // null

  // Expense.fromMap({'category': 'food', 'amount': '5'});   // TypeError: String is not a num
  // Expense.fromMap({'amount': 5});                         // TypeError: null is not a String
}
      `}
        />
        <p>
          Observe that a <InlineCode>Map&lt;String, dynamic&gt;</InlineCode> is
          untyped, so <InlineCode>as</InlineCode> casts inside{" "}
          <InlineCode>fromMap</InlineCode> are the exact boundary where bad
          external data gets caught in one centralized place.
        </p>
      </>
    </section>
  );
};
export const Subtopic3_03 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 4. Inheritance & Superclass Communication */}
      <>
        <h3>4. Inheritance &amp; Superclass Communication</h3>
        <p>
          <InlineCode>extends</InlineCode> creates a subclass that inherits all
          fields and methods from its parent. Dart has single inheritance (each
          class can extend only one parent), and constructors are not inherited,
          so every subclass must call its parent&apos;s constructor.
        </p>
        <p>Two ways to forward arguments to the parent:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Explicit style:
            </span>{" "}
            <InlineCode>
              Sale(String id, double amount, this.customer) : super(id, amount);
            </InlineCode>
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Super-parameter shorthand (Dart 2.17+):
            </span>{" "}
            <InlineCode>
              Sale(super.id, super.amount, this.customer);
            </InlineCode>
          </p>
        </div>
        <p>Order of execution:</p>
        <CodeBlock
          language="bash"
          filename="Execution Order"
          code={`
1. Subclass initializer list  ──►  2. Superclass constructor  ──►  3. Subclass constructor body
      `}
        />
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="inheritance.dart"
          code={`
class Transaction {
  final String id;
  final double amount;
  Transaction(this.id, this.amount) { print('Transaction ctor'); }

  String describe() => '\$id: \$amount';
}

class Sale extends Transaction {
  final String customer;
  Sale(super.id, super.amount, this.customer) { print('Sale ctor'); }

  @override
  String describe() => '\${super.describe()} (customer: \$customer)';
}

void main() {
  final s = Sale('S1', 100, 'Ana');
  // prints: Transaction ctor
  //         Sale ctor          <- parent ran first
  print(s.describe());     // S1: 100.0 (customer: Ana)
  print(s is Transaction); // true
}
      `}
        />
        <p>
          Observe the print order and that <InlineCode>@override</InlineCode>{" "}
          tells the compiler to verify that you actually matched an existing
          parent method signature (preventing silent typos).
        </p>
      </>
    </section>
  );
};
export const Subtopic3_04 = () => {
  return (
    <section className="flex flex-col gap-2">
      {" "}
      {/* 5. extends vs implements vs with */}
      <>
        <h3>5. extends vs. implements vs. with</h3>
        <p>
          In Dart, every class automatically defines an{" "}
          <b>implicit interface</b> describing its public fields and methods.
          That makes the difference between <InlineCode>extends</InlineCode> and{" "}
          <InlineCode>implements</InlineCode> crystal clear:
        </p>
        <TableMinimal
          heads={["Keyword", "What You Get", "Rules & Limits", "Use When"]}
          data={[
            {
              Keyword: "extends",
              "What You Get": "Parent's fields and working method code.",
              "Rules & Limits": "Single inheritance (1 parent max).",
              "Use When":
                'True "Is-a" relationship where you want to reuse the parent\'s implementation (Sale extends Transaction).',
            },
            {
              Keyword: "implements",
              "What You Get":
                "Only the contract (shape). You must rewrite every field & method yourself.",
              "Rules & Limits": "Multiple allowed (implements A, B).",
              "Use When":
                "You want a guarantee of shape without inheriting implementation—ideal for abstract class interfaces (Repository<T>) or mock classes in tests.",
            },
            {
              Keyword: "with",
              "What You Get": "A mixin's reusable fields and methods.",
              "Rules & Limits": "Multiple allowed (with A, B).",
              "Use When":
                "Sharing a cross-cutting capability (like logging or timestamps) across unrelated classes without locking up your single extends slot.",
            },
          ]}
        />
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="extends_implements_with.dart"
          code={`
mixin Auditable {
  final List<String> log = [];
  void audit(String msg) => log.add(msg);
}

abstract class Repository<T> {
  void add(T item);
  T? findById(String id);
  List<T> all();
}

class TxRepository with Auditable implements Repository<Transaction> {
  final _items = <String, Transaction>{};     // _ = private to this library/file

  @override
  void add(Transaction t) { _items[t.id] = t; audit('added \${t.id}'); }

  @override
  Transaction? findById(String id) => _items[id];

  @override
  List<Transaction> all() => _items.values.toList();
}

void main() {
  final repo = TxRepository();
  repo.add(Sale('S1', 100, 'Ana'));
  print(repo.findById('S1')?.describe());   // S1: 100.0 (customer: Ana)
  print(repo.findById('nope')?.describe()); // null (the ?. from Chapter 1)
  print(repo.log);                          // [added S1]  <- came from the mixin
  // Now delete the all() method in TxRepository -> compile error: contract not fulfilled.
}
      `}
        />
        <p>
          Observe that <InlineCode>implements</InlineCode> forces you to honor
          the entire <InlineCode>Repository&lt;Transaction&gt;</InlineCode>{" "}
          contract at compile time, while{" "}
          <InlineCode>with Auditable</InlineCode> gave you{" "}
          <InlineCode>audit()</InlineCode> and <InlineCode>log</InlineCode> out
          of the box without burning your single{" "}
          <InlineCode>extends</InlineCode> slot.
        </p>
      </>
    </section>
  );
};
export const Subtopic3_05 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Capstone Practice */}
      <>
        <h3>Capstone Practice: JSON-to-Object Ledger System</h3>
        <p>
          <span className="font-semibold text-foreground">
            Project Description:
          </span>{" "}
          Build an in-memory financial ledger engine that ingests raw JSON-like{" "}
          <InlineCode>Map&lt;String, dynamic&gt;</InlineCode> records, routes
          them through a polymorphic factory into typed{" "}
          <InlineCode>Sale</InlineCode> and <InlineCode>Refund</InlineCode>{" "}
          objects, stores them inside an auditable repository adhering to a
          generic contract, and computes the net ledger balance.
        </p>
        <p className="font-semibold text-foreground">Key Success Criteria:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Polymorphic Factory Deserialization:
            </span>{" "}
            Implements{" "}
            <InlineCode>
              Transaction.fromMap(Map&lt;String, dynamic&gt; map)
            </InlineCode>{" "}
            using a Chapter 2 switch expression on{" "}
            <InlineCode>map[&apos;type&apos;]</InlineCode> to return a{" "}
            <InlineCode>Sale</InlineCode> or <InlineCode>Refund</InlineCode>{" "}
            (and throw a <InlineCode>FormatException</InlineCode> for unknown
            types), safely parsing numbers via{" "}
            <InlineCode>(map[&apos;amount&apos;] as num).toDouble()</InlineCode>{" "}
            and optional notes via <InlineCode>as String?</InlineCode>.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Clean Inheritance &amp; Constructor Chaining:
            </span>{" "}
            Models <InlineCode>Transaction</InlineCode> as the base class with{" "}
            <InlineCode>Sale</InlineCode> and <InlineCode>Refund</InlineCode>{" "}
            subclasses using <InlineCode>{"{required this...}"}</InlineCode>{" "}
            named parameters and <InlineCode>super.</InlineCode> parameter
            forwarding.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Contract + Mixin Architecture:
            </span>{" "}
            Defines an abstract class{" "}
            <InlineCode>Repository&lt;T&gt;</InlineCode> contract and implements
            it in <InlineCode>InMemoryRepository</InlineCode> backed by a{" "}
            <InlineCode>Map&lt;String, T&gt;</InlineCode>, while mixing in{" "}
            <InlineCode>Auditable</InlineCode> (
            <InlineCode>with Auditable</InlineCode>) to record every{" "}
            <InlineCode>.add()</InlineCode> operation automatically.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Pipeline Aggregation:
            </span>{" "}
            Uses <InlineCode>.all().map(...).fold(0.0, ...)</InlineCode> from
            Chapter 2 to calculate the total ledger value across stored
            transactions.
          </p>
        </div>
      </>
    </section>
  );
};
