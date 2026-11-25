import { Callout, CodeBlock, DataTable, Figure, VideoLink } from "./shared";

/* ------------------------------------------------------------------ */
/* 1.1 Model, provider and wrapper                                     */
/* ------------------------------------------------------------------ */

export const ModelProviderWrapper = () => (
  <>
    <p>
      Everything in this series rests on one pattern: your code sends a list of
      messages to a language model over HTTP and reads text back. Before
      installing anything, it helps to know which four things are involved,
      because beginners often mix them up.
    </p>

    <h4>Four things to keep apart</h4>
    <ul className="list-disc space-y-1 pl-6">
      <li>
        <strong>Model:</strong> a file of numbers (weights). Mathematically it
        is a function from tokens to next-token probabilities. Llama, GPT-OSS,
        MiniLM and BERT are all models.
      </li>
      <li>
        <strong>Hugging Face:</strong> the GitHub of models. It hosts weights,
        tokenizers and datasets. In this series you download from it to run
        things on your own machine: tokenizers, the BERT classifier and the
        embedding model.
      </li>
      <li>
        <strong>Provider (Groq):</strong> a company that runs a model for you on
        fast hardware and exposes it as an HTTP API. You pay per token, or use a
        free tier, and never touch a GPU.
      </li>
      <li>
        <strong>Wrapper (SDK):</strong> the code that builds the HTTP request
        for you. It adds nothing to the model’s intelligence.
      </li>
    </ul>

    <Figure
      file="ch1-four-players.png"
      alt="Diagram: your code calls a wrapper, the wrapper sends an HTTP request to a provider, the provider runs a model, and the model weights come from Hugging Face."
      caption="How the four pieces connect. Your code never talks to the model directly."
    />

    <h4>Run it locally or call it hosted?</h4>
    <DataTable
      headers={["", "Run locally (Hugging Face)", "Hosted (Groq)"]}
      rows={[
        ["Hardware", "Your CPU or GPU", "None"],
        [
          "Cost",
          "Free after the download",
          "Per million tokens, with a free tier",
        ],
        ["Privacy", "Data stays on your machine", "Data goes to the provider"],
        ["Speed", "Limited by your laptop", "Very fast"],
        [
          "This series uses it for",
          "Tokenizers, embeddings, BERT zero-shot",
          "Chat, summaries, prompt-based classification",
        ],
      ]}
    />

    <VideoLink
      href="https://www.youtube.com/watch?v=WIW5hN-hApQ&t=1611s"
      thumbnail="ch1-video-huggingface.jpg"
      title="What is Hugging Face?"
      caption="Course video, starts at 00:26:51"
    />

    <Callout kind="tip">
      <p>
        A good rule for the whole series: use a hosted model when you need
        language ability, and a small local model when the job is narrow, runs
        thousands of times, or must stay private.
      </p>
    </Callout>
  </>
);

/* ------------------------------------------------------------------ */
/* 1.2 Environment and secrets                                         */
/* ------------------------------------------------------------------ */

export const EnvironmentSecrets = () => (
  <>
    <p>
      Setup is three things: an isolated Python environment, the packages, and a
      secret API key that never appears in your source code.
    </p>

    <VideoLink
      href="https://www.youtube.com/watch?v=WIW5hN-hApQ&t=267s"
      thumbnail="ch1-video-setup.jpg"
      title="Setting up the development environment"
      caption="Course video, starts at 00:04:27"
    />

    <h4>Create the environment and install packages</h4>
    <p>
      A virtual environment keeps this project’s packages separate from every
      other Python project on your machine.
    </p>
    <CodeBlock>{`python -m venv .venv
source .venv/bin/activate          # Windows: .venv\\Scripts\\activate

pip install openai python-dotenv transformers tiktoken \\
            sentence-transformers langchain-groq`}</CodeBlock>

    <DataTable
      headers={["Package", "What it does in this series"]}
      rows={[
        ["openai", "Raw chat API client (works with Groq through a base URL)"],
        ["python-dotenv", "Loads secrets from a .env file"],
        [
          "transformers",
          "Tokenizers and the zero-shot pipeline (Planet Classifier)",
        ],
        ["tiktoken", "Fast token counting and token-based chunk sizes"],
        ["sentence-transformers", "Embedding models (Planet Embeddings)"],
        ["langchain-groq", "The second wrapper, introduced in 1.3"],
      ]}
    />
    <p>
      Later blogs in the series add more packages (a vector database, agent
      libraries). Install them when you get there.
    </p>

    <h4>Keep secrets in a .env file</h4>
    <p>
      Create a file named <code>.env</code> next to your code and put the key in
      it. Then add <code>.env</code> to <code>.gitignore</code> before your very
      first commit.
    </p>
    <CodeBlock>{`# .env
GROQ_API_KEY=gsk_your_key_here

# .gitignore
.env
.venv/`}</CodeBlock>

    <p>
      <code>dotenv.load_dotenv()</code> reads that file into the process
      environment, and <code>os.getenv</code> reads it back. The key never has
      to be written in your source.
    </p>
    <CodeBlock>{`import os
import dotenv

dotenv.load_dotenv()

key = os.getenv('GROQ_API_KEY')
if not key:
    raise SystemExit('GROQ_API_KEY is missing. Add it to your .env file.')`}</CodeBlock>

    <Callout kind="warning">
      <p>
        If a key ever reaches GitHub, treat it as stolen: delete it in the
        provider console and create a new one. Removing it from a later commit
        does not remove it from the history.
      </p>
    </Callout>

    <Callout kind="tip">
      <p>
        The code in this series uses nested quotes inside f-strings, which only
        works on Python 3.12 or later. Run <code>python --version</code> on any
        machine where you deploy.
      </p>
    </Callout>
  </>
);

