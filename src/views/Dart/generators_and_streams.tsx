import { MermaidDiagram } from "@/components/MermaidDiagram";
import { CodeBlock, InlineCode } from "@/components/ui/CodeDisplay";
import { NumberedList } from "@/components/ui/NumberedList";
import { TableMinimal } from "@/components/ui/tableMinimal";

export const subtopics = [
  "Synchronous generators (sync* & yield)",
  "Futures & async/await",
  "Asynchronous generators & streams (async* & await for)",
  "fleet telemetry project walk through",
  "Capstone: Real-Time Streaming Wallet Ledger",
];

export const summary =
  "5.1: sync*, yield, lazy Iterable. 5.2: Futures, async, await, event loop, Future.delayed. 5.3: async*, yield, Stream, await for. 5.4: capstone WalletLedger, factory deserialization, generic repositories, extensions, currency normalization.";

export const Subtopic5_01 = () => {
  return (
    <section className="flex flex-col gap-2">
      <p>
        Every chapter so far dealt with data that exists right now. Chapter 5
        adds time. Parts 1 to 4 build up one idea in four steps: a generator
        produces values one at a time on demand (Part 1), a{" "}
        <InlineCode>Future</InlineCode> is a single value that arrives later
        (Part 2), a <InlineCode>Stream</InlineCode> is many values arriving over
        time (Part 3), and <InlineCode>await for</InlineCode> consumes it safely
        with back-pressure (Part 4). Part 5 shows how to structure a real
        multi-file Dart project (import/export), connect two terminals in real
        time over TCP sockets, and plug in everything from Chapters 1 to 4.
      </p>

      {/* 1. Synchronous Generators */}
      <>
        <h3>1. Synchronous Generators: sync*, yield, and yield*</h3>
        <p>
          A <b>generator</b> is a function that hands back values one at a time
          instead of building a whole list in RAM. In Dart, mark the function{" "}
          <InlineCode>sync*</InlineCode>, return{" "}
          <InlineCode>Iterable&lt;T&gt;</InlineCode>, and use{" "}
          <InlineCode>yield</InlineCode> to emit each value. The function pauses
          at each <InlineCode>yield</InlineCode> and resumes only when the
          consumer asks for the next item—the same concept as Python&apos;s{" "}
          <InlineCode>yield</InlineCode> or C#&apos;s{" "}
          <InlineCode>yield return</InlineCode>.
        </p>

        <h4>How yield* Works (Delegating &amp; Flattening)</h4>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>yield item</InlineCode> emits one single value of type{" "}
            <InlineCode>T</InlineCode>.
          </p>
          <p className="bulletpoint">
            <InlineCode>yield* subIterable</InlineCode> delegates control to
            another <InlineCode>Iterable&lt;T&gt;</InlineCode>, unpacking and
            emitting all of its items one by one. This makes recursive
            generators (such as walking trees or nested folders) clean and
            memory-efficient.
          </p>
        </div>
        <CodeBlock
          language="dart"
          filename="recursive_generator.dart"
          code={`
Iterable<int> countDown(int n) sync* {
  if (n <= 0) return;
  yield n;                 // Emits one number
  yield* countDown(n - 1); // Delegates the rest recursively and flattens into one Iterable<int>
}
      `}
        />
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="sync_generators.dart"
          code={`
Iterable<int> countTo(int n) sync* {
  for (var i = 1; i <= n; i++) {
    print('producing \$i');
    yield i;
  }
}

Iterable<int> naturals() sync* {      // infinite, and that's fine
  var i = 0;
  while (true) yield i++;
}

void main() {
  final it = countTo(3);
  print('created');                    // prints first: NOTHING has run yet

  for (final x in it) {
    print('got \$x');
  }
  // created
  // producing 1 / got 1 / producing 2 / got 2 / producing 3 / got 3
  // <- producing and consuming interleave

  print(naturals().take(5).toList());  // [0, 1, 2, 3, 4]  <- infinite source, finite result
  print(countDown(3).toList());        // [3, 2, 1]        <- flattened via yield*
  // print(naturals().toList());       // uncomment: never finishes, memory fills up
}
      `}
        />
        <p>
          Observe that the &quot;producing&quot; lines only appear as the loop
          pulls items. This is the exact same laziness you saw with{" "}
          <InlineCode>.map()</InlineCode> in Chapter 2, and now you can author
          it yourself.
        </p>
      </>
    </section>
  );
};
export const Subtopic5_02 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 2. Futures */}
      <>
        <h3>2. Futures, async/await, and the Single-Threaded Event Loop</h3>
        <p>
          A <InlineCode>Future&lt;T&gt;</InlineCode> is a placeholder for a
          value of type <InlineCode>T</InlineCode> that will be ready later (a
          network reply, a file read, a timer, a socket message). An{" "}
          <InlineCode>async</InlineCode> function always returns a{" "}
          <InlineCode>Future</InlineCode>, and <InlineCode>await</InlineCode>{" "}
          pauses that function until the <InlineCode>Future</InlineCode>{" "}
          completes.
        </p>

        <h4>How Dart&apos;s Single-Threaded Event Loop Works Under the Hood</h4>
        <p>
          Dart executes your code on one single thread (an Isolate)—meaning two
          lines of your Dart code never run at the exact same nanosecond. So how
          does <InlineCode>await</InlineCode> wait 2 seconds without freezing
          your app? Dart manages two queues inside an infinite loop:
        </p>
        <MermaidDiagram
          chart={`
    flowchart TD
      subgraph EventLoop ["<b>DART EVENT LOOP</b>"]
        direction TB
        Step1["<b>1. Run all synchronous main() code</b>"]
        Step2{"<b>2. Is Microtask Queue empty?</b>"}
        RunMicro["Run 1 microtask"]
        Step3["<b>3. Pop 1 item from Event Queue</b><br/>(Timer, Socket packet, I/O, Tap)"]

        Step1 --> Step2
        Step2 -- "No" --> RunMicro
        RunMicro --> Step2
        Step2 -- "Yes" --> Step3
        Step3 -- "Loop back to #2" --> Step2
      end
  `}
        />

        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Microtask Queue (High Priority / VIP):
            </span>{" "}
            Tiny internal tasks scheduled via{" "}
            <InlineCode>Future.microtask(...)</InlineCode> or already-completed{" "}
            <InlineCode>Future.value(...)</InlineCode>. Dart drains every
            microtask before touching the next regular event.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Event Queue (Normal Priority):
            </span>{" "}
            External I/O events—<InlineCode>Future.delayed</InlineCode> timers,
            incoming socket packets, file reads, and screen taps.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Why await doesn&apos;t freeze the thread:
            </span>{" "}
            When Dart hits <InlineCode>await slow(1)</InlineCode>, it suspends
            that function, registers a continuation callback on the Event Queue,
            and immediately hands control back to the Event Loop so other
            timers, sockets, or UI frames keep running.
          </p>
        </div>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="futures.dart"
          code={`
Future<int> slow(int n) async {
  await Future.delayed(const Duration(seconds: 1));   // simulated latency
  return n;
}

void main() async {
  print('start');
  final f = slow(1);          // starts the work, does NOT wait
  print('after call');        // prints immediately, before the result
  print(await f);             // 1  (now we wait)

  final sw = Stopwatch()..start();
  await slow(1);
  await slow(2);
  print('sequential: \${sw.elapsed.inSeconds}s');     // 2s

  sw.reset();
  final r = await Future.wait([slow(1), slow(2)]);
  print('parallel: \${sw.elapsed.inSeconds}s \$r');    // 1s [1, 2]
}
      `}
        />
        <p>
          Observe that the two waits overlap in the parallel version (
          <InlineCode>Future.wait</InlineCode>), with zero extra threads. Errors
          work just like synchronous code: a failed{" "}
          <InlineCode>Future</InlineCode> throws at the{" "}
          <InlineCode>await</InlineCode>, so you handle it with a normal{" "}
          <InlineCode>try/catch</InlineCode>.
        </p>
        <p>
          <span className="font-semibold text-foreground">Gotcha: </span>If you
          call an <InlineCode>async</InlineCode> function and forget{" "}
          <InlineCode>await</InlineCode>, you get a{" "}
          <InlineCode>Future</InlineCode> object instead of the value, and any
          error it throws escapes your <InlineCode>try/catch</InlineCode>.
        </p>
      </>
    </section>
  );
};
export const Subtopic5_03 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 3. Asynchronous Generators */}
      <>
        <h3>3. Asynchronous Generators (async*) &amp; Stream Types</h3>
        <p>
          Combine Parts 1 and 2: an <InlineCode>async*</InlineCode> function
          returns a <InlineCode>Stream&lt;T&gt;</InlineCode>, a sequence of
          values that arrive over time. Think of a{" "}
          <InlineCode>Stream</InlineCode> as an{" "}
          <InlineCode>Iterable</InlineCode> stretched out across time—inside it
          you can both <InlineCode>await</InlineCode> external delays and{" "}
          <InlineCode>yield</InlineCode> values (or{" "}
          <InlineCode>yield*</InlineCode> another stream). Like{" "}
          <InlineCode>sync*</InlineCode>, a stream generator is lazy: its body
          doesn&apos;t execute until someone listens.
        </p>

        <h4>Single-Subscription vs. Broadcast Streams</h4>
        <TableMinimal
          heads={[
            "Feature",
            "Single-Subscription Stream (Default async*)",
            "Broadcast Stream (.asBroadcastStream() / StreamController.broadcast())",
          ]}
          data={[
            {
              Feature: "Mental Model",
              "Single-Subscription Stream (Default async*)":
                "Downloading a file or playing a private audio message: starts from the beginning only when you listen, and delivers every single item in order.",
              "Broadcast Stream (.asBroadcastStream() / StreamController.broadcast())":
                "Live FM radio station: broadcasts whether 0, 1, or 50 listeners are tuned in. Tuning in late means missing earlier events.",
            },
            {
              Feature: "Why listening twice crashes",
              "Single-Subscription Stream (Default async*)":
                "If a second listener attached midway, Dart wouldn't know whether to replay missed items from the start or skip them—so it throws StateError: Stream has already been listened to.",
              "Broadcast Stream (.asBroadcastStream() / StreamController.broadcast())":
                "Built specifically for multiple independent listeners (e.g., a terminal dashboard + a file logger + an alert monitor all watching one live sensor stream).",
            },
            {
              Feature: "When to use",
              "Single-Subscription Stream (Default async*)":
                "File reads, HTTP response bodies, TCP socket inputs, or a dedicated 1-to-1 processing pipeline.",
              "Broadcast Stream (.asBroadcastStream() / StreamController.broadcast())":
                "Live UI state updates, multi-client chat rooms, hardware sensor feeds, or event buses.",
            },
          ]}
        />
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="streams.dart"
          code={`
Stream<int> ticker(int n) async* {
  for (var i = 1; i <= n; i++) {
    await Future.delayed(const Duration(milliseconds: 500));
    yield i;
  }
}

void main() async {
  final s = ticker(3);
  print('stream created');                 // nothing is running yet

  s.listen((v) => print('tick \$v'));       // NOW it starts: tick 1, 2, 3 at 0.5s intervals
  // s.listen((v) => print('again \$v'));   // uncomment: StateError, already listened to

  // Streams have Chapter 2's functional tools too:
  // await ticker(5).where((v) => v.isEven).map((v) => v * 10).toList();   // [20, 40]
}
      `}
        />
        <p>
          Observe that the ticks appear spaced out in time, and that{" "}
          <InlineCode>.where()</InlineCode> and <InlineCode>.map()</InlineCode>{" "}
          work on streams just like they did on lists in Chapter 2.
        </p>
      </>

      {/* 4. Consuming Streams */}
      <>
        <h3>4. Consuming Streams with await for &amp; Back-Pressure</h3>
        <p>
          <InlineCode>await for</InlineCode> is an asynchronous loop over a
          stream. It waits for one item, runs the loop body, and only then waits
          for the next item. It only works inside an{" "}
          <InlineCode>async</InlineCode> function.
        </p>

        <h4>What &quot;Back-Pressure&quot; Means (await for vs. .listen())</h4>
        <p>
          <b>Back-pressure</b> is a slow consumer&apos;s ability to tell a fast
          producer: &quot;Pause producing new items until I finish processing
          the one you just gave me.&quot;
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              With .listen() (No automatic back-pressure):
            </span>{" "}
            If a sensor emits 1,000 packets per second and your callback takes
            100ms per packet, callbacks pile up in memory simultaneously.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              With await for (Automatic back-pressure):
            </span>{" "}
            While your <InlineCode>await for</InlineCode> loop body is busy
            (e.g., writing to disk or awaiting a reply), the{" "}
            <InlineCode>async*</InlineCode> producer stays frozen at its{" "}
            <InlineCode>yield</InlineCode> line and will not generate the next
            item until your loop body finishes.
          </p>
        </div>
        <p className="font-semibold text-foreground">
          Three guarantees of await for:
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Sequential: </span>
            The next item is never processed until the current body finishes
            (eliminating race conditions on shared state).
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Back-pressure for free:
            </span>{" "}
            Fast producers naturally pause for slow consumers.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Automatic cleanup:
            </span>{" "}
            Executing <InlineCode>break</InlineCode> cancels the stream
            subscription, triggering the generator&apos;s{" "}
            <InlineCode>finally</InlineCode> block immediately.
          </p>
        </div>
        <p>Do this and observe this:</p>
        <CodeBlock
          language="dart"
          filename="await_for.dart"
          code={`
Stream<int> numbers() async* {
  try {
    for (var i = 1; i <= 5; i++) {
      await Future.delayed(const Duration(milliseconds: 200));
      yield i;
    }
  } finally {
    print('stream cleaned up');
  }
}

void main() async {
  await for (final n in numbers()) {
    print('got \$n');
    if (n == 2) break;          // stop early
  }
  print('done');
  // got 1
  // got 2
  // stream cleaned up   <- the producer was told to stop, and it ran its finally
  // done
}
      `}
        />
        <p>
          Observe that items 3 to 5 were never produced. If a stream emits an
          error, it throws at the <InlineCode>await for</InlineCode> line, so a{" "}
          <InlineCode>try/catch</InlineCode> inside the loop keeps the stream
          alive across bad events while a <InlineCode>try/catch</InlineCode>{" "}
          outside aborts on the first failure.
        </p>
      </>
    </section>
  );
};
export const Subtopic5_04 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* 5. Multi-File Architecture */}
      <>
        <h4>
          5.1 Organizing a Multi-File Pure Dart Project (import, export &amp;
          Barrel Files)
        </h4>
        <p>
          In real projects, you separate reusable domain logic (
          <InlineCode>lib/</InlineCode>) from runnable terminal entry points (
          <InlineCode>bin/</InlineCode>):
        </p>
        <CodeBlock
          language="text"
          filename="Project Structure"
          code={`
fleet_telemetry/
├── pubspec.yaml                  <-- Declares package name: \`name: fleet_telemetry\`
├── bin/
│   ├── control_hub.dart          <-- Terminal 1: Listens for trucks & sends live speed alerts
│   └── truck_node.dart           <-- Terminal 2: Streams telemetry & receives live replies
└── lib/
    ├── fleet_telemetry.dart      <-- Barrel file: single clean \`export\` entry point
    └── src/                      <-- Internal implementation files
        ├── models/
        │   ├── speed_unit.dart   <-- Chapter 2: Enhanced enum + hub-and-spoke conversion
        │   └── telemetry.dart    <-- Chapter 3 & 4: Telemetry, factory fromMap, Speed operators
        ├── utils/
        │   └── parsing.dart      <-- Chapter 1 & 4: SafeParse extension & null helpers
        └── repository/
            └── telemetry_repo.dart <-- Chapter 3: Repository<T> contract + Auditable mixin
      `}
        />

        <p className="font-semibold text-foreground">
          Safe import &amp; export Rules
        </p>
        <NumberedList>
          <p>
            <span className="font-semibold text-foreground">
              Package imports (package:...):
            </span>{" "}
            Always import using{" "}
            <InlineCode>
              package:fleet_telemetry/fleet_telemetry.dart
            </InlineCode>{" "}
            from <InlineCode>bin/</InlineCode> so relative paths (
            <InlineCode>../lib/...</InlineCode>) never break when reorganizing
            files.
          </p>
          <p>
            <span className="font-semibold text-foreground">
              Barrel files (export):
            </span>{" "}
            Instead of repeating 5 imports in every executable file,{" "}
            <InlineCode>lib/fleet_telemetry.dart</InlineCode> uses{" "}
            <InlineCode>
              export &apos;src/models/telemetry.dart&apos;;
            </InlineCode>{" "}
            to re-export your public classes through one single file.
          </p>
          <p>
            <span className="font-semibold text-foreground">
              Preventing name collisions:
            </span>
          </p>
        </NumberedList>
        <div className="ml-6 flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>
              import &apos;package:foo/foo.dart&apos; show Speed;
            </InlineCode>{" "}
            (imports only <InlineCode>Speed</InlineCode>)
          </p>
          <p className="bulletpoint">
            <InlineCode>
              import &apos;package:foo/foo.dart&apos; hide InternalHelper;
            </InlineCode>{" "}
            (imports everything except <InlineCode>InternalHelper</InlineCode>)
          </p>
          <p className="bulletpoint">
            <InlineCode>
              import &apos;package:foo/foo.dart&apos; as telemetry;
            </InlineCode>{" "}
            (namespaces everything under{" "}
            <InlineCode>telemetry.Speed</InlineCode>)
          </p>
        </div>

        <h4>5.2 How Two Terminals Talk Live in Real Time (dart:io Sockets)</h4>
        <p>
          In Dart, <InlineCode>ServerSocket</InlineCode> and{" "}
          <InlineCode>Socket</InlineCode> (from <InlineCode>dart:io</InlineCode>
          ) are built directly on top of <InlineCode>Stream</InlineCode>s:
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Terminal 1 (bin/control_hub.dart):
            </span>{" "}
            binds a <InlineCode>ServerSocket</InlineCode> on{" "}
            <InlineCode>127.0.0.1:4040</InlineCode> and uses{" "}
            <InlineCode>await for</InlineCode> over incoming client lines.
            Whenever a truck exceeds the{" "}
            <InlineCode>const speedLimitKmh = 80.0</InlineCode>, Terminal 1
            writes an instant command back over the socket (
            <InlineCode>client.writeln(...)</InlineCode>).
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Terminal 2 (bin/truck_node.dart):
            </span>{" "}
            connects via{" "}
            <InlineCode>Socket.connect(&apos;127.0.0.1&apos;, 4040)</InlineCode>
            , streams live sensor readings using an{" "}
            <InlineCode>async*</InlineCode> generator (and lets you type manual
            overrides via <InlineCode>stdin</InlineCode>), while listening to
            Terminal 1&apos;s instant replies in real time!
          </p>
        </div>
        <MermaidDiagram
          chart={`
    sequenceDiagram
      autonumber
      participant Hub as TERMINAL 1<br/>bin/control_hub.dart
      participant Truck as TERMINAL 2<br/>bin/truck_node.dart

      Note over Hub: ServerSocket.bind('127.0.0.1', 4040)
      Truck->>Hub: Socket.connect('127.0.0.1', 4040)

      loop Live Telemetry Stream
        Truck->>Hub: JSON telemetry (async* telemetryStream -> writeln)
        Note over Hub: await for (line in clientLines)<br/>Check if speed > 80 km/h
        Hub-->>Truck: ALERT: 'CMD: REDUCE SPEED' (client.writeln)
        Note over Truck: socket.listen() prints instant reply!
      end

      Truck->>Hub: Live driver note (stdin.listen)
  `}
        />
      </>
      <p>
        Let&apos;s build <InlineCode>fleet_telemetry</InlineCode> from scratch
        in logical layers, matching Chapters 1 through 5.
      </p>

      {/* Step 0 */}
      <>
        <h3>Step 0: Create the Project Blueprint (pubspec.yaml)</h3>
        <p>
          Before writing Dart files across folders, Dart needs a{" "}
          <InlineCode>pubspec.yaml</InlineCode> file at the root so it knows
          your package name (<InlineCode>fleet_telemetry</InlineCode>) and
          allows clean <InlineCode>package:fleet_telemetry/...</InlineCode>{" "}
          imports from anywhere.
        </p>
        <p className="font-semibold text-foreground">
          Folder Layout We Are Building:
        </p>
        <CodeBlock
          language="text"
          filename="Project Structure"
          code={`
fleet_telemetry/
├── pubspec.yaml                  <-- Step 0: Package identity & SDK rules
├── lib/
│   ├── fleet_telemetry.dart      <-- Step 4: Barrel file (re-exports public API)
│   └── src/
│       ├── speed.dart            <-- Step 1: Ch 1, 2 & 4 (Enum, Speed math, Extensions)
│       ├── telemetry.dart        <-- Step 2: Ch 3 (Models, Inheritance, Factory fromMap)
│       └── repository.dart       <-- Step 3: Ch 3 (Generic Repository + Auditable mixin)
└── bin/
    ├── control_hub.dart          <-- Step 5: Terminal 1 (ServerSocket + await for)
    └── truck_node.dart           <-- Step 6: Terminal 2 (async* Stream + Socket + stdin)
      `}
        />
        <p>
          Create a folder named <InlineCode>fleet_telemetry</InlineCode>, and
          create <InlineCode>pubspec.yaml</InlineCode>:
        </p>
        <CodeBlock
          language="yaml"
          filename="pubspec.yaml"
          code={`
name: fleet_telemetry
description: Two-terminal real-time fleet telemetry monitor covering Dart Chapters 1-5.
environment:
  sdk: ^3.0.0
      `}
        />
        <p>
          (Run <InlineCode>dart pub get</InlineCode> once in the root folder so
          Dart registers the <InlineCode>fleet_telemetry</InlineCode> package
          name.)
        </p>
      </>

      {/* Step 1 */}
      <>
        <h3>
          Step 1: Units, Safe Parsing &amp; Domain Math (lib/src/speed.dart)
        </h3>
        <p>
          <span className="font-semibold text-foreground">
            Why this file exists first:
          </span>{" "}
          Everything in our system revolves around measuring vehicle speed
          safely across different units (km/h, mph, knots). Putting units,
          parsing extensions, and the immutable <InlineCode>Speed</InlineCode>{" "}
          value class in one dedicated file keeps our domain math pure and
          reusable.
        </p>
        <p className="font-semibold text-foreground">Concepts used:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">
              Ch 1 &amp; 4:{" "}
            </span>
            <InlineCode>SafeParse</InlineCode> extension on{" "}
            <InlineCode>String</InlineCode> (
            <InlineCode>toReading()</InlineCode>),{" "}
            <InlineCode>const</InlineCode> rules, <InlineCode>??</InlineCode>{" "}
            fallback.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Ch 2: </span>
            Enhanced enum <InlineCode>SpeedUnit</InlineCode> with hub-and-spoke
            conversion to km/h and exhaustive switch expressions.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Ch 4: </span>
            <InlineCode>Speed</InlineCode> class with{" "}
            <InlineCode>operator +</InlineCode>,{" "}
            <InlineCode>operator &gt;</InlineCode>, <InlineCode>==</InlineCode>/
            <InlineCode>hashCode</InlineCode>, custom{" "}
            <InlineCode>toString()</InlineCode>, and extension on{" "}
            <InlineCode>num</InlineCode> (<InlineCode>65.mph</InlineCode>,{" "}
            <InlineCode>90.kmh</InlineCode>).
          </p>
        </div>
        <p>
          Create <InlineCode>lib/src/speed.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="lib/src/speed.dart"
          code={`
// Chapter 2: Enhanced enum with hub-and-spoke conversion rates to km/h
enum SpeedUnit {
  kmh(1.0),
  mph(1.60934),
  knots(1.852);

  final double toKmhFactor;
  const SpeedUnit(this.toKmhFactor);

  String get label => switch (this) {
        SpeedUnit.kmh => 'km/h',
        SpeedUnit.mph => 'mph',
        SpeedUnit.knots => 'kn',
      };
}

// Chapter 1 & 4: Safe parsing extension for messy sensor strings like " 85.5 "
extension SafeParse on String {
  double? toReading() => num.tryParse(replaceAll(',', '').trim())?.toDouble();
}

// Chapter 4: Expressive shortcuts so we can write 65.mph or 90.kmh
extension SpeedShortcuts on num {
  Speed get kmh => Speed(toDouble(), SpeedUnit.kmh);
  Speed get mph => Speed(toDouble(), SpeedUnit.mph);
  Speed get knots => Speed(toDouble(), SpeedUnit.knots);
}

// Chapter 1, 3 & 4: Immutable domain value object with operator overloading
class Speed {
  final double value;
  final SpeedUnit unit;

  const Speed(this.value, this.unit);

  // Hub-and-spoke conversion: source -> km/h -> target
  Speed convertTo(SpeedUnit target) {
    final inKmh = value * unit.toKmhFactor;
    return Speed(inKmh / target.toKmhFactor, target);
  }

  // Overloaded + keeps the left-hand side unit
  Speed operator +(Speed other) =>
      Speed(value + other.convertTo(unit).value, unit);

  // Overloaded > compares normalized km/h values
  bool operator >(Speed other) =>
      (value * unit.toKmhFactor) > (other.value * other.unit.toKmhFactor);

  @override
  bool operator ==(Object other) =>
      other is Speed && other.value == value && other.unit == unit;

  @override
  int get hashCode => Object.hash(value, unit);

  @override
  String toString() => '\${value.toStringAsFixed(1)} \${unit.label}';
}
      `}
        />
      </>

      {/* Step 2 */}
      <>
        <h3>
          Step 2: Models, Inheritance &amp; Factory Deserialization
          (lib/src/telemetry.dart)
        </h3>
        <p>
          <span className="font-semibold text-foreground">
            Why this file exists:
          </span>{" "}
          Raw data arrives over the network as untyped JSON maps (
          <InlineCode>Map&lt;String, dynamic&gt;</InlineCode>). This file
          defines our class hierarchy (<InlineCode>Telemetry</InlineCode> base
          class, <InlineCode>SpeedPacket</InlineCode> and{" "}
          <InlineCode>EnginePacket</InlineCode> subclasses) and centralizes
          validation inside <InlineCode>Telemetry.fromMap</InlineCode> so
          malformed packets throw a <InlineCode>FormatException</InlineCode> at
          the boundary before ever touching our server state.
        </p>
        <p className="font-semibold text-foreground">Concepts used:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Ch 1: </span>
            Nullable <InlineCode>String? driverNote</InlineCode>.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Ch 2: </span>
            <InlineCode>switch</InlineCode> expression routing{" "}
            <InlineCode>map[&apos;kind&apos;]</InlineCode> to the right
            subclass.
          </p>
          <p className="bulletpoint">
            <span className="font-semibold text-foreground">Ch 3: </span>
            Generative constructors, <InlineCode>super.</InlineCode> parameter
            forwarding, <InlineCode>@override</InlineCode>, and{" "}
            <InlineCode>factory Telemetry.fromMap</InlineCode>.
          </p>
        </div>
        <p>
          Create <InlineCode>lib/src/telemetry.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="lib/src/telemetry.dart"
          code={`
import 'speed.dart';

abstract class Telemetry {
  final String truckId;
  final DateTime timestamp;
  final String? driverNote; // Chapter 1: Nullable optional field

  const Telemetry({
    required this.truckId,
    required this.timestamp,
    this.driverNote,
  });

  String summary();

  // Chapter 3: Polymorphic factory constructor validating raw JSON maps at the boundary
  factory Telemetry.fromMap(Map<String, dynamic> map) {
    final id = map['truckId'];
    if (id is! String || id.trim().isEmpty) {
      throw const FormatException('Missing or invalid truckId');
    }

    final note = map['driverNote'] as String?;
    final kind = map['kind'] as String? ?? 'speed';

    return switch (kind) {
      'speed' => SpeedPacket.fromMap(id, map, note),
      'engine' => EnginePacket.fromMap(id, map, note),
      _ => throw FormatException('Unknown telemetry kind: \$kind'),
    };
  }
}

class SpeedPacket extends Telemetry {
  final Speed speed;

  const SpeedPacket({
    required super.truckId, // Chapter 3: super-parameter forwarding
    required super.timestamp,
    required this.speed,
    super.driverNote,
  });

  factory SpeedPacket.fromMap(
    String truckId,
    Map<String, dynamic> map,
    String? note,
  ) {
    // Chapter 2 & 4: Pattern match num vs messy String
    final rawVal = switch (map['speed']) {
      num n => n.toDouble(),
      String s => s.toReading(),
      _ => null,
    };

    if (rawVal == null || rawVal < 0) {
      throw FormatException('Invalid speed value: \${map['speed']}');
    }

    final unitName = (map['unit'] as String? ?? 'kmh').toLowerCase();
    final unit = SpeedUnit.values.byName(unitName); // Throws ArgumentError if invalid unit

    return SpeedPacket(
      truckId: truckId,
      timestamp: DateTime.now(),
      speed: Speed(rawVal, unit),
      driverNote: note,
    );
  }

  @override
  String summary() {
    final kmh = speed.convertTo(SpeedUnit.kmh);
    final noteSuffix = driverNote != null ? ' [Note: \$driverNote]' : '';
    return '[\$truckId] Speed: \$speed (\$kmh)\$noteSuffix';
  }
}

class EnginePacket extends Telemetry {
  final int rpm;

  const EnginePacket({
    required super.truckId,
    required super.timestamp,
    required this.rpm,
    super.driverNote,
  });

  factory EnginePacket.fromMap(
    String truckId,
    Map<String, dynamic> map,
    String? note,
  ) {
    final rpm = (map['rpm'] as num?)?.toInt();
    if (rpm == null || rpm < 0) {
      throw FormatException('Invalid RPM: \${map['rpm']}');
    }
    return EnginePacket(
      truckId: truckId,
      timestamp: DateTime.now(),
      rpm: rpm,
      driverNote: note,
    );
  }

  @override
  String summary() => '[\$truckId] Engine RPM: \$rpm';
}
      `}
        />
      </>

      {/* Step 3 */}
      <>
        <h3>Step 3: Contracts &amp; Mixins (lib/src/repository.dart)</h3>
        <p>
          <span className="font-semibold text-foreground">
            Why this file exists:
          </span>{" "}
          Instead of coupling our server directly to a raw{" "}
          <InlineCode>List</InlineCode>, we define a generic{" "}
          <InlineCode>Repository&lt;T&gt;</InlineCode> contract (
          <InlineCode>implements</InlineCode>) and a reusable{" "}
          <InlineCode>Auditable</InlineCode> capability (
          <InlineCode>with</InlineCode>). That way, every time telemetry is
          saved, an audit log records it automatically.
        </p>
        <p>
          Create <InlineCode>lib/src/repository.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="lib/src/repository.dart"
          code={`
import 'telemetry.dart';

// Chapter 3: Mixin for cross-cutting audit logging
mixin Auditable {
  final List<String> auditLog = [];
  void recordAudit(String event) {
    final time = DateTime.now().toIso8601String().substring(11, 19);
    auditLog.add('[\$time] \$event');
  }
}

// Chapter 3: Generic interface contract
abstract class Repository<T> {
  void save(T item);
  List<T> all();
}

// Chapter 3: Implements contract + mixes in Auditable
class TelemetryRepository with Auditable implements Repository<Telemetry> {
  final List<Telemetry> _records = [];

  @override
  void save(Telemetry item) {
    _records.add(item);
    recordAudit('Saved \${item.runtimeType} from \${item.truckId}');
  }

  @override
  List<Telemetry> all() => List.unmodifiable(_records);
}
      `}
        />
      </>

      {/* Step 4 */}
      <>
        <h3>Step 4: The Public Barrel File (lib/fleet_telemetry.dart)</h3>
        <p>
          <span className="font-semibold text-foreground">
            Why this file exists:
          </span>{" "}
          This is the &quot;front door&quot; of your library. By using{" "}
          <InlineCode>export</InlineCode>, both Terminal 1 and Terminal 2 only
          need one single line (
          <InlineCode>
            import &apos;package:fleet_telemetry/fleet_telemetry.dart&apos;;
          </InlineCode>
          ) to access all models, extensions, enums, and repositories safely.
        </p>
        <p>
          Create <InlineCode>lib/fleet_telemetry.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="lib/fleet_telemetry.dart"
          code={`
library fleet_telemetry;

export 'src/speed.dart';
export 'src/telemetry.dart';
export 'src/repository.dart';
      `}
        />
      </>

      {/* Step 5 */}
      <>
        <h3>
          Step 5: Terminal 1 — The Central Control Hub (bin/control_hub.dart)
        </h3>
        <p>
          <span className="font-semibold text-foreground">
            Why this file exists:
          </span>{" "}
          This is our server entry point. It opens a TCP{" "}
          <InlineCode>ServerSocket</InlineCode> on port 4040, listens to
          incoming truck connections as a <InlineCode>Stream</InlineCode>, uses{" "}
          <InlineCode>await for</InlineCode> (with automatic back-pressure!) to
          parse each JSON line safely, tracks unique trucks in a{" "}
          <InlineCode>Set&lt;String&gt;</InlineCode>, checks against{" "}
          <InlineCode>const speedLimit = 80.kmh</InlineCode>, and immediately
          sends commands back down the socket to Terminal 2.
        </p>
        <p>
          Create <InlineCode>bin/control_hub.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="bin/control_hub.dart"
          code={`
import 'dart:convert';
import 'dart:io';
import 'package:fleet_telemetry/fleet_telemetry.dart';

// Chapter 1: Compile-time constant business rule
const Speed maxSpeedLimit = Speed(80.0, SpeedUnit.kmh);

// Chapter 2: Exhaustive switch expression for alert severity
enum Severity { normal, warning, critical }

Severity classifySpeed(Speed current) {
  final kmh = current.convertTo(SpeedUnit.kmh).value;
  return switch (kmh) {
    <= 80.0 => Severity.normal,
    <= 100.0 => Severity.warning,
    _ => Severity.critical,
  };
}

Future<void> main() async {
  final repo = TelemetryRepository();
  final activeTrucks = <String>{}; // Chapter 2: Set<String> for O(1) unique truck tracking

  // Chapter 5: Bind TCP ServerSocket on localhost port 4040
  final server = await ServerSocket.bind(InternetAddress.loopbackIPv4, 4040);
  print('=== CONTROL HUB ONLINE (127.0.0.1:4040) ===');
  print('Speed Limit: \$maxSpeedLimit | Waiting for trucks...\\n');

  // Listen for incoming truck connections
  await for (final Socket client in server) {
    print('>> Truck connected from \${client.remoteAddress.address}:\${client.remotePort}');
    client.writeln('HUB: Connected. Speed limit is \$maxSpeedLimit.');

    // Transform raw byte stream into UTF-8 lines
    final lines = utf8.decoder.bind(client).transform(const LineSplitter());

    // Chapter 5: Sequential \`await for\` loop with built-in back-pressure
    await for (final line in lines) {
      try {
        final rawMap = jsonDecode(line) as Map<String, dynamic>;
        final packet = Telemetry.fromMap(rawMap); // Chapter 3: Boundary validation

        repo.save(packet);
        activeTrucks.add(packet.truckId);
        print(packet.summary());

        if (packet is SpeedPacket) {
          final severity = classifySpeed(packet.speed);
          if (severity != Severity.normal) {
            final alertMsg =
                'ALERT [\${severity.name.toUpperCase()}]: \${packet.truckId} recorded \${packet.speed.convertTo(SpeedUnit.kmh)} (Limit: \$maxSpeedLimit)!';
            print('   -> Sending back to truck: \$alertMsg');
            client.writeln(alertMsg); // Instant reply back to Terminal 2!
          }
        }
      } catch (e) {
        print('   [REJECTED PACKET] Bad payload "\$line" -> \$e');
        client.writeln('HUB ERROR: Rejected malformed telemetry (\$e)');
      }
    }

    print('<< Truck disconnected. Active fleet seen: \$activeTrucks');
    print('   Total valid packets archived: \${repo.all().length}\\n');
  }
}
      `}
        />
      </>

      {/* Step 6 */}
      <>
        <h3>Step 6: Terminal 2 — The Live Truck Node (bin/truck_node.dart)</h3>
        <p>
          <span className="font-semibold text-foreground">
            Why this file exists:
          </span>{" "}
          This is our vehicle simulator. It connects to{" "}
          <InlineCode>127.0.0.1:4040</InlineCode>, uses an{" "}
          <InlineCode>async*</InlineCode> generator to emit timed telemetry
          packets (including mixed units like mph and knots, messy string
          speeds, and one intentionally bad packet to prove boundary safety),
          listens for live alerts from Terminal 1, AND lets you type custom
          messages directly into Terminal 2 to send live!
        </p>
        <p>
          Create <InlineCode>bin/truck_node.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="bin/truck_node.dart"
          code={`
import 'dart:async';
import 'dart:convert';
import 'dart:io';

// Chapter 5: Asynchronous generator yielding sensor readings over time
Stream<Map<String, dynamic>> automatedSensorFeed(String truckId) async* {
  final readings = <Map<String, dynamic>>[
    {'truckId': truckId, 'kind': 'speed', 'speed': 65, 'unit': 'kmh'},
    {'truckId': truckId, 'kind': 'speed', 'speed': '58.5', 'unit': 'mph', 'driverNote': 'Highway overtake'},
    {'truckId': truckId, 'kind': 'engine', 'rpm': 2400},
    {'truckId': truckId, 'kind': 'speed', 'speed': 'not_a_number', 'unit': 'kmh'}, // Bad packet!
    {'truckId': truckId, 'kind': 'speed', 'speed': 60, 'unit': 'knots', 'driverNote': 'Downhill slope'},
  ];

  for (final packet in readings) {
    await Future.delayed(const Duration(seconds: 2));
    yield packet;
  }
}

Future<void> main(List<String> args) async {
  final truckId = args.isNotEmpty ? args[0] : 'TRUCK-RW-01';

  print('Connecting \$truckId to Control Hub...');
  final socket = await Socket.connect(InternetAddress.loopbackIPv4, 4040);
  print('Connected! Streaming automated telemetry every 2s.');
  print('TIP: Type a speed (e.g. "115") and press Enter anytime to send live!\\n');

  // 1. Listen for instant replies coming back from Terminal 1 (Control Hub)
  utf8.decoder.bind(socket).transform(const LineSplitter()).listen(
    (reply) => print('\\n<<< [FROM HUB] \$reply\\n'),
    onDone: () {
      print('Hub closed connection.');
      exit(0);
    },
  );

  // 2. Listen to your keyboard (stdin) in Terminal 2 for live interactive testing
  utf8.decoder.bind(stdin).transform(const LineSplitter()).listen((input) {
    final trimmed = input.trim();
    if (trimmed == 'quit') {
      socket.close();
      exit(0);
    }
    final livePacket = {
      'truckId': truckId,
      'kind': 'speed',
      'speed': trimmed,
      'unit': 'kmh',
      'driverNote': 'Manual live input',
    };
    socket.writeln(jsonEncode(livePacket));
  });

  // 3. Consume our async* sensor stream and push JSON lines to Terminal 1
  await for (final packet in automatedSensorFeed(truckId)) {
    final encoded = jsonEncode(packet);
    print('>>> Sending: \$encoded');
    socket.writeln(encoded);
  }

  print('\\nAutomated route finished. Type a speed to test live, or "quit" to exit.');
}
      `}
        />
      </>

      {/* Step 7 */}
      <>
        <h3>Step 7: Run Both Terminals &amp; What to Expect</h3>
        <p>
          1. Open <b>Terminal 1</b> inside{" "}
          <InlineCode>fleet_telemetry/</InlineCode> and start the Control Hub:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal 1"
          code={`dart run bin/control_hub.dart`}
        />
        <p>Expected output:</p>
        <CodeBlock
          language="text"
          filename="Terminal 1 Output"
          code={`
=== CONTROL HUB ONLINE (127.0.0.1:4040) ===
Speed Limit: 80.0 km/h | Waiting for trucks...
      `}
        />
        <p>
          2. Open <b>Terminal 2</b> inside{" "}
          <InlineCode>fleet_telemetry/</InlineCode> and launch the Truck Node:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal 2"
          code={`dart run bin/truck_node.dart TRUCK-KGL-07`}
        />
        <p className="font-semibold text-foreground">Expected behavior:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            Every 2 seconds, Terminal 2 prints{" "}
            <InlineCode>&gt;&gt;&gt; Sending: ...</InlineCode>.
          </p>
          <p className="bulletpoint">
            Terminal 1 immediately prints the normalized reading (
            <InlineCode>58.5 mph (94.1 km/h)</InlineCode>), detects that{" "}
            <InlineCode>94.1 km/h &gt; 80.0 km/h</InlineCode>, and fires back{" "}
            <InlineCode>ALERT [WARNING]</InlineCode>—which instantly pops up in
            Terminal 2 as{" "}
            <InlineCode>&lt;&lt;&lt; [FROM HUB] ALERT [WARNING]...</InlineCode>.
          </p>
          <p className="bulletpoint">
            When the <InlineCode>&apos;not_a_number&apos;</InlineCode> packet
            arrives, Terminal 1 catches the{" "}
            <InlineCode>FormatException</InlineCode>, rejects it cleanly without
            crashing, and keeps running.
          </p>
          <p className="bulletpoint">
            Try typing <InlineCode>125</InlineCode> and pressing Enter in
            Terminal 2—you will immediately see{" "}
            <InlineCode>ALERT [CRITICAL]</InlineCode> bounce back from Terminal
            1!
          </p>
        </div>
      </>
    </section>
  );
};
export const Subtopic5_05 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Solo Capstone Challenge */}
      <>
        <h3>Your Solo Capstone Challenge: Build wallet_ledger</h3>
        <p>
          Now that you have seen how a multi-file, streaming Dart architecture
          works end-to-end, build the <b>Real-Time Streaming Wallet Ledger</b>{" "}
          on your own using the exact same project structure:
        </p>
        <NumberedList>
          <p>
            Create a <InlineCode>wallet_ledger/</InlineCode> folder with{" "}
            <InlineCode>pubspec.yaml</InlineCode>,{" "}
            <InlineCode>lib/wallet_ledger.dart</InlineCode> (barrel file),{" "}
            <InlineCode>lib/src/</InlineCode>, and <InlineCode>bin/</InlineCode>
            .
          </p>
          <p>
            Implement <InlineCode>Currency</InlineCode> (rwf, usd, eur) and{" "}
            <InlineCode>Money</InlineCode> (<InlineCode>+</InlineCode>,{" "}
            <InlineCode>&gt;</InlineCode>, <InlineCode>==</InlineCode>/
            <InlineCode>hashCode</InlineCode>,{" "}
            <InlineCode>toString()</InlineCode>, and{" "}
            <InlineCode>50.usd</InlineCode> extensions).
          </p>
          <p>
            Implement <InlineCode>Payment</InlineCode> (
            <InlineCode>fromMap</InlineCode> factory +{" "}
            <InlineCode>SafeParse</InlineCode> for string amounts) and{" "}
            <InlineCode>WalletRepository</InlineCode> (
            <InlineCode>Repository&lt;Payment&gt;</InlineCode> +{" "}
            <InlineCode>Auditable</InlineCode> mixin).
          </p>
          <p>
            Wire up two terminals (or an <InlineCode>async*</InlineCode> payment
            stream + interactive <InlineCode>stdin</InlineCode> deposit
            terminal) that normalizes incoming payments to RWF, tracks unique
            merchants in a <InlineCode>Set&lt;String&gt;</InlineCode>, and
            rejects invalid currencies/amounts without crashing.
          </p>
        </NumberedList>
      </>
    </section>
  );
};
