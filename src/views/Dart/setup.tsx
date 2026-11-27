import { MermaidDiagram } from "@/components/MermaidDiagram";
import { CodeBlock, InlineCode } from "@/components/ui/CodeDisplay";
import { NumberedList } from "@/components/ui/NumberedList";
import { TableMinimal } from "@/components/ui/tableMinimal";

export const subtopics = [
  "Check existing setup",
  "Android CLI without Android Studio",
  "First Dart program: Input & output",
  "CLI arguments & multi-experiment files",
];

export const summary =
  "0.1: Dart SDK, flutter doctor. 0.2: Android CLI, sdkmanager, adb, emulator. 0.3: hello world, stdin, stdout, readLineSync. 0.4: main args, CLI flags.";

export const Subtopic0_01 = () => {
  return (
    <section className="flex flex-col gap-2">
      <p>
        Before touching your terminal, let&apos;s understand what you are
        actually installing and why these two names always appear together.
      </p>

      <h3>What is Flutter?</h3>
      <p>
        <span>Flutter</span> is a UI toolkit created by Google that lets you
        build native apps for Android, iOS, Web, and Desktop from one{" "}
        <span>single codebase</span>.
      </p>
      <p>
        Normally, building an Android app requires learning Kotlin/Java, and
        building an iOS app requires learning Swift. Flutter bypasses this by
        bringing its own high-speed drawing engine—meaning it paints every
        button, text box, and animation directly onto the screen itself.
      </p>

      <h3>What is Dart?</h3>
      <p>
        <span>Dart</span> is the programming language used to write Flutter
        apps. While Flutter handles what appears on the screen (buttons,
        layouts, colors), Dart handles the brain behind the app (fetching data,
        calculating totals, responding to taps).
      </p>
      <TableMinimal
        heads={["Tool", "Role in Your App", "Real-World Analogy"]}
        data={[
          {
            tool: "Dart",
            role: "The programming language (logic, variables, math, data)",
            analogy: "The engine and wiring inside a car",
          },
          {
            tool: "Flutter",
            role: "The UI framework (widgets, screens, animations, device access)",
            analogy: "The steering wheel, dashboard, and body of the car",
          },
        ]}
      />

      <h3>Why We Are Skipping Android Studio</h3>
      <p>
        Most tutorials tell you to install Android Studio, a massive program
        that takes up 10+ GB of space and slows down many laptops. You do not
        need it. We will use VS Code (a fast, lightweight text editor) paired
        with <span>Android&apos;s standalone command-line tools</span>, giving
        you the exact same Android phone emulator and app-building power at a
        fraction of the weight.
      </p>

      {/* Stage 1 */}
      <h2>Stage 1: Check Existing Setup</h2>
      <p>
        Before downloading anything, let&apos;s check what is already on your
        computer and learn how your system finds developer tools.
      </p>

      <>
        <h3>1.1 Check Visually First (Using Your Mouse)</h3>
        <p>You don&apos;t need commands to spot desktop apps:</p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <span>Windows: </span>Press the Windows Key, open
            <span> Settings → Apps → Installed apps</span>, and look for Visual
            Studio Code or Git.
          </p>
          <p className="bulletpoint">
            <span>macOS: </span>Open <span>Finder → Applications</span> and
            check for Visual Studio Code.
          </p>
          <p className="bulletpoint">
            <span>Linux (Ubuntu/Debian): </span>Open your <span>App Grid</span>{" "}
            (bottom-left dots) and look for Visual Studio Code.
          </p>
        </div>
      </>

      <>
        <h3>1.2 Confirm Tools Exist</h3>
        <p>
          Developer tools like <InlineCode>git</InlineCode> and{" "}
          <InlineCode>dart</InlineCode> don&apos;t have desktop icons. To check
          if they exist, open your terminal:
        </p>
        <div>
          <p className="bulletpoint">
            <span>Windows: </span>Press <InlineCode>Windows Key</InlineCode>,
            type PowerShell, and open it.
          </p>
          <p className="bulletpoint">
            <span>macOS: </span>Press <InlineCode>Cmd + Space</InlineCode>, type
            Terminal, and press Enter.
          </p>
          <p className="bulletpoint">
            <span>Linux: </span>Press <InlineCode>Ctrl + Alt + T</InlineCode>.
          </p>
        </div>
        <p>
          Type the tool&apos;s name followed by{" "}
          <InlineCode>--version</InlineCode>:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal"
          code={`
dart --version
flutter --version
      `}
        />
        <i>
          (Note: Java is the one famous exception—it uses a single dash:{" "}
          <InlineCode>java -version</InlineCode>.)
        </i>
      </>

      <>
        <h3>1.3 What the Tools Do &amp; Healthy Output</h3>
        <TableMinimal
          heads={["Layer", "Tool", "What it does", "Healthy output"]}
          data={[
            {
              Layer: "Core",
              Tool: "winget / brew / apt",
              "What it does":
                "Built-in package manager to install software cleanly",
              "Healthy output": "Version number (e.g., v1.7...)",
            },
            {
              Layer: "Core",
              Tool: "git",
              "What it does":
                "Downloads Flutter and tracks changes in your code",
              "Healthy output": "git version 2.44.0",
            },
            {
              Layer: "Core",
              Tool: "VS Code",
              "What it does":
                "Lightweight code editor where you write Dart & Flutter",
              "Healthy output": "Opens editor window",
            },
            {
              Layer: "Language",
              Tool: "dart",
              "What it does": "Runs standalone Dart programs in your terminal",
              "Healthy output": "Dart SDK version: 3.x.x",
            },
            {
              Layer: "UI Kit",
              Tool: "flutter",
              "What it does": "Builds mobile apps and manages packages",
              "Healthy output": "Flutter 3.x.x",
            },
            {
              Layer: "Android",
              Tool: "java (JDK 17)",
              "What it does":
                "Required engine that compiles Android app packages",
              "Healthy output": 'openjdk version "17.x.x"',
            },
            {
              Layer: "Android",
              Tool: "sdkmanager",
              "What it does":
                "Downloads Android OS versions without Android Studio",
              "Healthy output": "Lists available SDK packages",
            },
            {
              Layer: "Android",
              Tool: "adb",
              "What it does":
                '"Android Debug Bridge" — sends your app to a phone/emulator',
              "Healthy output": "Android Debug Bridge version 1.0.41",
            },
            {
              Layer: "Android",
              Tool: "emulator",
              "What it does":
                "Runs a virtual Android phone screen on your computer",
              "Healthy output": "Lists virtual devices",
            },
          ]}
        />
      </>

      <>
        <h3>1.4 Understanding &quot;Command Not Found&quot; and PATH</h3>
        <p>
          If your terminal says{" "}
          <InlineCode>&apos;dart&apos; is not recognized</InlineCode> (Windows)
          or <InlineCode>command not found: dart</InlineCode> (Mac/Linux), it
          means one of two things:
        </p>
        <NumberedList>
          <p>The tool isn&apos;t installed yet</p>
          <p>
            The tool is installed, but its folder isn&apos;t listed in your PATH
          </p>
        </NumberedList>
        <p>
          <span>What is PATH? </span>Think of PATH as your computer&apos;s
          contacts list for programs. When you type{" "}
          <InlineCode>flutter</InlineCode>, your computer only looks inside the
          folders saved on its PATH list.
        </p>
        <MermaidDiagram
          chart={`
flowchart TD
  A["You type 'flutter' in terminal"] --> B{"Did you restart the terminal<br/>after installing?"}
  B -- No --> C["Close & reopen terminal"]
  B -- Yes --> D{"Does the flutter folder<br/>exist on your drive?"}
  D -- No --> E["We will install it in Stage 2"]
  D -- Yes --> F["Add the folder's /bin path to<br/>System Environment Variables (PATH)"]
      `}
        />
        <div>
          <p className="bulletpoint">
            <span>How to view PATH visually on Windows: </span>Press Windows Key
            → search &quot;Edit the system environment variables&quot; → click
            Environment Variables → select Path → Edit.
          </p>
          <p className="bulletpoint">
            <span>How to view PATH on macOS/Linux: </span>Open your Home folder
            in your file manager and press{" "}
            <InlineCode>Cmd + Shift + .</InlineCode> (Mac) or{" "}
            <InlineCode>Ctrl + H</InlineCode> (Linux) to reveal hidden files.
            Open <InlineCode>.zshrc</InlineCode> (Mac) or{" "}
            <InlineCode>.bashrc</InlineCode> (Linux).
          </p>
        </div>
      </>
    </section>
  );
};
export const Subtopic0_02 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Stage 2 */}
      <h2>Stage 2: Install Your Lightweight Stack</h2>

      <>
        <h3>2.1 Install Git, VS Code, Java 17, and Flutter</h3>
        <p>
          Run the commands for your operating system to install the core tools:
        </p>

        <h4>Windows (PowerShell)</h4>
        <CodeBlock
          language="bash"
          filename="PowerShell"
          code={`
winget install --id Git.Git -e
winget install --id Microsoft.VisualStudioCode -e
winget install --id EclipseAdoptium.Temurin.17.JDK -e
      `}
        />
        <p>
          <i>
            (Download the Flutter SDK zip from{" "}
            <span className="font-medium text-foreground">flutter.dev</span>,
            extract it to <InlineCode>C:\src\flutter</InlineCode>, and add{" "}
            <InlineCode>C:\src\flutter\bin</InlineCode> to your Windows Path via
            the GUI shown in Stage 1.4.)
          </i>
        </p>

        <h4>macOS (Terminal)</h4>
        <CodeBlock
          language="bash"
          filename="Terminal (macOS)"
          code={`
brew install git openjdk@17
brew install --cask visual-studio-code flutter
      `}
        />

        <h4>Linux — Ubuntu/Debian (Terminal)</h4>
        <p>
          <i>
            (Most other Linux distributions follow this same directory layout.)
          </i>
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal (Linux)"
          code={`
sudo apt update && sudo apt install -y git curl unzip xz-utils zip libglu1-mesa openjdk-17-jdk
sudo snap install code --classic
sudo snap install flutter --classic
      `}
        />
      </>

      <>
        <h3>2.2 Set Up Android Command-Line Tools</h3>
        <NumberedList>
          <p>
            Go to{" "}
            <span className="font-medium text-foreground">android.com</span> in
            your browser, scroll all the way down to{" "}
            <span className="font-medium text-foreground">
              &quot;Command line tools only&quot;
            </span>
            , and download the zip file for your OS.
          </p>
          <div>
            <p>
              Create a folder for your Android SDK and extract the zip inside it
              so the folder structure looks exactly like this:
            </p>
            <div className="mt-1.5 flex flex-col gap-1">
              <p className="bulletpoint">
                <span className="font-semibold text-foreground">Windows: </span>
                <InlineCode>C:\Android\cmdline-tools\latest\bin</InlineCode>
              </p>
              <p className="bulletpoint">
                <span className="font-semibold text-foreground">
                  macOS / Linux:{" "}
                </span>
                <InlineCode>~/Android/cmdline-tools/latest/bin</InlineCode>
              </p>
            </div>
            <p className="mt-1.5">
              <i>
                (Note: When you unzip the download, the folder is named{" "}
                <InlineCode>cmdline-tools</InlineCode>. Rename it to{" "}
                <InlineCode>latest</InlineCode> and place it inside a parent
                folder named <InlineCode>cmdline-tools</InlineCode>.)
              </i>
            </p>
          </div>
          <div>
            <p>
              Add these folders to your <InlineCode>PATH</InlineCode> (and set{" "}
              <InlineCode>ANDROID_HOME</InlineCode> to{" "}
              <InlineCode>C:\Android</InlineCode> on Windows or{" "}
              <InlineCode>~/Android</InlineCode> on Mac/Linux):
            </p>
            <div className="mt-1.5 flex flex-col gap-1">
              <p className="bulletpoint">
                <InlineCode>.../Android/cmdline-tools/latest/bin</InlineCode>
              </p>
              <p className="bulletpoint">
                <InlineCode>.../Android/platform-tools</InlineCode>
              </p>
              <p className="bulletpoint">
                <InlineCode>.../Android/emulator</InlineCode>
              </p>
            </div>
          </div>
        </NumberedList>
      </>

      <>
        <h3>2.3 Download the Android OS &amp; Create a Virtual Phone</h3>
        <p>
          Restart your terminal so it reads your updated{" "}
          <InlineCode>PATH</InlineCode>, then run:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal"
          code={`
# 1. Accept Android licenses
sdkmanager --licenses

# 2. Download platform tools, Android 14 (API 34), build tools, and the emulator
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "emulator"

# 3. Download a lightweight virtual phone system image
sdkmanager "system-images;android-34;google_apis;x86_64"

# 4. Create a virtual phone named "pixel_test"
avdmanager create avd -n pixel_test -k "system-images;android-34;google_apis;x86_64" --device "pixel_6"
      `}
        />
      </>

      <>
        <h3>2.4 Verify Everything &amp; Install VS Code Extensions</h3>
        <NumberedList>
          <p>Open VS Code.</p>
          <p>
            Click the{" "}
            <span className="font-semibold text-foreground">Extensions</span>{" "}
            icon on the left sidebar (four squares, or press{" "}
            <InlineCode>Ctrl+Shift+X</InlineCode> /{" "}
            <InlineCode>Cmd+Shift+X</InlineCode>).
          </p>
          <p>
            Search for{" "}
            <span className="font-semibold text-foreground">Flutter</span> and
            click <span className="font-semibold text-foreground">Install</span>{" "}
            (this automatically installs the Dart extension too).
          </p>
          <div>
            <p>
              In your terminal, tell Flutter where your Android SDK lives and
              run its health check:
            </p>
            <CodeBlock
              language="bash"
              filename="Terminal"
              code={`
# Windows: flutter config --android-sdk C:\\Android
# Mac/Linux: flutter config --android-sdk ~/Android

flutter doctor
          `}
            />
          </div>
        </NumberedList>
        <p>
          You should see green checkmarks next to{" "}
          <span className="font-semibold text-foreground">Flutter</span>,{" "}
          <span className="font-semibold text-foreground">
            Android toolchain
          </span>
          , and <span className="font-semibold text-foreground">VS Code</span>!
        </p>
      </>
    </section>
  );
};
export const Subtopic0_03 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Stage 3 */}
      <h2>Stage 3: First Dart Program — Input &amp; Output</h2>
      <p>
        Before building visual Flutter screens, let&apos;s learn how Dart thinks
        by building an interactive terminal program.
      </p>

      <>
        <h3>3.1 Create Your Workspace Visually</h3>
        <NumberedList>
          <p>Open VS Code.</p>
          <p>
            Go to{" "}
            <span className="font-semibold text-foreground">
              File → Open Folder...
            </span>{" "}
            (or click{" "}
            <span className="font-semibold text-foreground">Open Folder</span>{" "}
            on the welcome screen).
          </p>
          <p>
            Create a new folder named <InlineCode>dart_basics</InlineCode> and
            open it.
          </p>
          <p>
            Click the{" "}
            <span className="font-semibold text-foreground">New File</span> icon
            next to your folder name in the left Explorer panel and name it{" "}
            <InlineCode>greeter.dart</InlineCode>.
          </p>
        </NumberedList>
      </>

      <>
        <h3>3.2 Understanding How Dart Reads &amp; Writes</h3>
        <p>
          To talk to a user in the terminal, Dart needs its built-in
          input/output toolbox (<InlineCode>dart:io</InlineCode>):
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>stdout.write()</InlineCode> prints text without jumping
            to a new line (great for prompts like{" "}
            <InlineCode>Enter your name: </InlineCode>).
          </p>
          <p className="bulletpoint">
            <InlineCode>print()</InlineCode> prints text and moves to a new
            line.
          </p>
          <p className="bulletpoint">
            <InlineCode>stdin.readLineSync()</InlineCode> pauses the program and
            waits for the user to type something and press Enter.
          </p>
        </div>
      </>

      <>
        <h3>3.3 Write and Run greeter.dart</h3>
        <p>
          Paste this code into <InlineCode>greeter.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="greeter.dart"
          code={`
import 'dart:io';

void main() {
  // 1. Ask for the user's name
  stdout.write('What is your name? ');
  String? name = stdin.readLineSync();

  // 2. Ask for their birth year
  stdout.write('What year were you born? ');
  String? yearInput = stdin.readLineSync();

  // 3. Convert text input into a number safely
  int birthYear = int.tryParse(yearInput ?? '') ?? 2000;
  int currentYear = DateTime.now().year;
  int age = currentYear - birthYear;

  // 4. Print the result using \$variable interpolation
  print('\\nHello, \${name ?? "Friend"}!');
  print('You are roughly \$age years old.');
}
      `}
        />

        <h4>Why are there ? and ?? symbols?</h4>
        <p>
          Dart protects your app from crashing when data is missing (Null
          Safety).
        </p>
        <div className="flex flex-col gap-1">
          <p className="bulletpoint">
            <InlineCode>String?</InlineCode> means: &quot;This variable holds
            text, OR it might be empty (<InlineCode>null</InlineCode>).&quot;
          </p>
          <p className="bulletpoint">
            <InlineCode>yearInput ?? &apos;&apos;</InlineCode> means: &quot;Use{" "}
            <InlineCode>yearInput</InlineCode>, or if it&apos;s empty, fall back
            to blank text <InlineCode>&apos;&apos;</InlineCode>.&quot;
          </p>
          <p className="bulletpoint">
            <InlineCode>int.tryParse(...) ?? 2000</InlineCode> safely converts
            text like <InlineCode>&quot;1998&quot;</InlineCode> into a math
            number, falling back to <InlineCode>2000</InlineCode> if someone
            typed letters instead of numbers.
          </p>
        </div>

        <p>
          <span className="font-semibold text-foreground">Run it: </span>Open VS
          Code&apos;s built-in terminal (<InlineCode>Ctrl + ~</InlineCode> or
          top menu{" "}
          <span className="font-semibold text-foreground">
            Terminal → New Terminal
          </span>
          ) and type:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal"
          code={`dart run greeter.dart`}
        />
      </>
    </section>
  );
};
export const Subtopic0_04 = () => {
  return (
    <section className="flex flex-col gap-2">
      {/* Stage 4 */}
      <h2>Stage 4: CLI Arguments &amp; Multi-Experiment Files</h2>
      <p>
        As you learn Dart, you will want to test lots of small ideas
        (calculators, lists, loops) without overwriting your old code or
        answering <InlineCode>stdin</InlineCode> prompts every single time.
      </p>

      <>
        <h3>4.1 Passing Data Directly via CLI Arguments</h3>
        <p>
          Instead of waiting for a user to type after the program starts, you
          can pass values straight into{" "}
          <InlineCode>main(List&lt;String&gt; args)</InlineCode> when launching
          the file.
        </p>
        <p>
          Create a new file in VS Code called <InlineCode>calc.dart</InlineCode>
          :
        </p>
        <CodeBlock
          language="dart"
          filename="calc.dart"
          code={`
void main(List<String> args) {
  // Check if the user provided two numbers
  if (args.length < 2) {
    print('Usage: dart run calc.dart <num1> <num2>');
    return; // Stop the program early
  }

  // args[0] is the first word after the filename, args[1] is the second
  double num1 = double.tryParse(args[0]) ?? 0;
  double num2 = double.tryParse(args[1]) ?? 0;

  print('Numbers received: \$num1 and \$num2');
  print('Sum: \${num1 + num2}');
  print('Product: \${num1 * num2}');
}
      `}
        />
        <p>
          Run it from the terminal by passing two numbers right after the
          filename:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal"
          code={`dart run calc.dart 12.5 4`}
        />
      </>

      <>
        <h3>4.2 Organizing Multi-Experiment Files</h3>
        <p>
          When practicing Dart, organize your folder so each experiment stays
          clean and reusable. When you split logic into separate files,{" "}
          <InlineCode>main.dart</InlineCode> acts as your control panel that
          imports your experiments:
        </p>
        <MermaidDiagram
          chart={`
flowchart LR
  Main["main.dart<br/>(Entry Point & CLI Router)"]
  Temp["experiments/temperature.dart<br/>(Conversion Logic)"]
  Todo["experiments/todo_list.dart<br/>(Checklist Logic)"]
  Main -- "imports" --> Temp
  Main -- "imports" --> Todo
      `}
        />
        <p>
          Inside <InlineCode>dart_basics</InlineCode>, click the{" "}
          <span className="font-semibold text-foreground">New Folder</span> icon
          in VS Code and name it <InlineCode>experiments</InlineCode>.
        </p>
        <p>
          Create <InlineCode>experiments/temperature.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="experiments/temperature.dart"
          code={`
double celsiusToFahrenheit(double celsius) {
  return (celsius * 9 / 5) + 32;
}

void runTemperatureDemo(double tempC) {
  double tempF = celsiusToFahrenheit(tempC);
  print('\$tempC°C is equal to \${tempF.toStringAsFixed(1)}°F');
}
      `}
        />

        <p>
          Create <InlineCode>experiments/todo_list.dart</InlineCode>:
        </p>
        <CodeBlock
          language="dart"
          filename="experiments/todo_list.dart"
          code={`
void runListDemo() {
  List<String> tasks = ['Install Flutter', 'Write Dart CLI', 'Build First UI'];
  tasks.add('Launch Emulator');

  print('Your Learning Checklist:');
  for (int i = 0; i < tasks.length; i++) {
    print('  \${i + 1}. \${tasks[i]}');
  }
}
      `}
        />

        <p>
          Create <InlineCode>main.dart</InlineCode> in your root{" "}
          <InlineCode>dart_basics</InlineCode> folder to connect them using{" "}
          <InlineCode>import</InlineCode> and CLI arguments:
        </p>
        <CodeBlock
          language="dart"
          filename="main.dart"
          code={`
import 'experiments/temperature.dart';
import 'experiments/todo_list.dart';

void main(List<String> args) {
  // Pick which experiment to run based on the first CLI argument
  String choice = args.isNotEmpty ? args[0] : 'list';
  print('--- Running Experiment: \$choice ---');

  switch (choice) {
    case 'temp':
      double inputTemp = args.length > 1 ? (double.tryParse(args[1]) ?? 25.0) : 25.0;
      runTemperatureDemo(inputTemp);
      break;
    case 'list':
      runListDemo();
      break;
    default:
      print('Unknown experiment. Try: "temp" or "list"');
  }
}
      `}
        />

        <p>
          Now you can switch between completely different Dart experiments from
          one entry point:
        </p>
        <CodeBlock
          language="bash"
          filename="Terminal"
          code={`
dart run main.dart list
dart run main.dart temp 30
      `}
        />
      </>

      {/* Where to Go Next */}
      <h2>Where to Go Next</h2>
      <p>
        You now have a working, lightweight Dart &amp; Flutter environment and
        understand how Dart files take input, process data, and import code
        across files. To launch your very first visual mobile app on your
        virtual phone, run:
      </p>
      <CodeBlock
        language="bash"
        filename="Terminal"
        code={`
emulator -avd pixel_test &
flutter create my_first_app
cd my_first_app
flutter run
    `}
      />
    </section>
  );
};