/* ------------------------------------------------------------------ */
/* 1.3 Choosing a wrapper                                              */
/* ------------------------------------------------------------------ */

export const ChoosingWrapper = () => (
  <>
    <p>
      Both wrappers send the same request. To see that nothing magical is
      happening, here is the raw HTTP call with no library at all.
    </p>

    <h4>What goes over the wire</h4>
    <CodeBlock>{`curl https://api.groq.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer $GROQ_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-oss-20b",
    "messages": [{"role": "user", "content": "Say hi in five words."}]
  }'`}</CodeBlock>
    <p>
      That is all a wrapper does: build this JSON, add your key, send it, and
      turn the JSON reply into Python objects.
    </p>

    <h4>Option A: the openai SDK with a base URL</h4>
    <p>
      Groq copies the OpenAI API format, so the OpenAI client works if you
      change the address. You pass messages as plain dictionaries.
    </p>
    <CodeBlock>{`from openai import OpenAI

client = OpenAI(
    api_key=os.getenv('GROQ_API_KEY'),
    base_url='https://api.groq.com/openai/v1',
)

r = client.chat.completions.create(
    model='openai/gpt-oss-20b',
    messages=[{'role': 'user', 'content': 'Capital of Rwanda?'}],
)
print(r.choices[0].message.content)`}</CodeBlock>

    <h4>Option B: LangChain’s ChatGroq</h4>
    <p>
      The same request, but messages are typed objects and the model plugs into
      agents, chains and structured output later.
    </p>
    <CodeBlock>{`from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

llm = ChatGroq(model='openai/gpt-oss-20b', temperature=0.2)

r = llm.invoke([
    SystemMessage('Give short answers.'),
    HumanMessage('Capital of Rwanda?'),
])
print(r.content)
print(r.usage_metadata)`}</CodeBlock>

    <DataTable
      headers={["", "A: openai SDK + base_url", "B: ChatGroq (LangChain)"]}
      rows={[
        [
          "Message format",
          "Dicts: {'role': 'user', 'content': '...'}",
          "Objects: HumanMessage, SystemMessage, AIMessage",
        ],
        [
          "Switch provider",
          "Change base_url and the model name",
          "Change the class (ChatOpenAI, ChatAnthropic, ...)",
        ],
        [
          "Best for",
          "Learning the raw protocol, small scripts",
          "Agents, chains, structured output, LangGraph",
        ],
        [
          "Reading the answer",
          "response.choices[0].message.content",
          "response.content",
        ],
      ]}
    />

    <Callout kind="tip">
      <p>
        Learn A first. Once you have seen the raw dictionaries, B is simply a
        typed version of them. This blog uses A for chat and classification, and
        the next blog switches to B for agents.
      </p>
    </Callout>
  </>
);

/* ------------------------------------------------------------------ */
/* 1.4 Smoke test                                                      */
/* ------------------------------------------------------------------ */

export const SmokeTest = () => (
  <>
    <p>
      Before building anything, prove that the whole chain works: environment,
      key, network, provider and model. This takes one minute and saves hours of
      confusing errors later.
    </p>

    <CodeBlock>{`import os
import dotenv
from openai import OpenAI

dotenv.load_dotenv()

client = OpenAI(
    api_key=os.getenv('GROQ_API_KEY'),
    base_url='https://api.groq.com/openai/v1',
)

r = client.chat.completions.create(
    model='openai/gpt-oss-20b',
    messages=[{'role': 'user', 'content': 'Say hi in five words.'}],
)

print(r.choices[0].message.content)
print(r.usage)   # prompt_tokens, completion_tokens, total_tokens`}</CodeBlock>

    <p>
      Success means a short greeting plus a <code>usage</code> object. That
      usage object is what you will use in Chapter 2 to measure cost.
    </p>

    <h4>If it fails</h4>
    <DataTable
      headers={["Symptom", "Likely cause", "Fix"]}
      rows={[
        [
          "Error about a missing api_key",
          "The .env file was not found or the variable name is wrong",
          "Run the script from the folder that holds .env; check GROQ_API_KEY spelling",
        ],
        [
          "401 Unauthorized",
          "The key is wrong or was deleted",
          "Create a new key in the provider console",
        ],
        [
          "404 or model not found",
          "The model name is wrong or was removed from the free tier",
          "Copy the exact name from the provider’s model list; keep it in one constant",
        ],
        [
          "429 Too Many Requests",
          "You hit a free-tier rate limit",
          "Wait a minute, then retry; add a short pause between calls",
        ],
      ]}
    />

    <h4>Chapter checkpoint</h4>
    <p>
      You are ready for the next chapter when you can say, in your own words:
    </p>
    <ul className="list-disc space-y-1 pl-6">
      <li>What the difference is between a model, a provider and a wrapper.</li>
      <li>Why the API key lives in .env and .env is in .gitignore.</li>
      <li>What request a wrapper actually sends.</li>
      <li>Where to read the token usage of a call.</li>
    </ul>
  </>
);
