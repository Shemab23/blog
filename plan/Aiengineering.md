I'll read the heading structure of your notes file first, then do Phase 1 only, as your prompt requires.

I read the heading structure of your notes and drafted the Phase 1 blueprint. Nothing is written yet, as your workflow requires.

Your attached file ends at section 13. The free-models section (14) is only in the doc, so I'd fold it into the last chapter below.

## Proposed blueprint (one blog, 12 chapters)

I'd drop section 0 as a chapter, because it becomes `summary.general`. I'd also drop section 12 ("Review of the code you wrote"), because it's about your own code. Its fixes would go into the sub-topics as gotchas. Each project becomes the last sub-topic of its chapter.

| Chapter | Sub-topics |
| --- | --- |
| **1. Boarding: Setup and Mental Model** | 1.1 Model, provider and wrapper · 1.2 Environment and secrets · 1.3 Choosing a wrapper · 1.4 Smoke test |
| **2. Planet Chatbot** | 2.1 What an LLM is · 2.2 Softmax and temperature · 2.3 Roles and the system prompt · 2.4 Conversation history · 2.5 Tokens · 2.6 Counting tokens and cost · 2.7 Sliding window · 2.8 Summarisation · 2.9 Streaming · 2.10 One class owns the state · 2.11 Project 1: Client Intake Bot |
| **3. Planet Classifier** | 3.1 Sentiment and prompt engineering · 3.2 NLI · 3.3 BERT · 3.4 Running a model with `pipeline` · 3.5 Choosing an approach · 3.6 Evaluation · 3.7 Project 2: Inbox Triage |
| **4. Planet Embeddings** | 4.1 What embeddings are · 4.2 Sentence Transformers · 4.3 Layout of semantic search · 4.4 Pitfalls · 4.5 Project 3: Gig Radar |
| **5. Planet RAG** | 5.1 Why RAG · 5.2 The two pipelines · 5.3 Preparing the knowledge base · 5.4 Chunking · 5.5 Chroma · 5.6 Chunk IDs · 5.7 Retrieval · 5.8 Generation · 5.9 Project 4: Contract Copilot |
| **6. Planet Agent** | 6.1 What an agent is · 6.2 Tools · 6.3 Three levels to build one · 6.4 The conversation loop · 6.5 Web-search agent · 6.6 MCP · 6.7 Project 5: Pre-call Briefer |
| **7. Planet Structured** | 7.1 `PromptTemplate` · 7.2 `ChatPromptTemplate` · 7.3 `MessagesPlaceholder` · 7.4 Pydantic · 7.5 Structured output · 7.6 Project 6: Lead Extractor |
| **8. Planet Memory** | 8.1 Checkpointers · 8.2 `InMemorySaver` · 8.3 Switching conversations · 8.4 `PostgresSaver` · 8.5 Reading state back · 8.6 Project 7: Client Memory Assistant |
| **9. Planet Middleware** | 9.1 What middleware is · 9.2 `SummarizationMiddleware` · 9.3 Approvals, limits, redaction · 9.4 Project 8: Hardened Assistant |
| **10. Planet LangGraph** | 10.1 What LangGraph is · 10.2 A first graph · 10.3 Conditional edges and loops · 10.4 Write, review, revise · 10.5 Agent or graph? · 10.6 Project 9: Proposal Forge |
| **11. Planet Multi-Agent** | 11.1 Why split · 11.2 Supervisor approach · 11.3 Patterns · 11.4 Project 10: Freelance Copilot |
| **12. Free Models and Production** | 12.1 General-purpose models · 12.2 Free limits and budget maths · 12.3 Specialist models · 12.4 Switching rules · 12.5 Formula cheat sheet · 12.6 Which tool for which need · 12.7 Production habits · 12.8 Shipping and the README template |

That is 77 sub-topics, which is a very long single blog.

## Media plan

- **Registry fields:** `initials` would be `AE`. The tags would be `#AI`, `#LLM`, `#RAG`, `#Agents`, `#LangGraph`. Version `v1.0`, recorded `2026/11`.
- **Cover image:** a dark constellation of ten small planets joined by thin orbit lines, drawn in the blog's primary and accent colors. It echoes the "planets" structure of the course.
- **`logoImage`:** a simple icon of one node with two orbit rings.

| Diagram | Sub-topic | Idea |
| --- | --- | --- |
| Temperature chart | 2.2 | Bars for 3 tokens at T = 0.5, 1, 2 |
| History growth chart | 2.4 | Unbounded vs last-3-exchanges, from the table |
| Tokenisation strip | 2.5 | A sentence split into colored token chunks |
| Vector angle sketch | 4.1 | Two arrows in 2-D, cos = 0.992 vs 0 |
| RAG pipelines | 5.2 | Ingestion lane and query lane (already drawn in the doc) |
| Chunk overlap | 5.4 | A text bar cut into overlapping windows |
| Agent loop | 6.1 | Model, tool call, tool result, repeat |
| MCP architecture | 6.6 | Agent app, MCP client, two MCP servers |
| Checkpointer flow | 8.1 | Load, run, save by `thread_id` |
| Middleware hooks | 9.1 | The loop with the five hook points marked |
| Write-review-revise graph | 10.4 | Nodes, router, loop cap |
| Supervisor layout | 11.2 | Already drawn in the doc |
| Project ladder | 12.8 | Ten steps in a row |

## Please confirm before Phase 2

1. **One blog or a series?** I recommend a series of three, linked through `recommendedIds`:
   - **Foundations:** chapters 1 to 4, 27 sub-topics.
   - **Retrieval, Agents and Structured Output:** chapters 5 to 7, 22 sub-topics.
   - **Production Agent Systems:** chapters 8 to 12, 28 sub-topics.

   Shorter blogs load faster, are easier to search in the sidebar, and each one ends on a real milestone. Say "single" if you want one blog.
2. **Drop section 12 and fold its fixes in as gotchas?** I'll do that unless you object.
3. **Are the diagram list and the cover and logo ideas fine?** Change anything you like.

Once you confirm, I'll start Phase 2 with the `src/data/<BlogName>.ts` skeleton and placeholder components. I'll ask for the exact `BlogEntry` and `AppContext` type files first, so the skeleton compiles against your real types.


Here is the final plan. Series 1 is today's work.

## The series

| # | Blog | Slug | Chapters | Sub-topics | When |
| --- | --- | --- | --- | --- | --- |
| 1 | AI Engineering I: LLM Foundations | `ai-engineering-foundations` | Boarding, Chatbot, Classifier, Embeddings | 27 | **Today** |
| 2 | AI Engineering II: RAG, Agents and Structured Output | `ai-engineering-rag-agents` | RAG, Agent, Structured | 22 | Next |
| 3 | AI Engineering III: Production Agent Systems | `ai-engineering-production-agents` | Memory, Middleware, LangGraph, Multi-Agent, Free Models and Production | 28 | After |

Each blog ends with a teaser for the next one. When the later blogs are registered, `recommendedIds` will link all three.

## Series 1 blueprint

**Registry fields**
- **Name:** AI Engineering I: LLM Foundations.
- **Slug:** `ai-engineering-foundations`.
- **Initials:** `AF`.
- **Tags:** `#AI`, `#LLM`, `#PromptEngineering`, `#Embeddings`, `#Python`.
- **Version and date:** `v1.0`, `2026/11`.
- **Files:** `src/data/AiEngineeringFoundations.ts`, and views in `src/views/AiEngineeringFoundations/`.

**Chapters and sub-topics**
- **1. Boarding:** 1.1 Model, provider and wrapper · 1.2 Environment and secrets · 1.3 Choosing a wrapper · 1.4 Smoke test
- **2. Planet Chatbot:** 2.1 What an LLM is · 2.2 Softmax and temperature · 2.3 Roles and the system prompt · 2.4 Conversation history · 2.5 Tokens · 2.6 Counting tokens and cost · 2.7 Sliding window · 2.8 Summarisation · 2.9 Streaming · 2.10 One class owns the state · 2.11 Project 1: Client Intake Bot
- **3. Planet Classifier:** 3.1 Sentiment and prompt engineering · 3.2 NLI · 3.3 BERT · 3.4 `pipeline` · 3.5 Choosing an approach · 3.6 Evaluation · 3.7 Project 2: Inbox Triage
- **4. Planet Embeddings:** 4.1 What embeddings are · 4.2 Sentence Transformers · 4.3 Layout of semantic search · 4.4 Pitfalls · 4.5 Project 3: Gig Radar

**Media for Series 1**
- **Cover and logo:** a constellation of planets joined by orbit lines for the cover, and a node-with-two-rings icon for `logoImage`.
- **Four diagrams:** temperature bars (2.2), history growth chart (2.4), tokenisation strip (2.5), and vector angle sketch (4.1).
- **Optional:** a semantic-search layout diagram (4.3).

## Today's order

1. **Phase 2:** the data file with UUIDs and `summary.sections`, plus `index.tsx` and placeholder sub-topic components, so the app compiles immediately.
2. **Phase 3, writing in batches:**
   - Chapter 1 as one batch.
   - Chapter 2 as three batches: 2.1 to 2.4, 2.5 to 2.8, then 2.9 to 2.11.
   - Chapter 3 as one batch.
   - Chapter 4 as one batch.
   - After each batch, I update the matching `summary.sections` keywords.
3. **Final pass:** check every `scrollToId` against the table of contents, then give you the media checklist with file names.

**Conventions I'll follow:**
- Global semantic tags only (`h1` to `h4`, `p`, `pre code`), with no font-size overrides.
- Theme tokens only, so both light and dark mode work.
- The gotchas from my code review get folded into the right sub-topics: streaming usage, lowercasing input, `sleep`, window start, summary cut points, and re-encoding the corpus.
- Code goes inside `<pre><code>{`...`}</code></pre>`, with braces and backticks escaped.

## I need these to start Phase 2

1. Your **`BlogEntry` type, the `AppContext` type, and one already-registered blog**, so the skeleton compiles against your real code.
2. **How to show formulas.** The default is monospace in `<pre><code>`, so tell me if you have a KaTeX component.
3. **Where images live.** The default is `public/blogs/ai-engineering-foundations/`.

If you don't answer 2 and 3, I'll use those defaults.
